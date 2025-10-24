import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Clinical Drug Trials API is running with INTEGER primary keys' });
});

// === USER ROUTES ===

// Sign Up
app.post('/api/signup', async (req, res) => {
  try {
    const { email, name, phone, password, confirmPassword } = req.body;
    
    // Validate required fields
    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, name, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, name, phone',
      [email, name, phone, password_hash]
    );
    
    res.json({ 
      message: 'User created successfully', 
      user: result.rows[0] 
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message });
    }
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        phone: user.phone 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// === DRUG TRIALS ROUTES ===

// Create drug trial
app.post('/api/trials', authenticateToken, async (req, res) => {
  try {
    const { 
      trial_acronym, 
      trial_full_name, 
      drug_name, 
      result, 
      brief_abstract, 
      image_prompt, 
      reference_article 
    } = req.body;
    
    // Validate required fields
    if (!trial_acronym || !trial_full_name || !drug_name || !result) {
      return res.status(400).json({ error: 'Trial acronym, full name, drug name, and result are required' });
    }
    
    const dbResult = await pool.query(
      `INSERT INTO drug_trials (user_id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article]
    );
    
    res.json(dbResult.rows[0]);
  } catch (error) {
    console.error('Create trial error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all trials for user
app.get('/api/trials', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM drug_trials WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get trials error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single trial
app.get('/api/trials/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM drug_trials WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trial not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get trial error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update trial
app.put('/api/trials/:id', authenticateToken, async (req, res) => {
  try {
    const { 
      trial_acronym, 
      trial_full_name, 
      drug_name, 
      result, 
      brief_abstract, 
      image_prompt, 
      reference_article 
    } = req.body;
    
    const dbResult = await pool.query(
      `UPDATE drug_trials 
       SET trial_acronym = $1, trial_full_name = $2, drug_name = $3, result = $4, 
           brief_abstract = $5, image_prompt = $6, reference_article = $7
       WHERE id = $8 AND user_id = $9 
       RETURNING *`,
      [trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article, req.params.id, req.user.id]
    );
    
    if (dbResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trial not found' });
    }
    
    res.json(dbResult.rows[0]);
  } catch (error) {
    console.error('Update trial error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete trial
app.delete('/api/trials/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM drug_trials WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trial not found' });
    }
    
    res.json({ message: 'Trial deleted successfully' });
  } catch (error) {
    console.error('Delete trial error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3039;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} with INTEGER primary keys`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
