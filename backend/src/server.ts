import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { JWT_SECRET, PORT = '3000', OPENAI_API_KEY } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured. Update backend/.env before running the server.');
}

type JwtUserPayload = JwtPayload & {
  id: number;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded as JwtUserPayload;
    next();
  });
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Clinical Drug Trials API is running' });
});

interface SignupBody {
  email: string;
  name: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

app.post('/api/signup', async (req: Request<unknown, unknown, SignupBody>, res: Response) => {
  try {
    const { email, name, phone, password, confirmPassword } = req.body;

    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (email, name, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, name, phone',
      [email, name, phone ?? null, passwordHash]
    );

    return res.json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

interface LoginBody {
  email: string;
  password: string;
}

app.post('/api/login', async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    return res.json({
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
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const result = await pool.query(
      'SELECT id, email, name, phone, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

interface TrialBody {
  trial_acronym: string;
  trial_full_name: string;
  drug_name: string;
  result: string;
  brief_abstract?: string;
  image_prompt?: string;
  reference_article?: string;
}

interface AiSearchBody {
  query: string;
  sources?: string[];
}

interface AiSearchResult {
  trial_acronym: string;
  trial_full_name: string;
  drug_name: string;
  result: string;
  brief_abstract: string;
  reference_article: string;
  source_label: string;
  confidence: string;
}

const buildMockAiResults = (query: string): AiSearchResult[] => {
  const base = query.trim().split(/\s+/)[0].toUpperCase() || 'TRIAL';

  return [
    {
      trial_acronym: `${base}-I`,
      trial_full_name: `${query} Early Phase Study`,
      drug_name: query,
      result: 'Demonstrated promising improvements across cardiometabolic biomarkers in a 24-week cohort.',
      brief_abstract: `Pilot study evaluating ${query} versus standard care across 120 participants. Primary endpoints included HbA1c, LDL, and weight change.`,
      reference_article: `https://clinicaltrials.gov/search?term=${encodeURIComponent(query)}`,
      source_label: 'ClinicalTrials.gov (mock)',
      confidence: '0.72'
    },
    {
      trial_acronym: `${base}-II`,
      trial_full_name: `${query} Global Outcomes`,
      drug_name: query,
      result: 'Met composite cardiology endpoints with favorable safety signals.',
      brief_abstract: `Randomized phase II trial comparing ${query} against placebo with background therapy. Secondary analysis highlights regional variations.`,
      reference_article: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}`,
      source_label: 'PubMed (mock)',
      confidence: '0.64'
    }
  ];
};

const buildAiPrompt = (query: string, sources: string[]) => {
  const sourceList = sources.length > 0 ? sources.join(', ') : 'leading cardiology and diabetology journals';
  return `
You are an AI research assistant for clinicians. Provide up to 3 recent clinical trial summaries about "${query}" sourced from ${sourceList}.
Respond strictly as JSON with the shape:
{
  "results": [
    {
      "trial_acronym": "",
      "trial_full_name": "",
      "drug_name": "",
      "result": "",
      "brief_abstract": "",
      "reference_article": "",
      "source_label": "",
      "confidence": "0.85"
    }
  ]
}
`;
};

const fetchAiResults = async (query: string, sources: string[] = []): Promise<AiSearchResult[]> => {
  if (!OPENAI_API_KEY) {
    return buildMockAiResults(query);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a precise clinical research assistant for endocrinologists.' },
        { role: 'user', content: buildAiPrompt(query, sources) }
      ]
    })
  });

  if (!response.ok) {
    console.error('OpenAI error:', response.status, await response.text());
    return buildMockAiResults(query);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return buildMockAiResults(query);
  }

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed.results)) {
      return parsed.results.slice(0, 3);
    }
    return buildMockAiResults(query);
  } catch (error) {
    console.error('AI parse error:', error);
    return buildMockAiResults(query);
  }
};

app.post('/api/trials', authenticateToken, async (req: Request<unknown, unknown, TrialBody>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const {
      trial_acronym,
      trial_full_name,
      drug_name,
      result: trialResult,
      brief_abstract,
      image_prompt,
      reference_article
    } = req.body;

    if (!trial_acronym || !trial_full_name || !drug_name || !trialResult) {
      return res.status(400).json({ error: 'Trial acronym, full name, drug name, and result are required' });
    }

    const dbResult = await pool.query(
      `INSERT INTO drug_trials
        (user_id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        trial_acronym,
        trial_full_name,
        drug_name,
        trialResult,
        brief_abstract ?? null,
        image_prompt ?? null,
        reference_article ?? null
      ]
    );

    return res.json(dbResult.rows[0]);
  } catch (error) {
    console.error('Create trial error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/trials', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const result = await pool.query(
      'SELECT * FROM drug_trials WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Get trials error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/trials/search', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const { q = '', specialty = 'All' } = req.query as { q?: string; specialty?: string };
    const values: Array<number | string> = [userId];
    const clauses = ['user_id = $1'];

    if (q) {
      values.push(`%${q}%`);
      const idx = values.length;
      clauses.push(`(
        trial_acronym ILIKE $${idx}
        OR trial_full_name ILIKE $${idx}
        OR drug_name ILIKE $${idx}
        OR result ILIKE $${idx}
      )`);
    }

    if (specialty && specialty !== 'All') {
      values.push(`%${specialty}%`);
      const idx = values.length;
      clauses.push(`(
        drug_name ILIKE $${idx}
        OR trial_full_name ILIKE $${idx}
        OR brief_abstract ILIKE $${idx}
      )`);
    }

    const query = `
      SELECT * FROM drug_trials
      WHERE ${clauses.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const result = await pool.query(query, values);
    return res.json(result.rows);
  } catch (error) {
    console.error('Smart search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/trials/:id', authenticateToken, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const result = await pool.query(
      'SELECT * FROM drug_trials WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trial not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Get trial error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.put(
  '/api/trials/:id',
  authenticateToken,
  async (req: Request<{ id: string }, unknown, TrialBody>, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const {
      trial_acronym,
      trial_full_name,
      drug_name,
      result: trialResult,
      brief_abstract,
      image_prompt,
      reference_article
    } = req.body;

    const dbResult = await pool.query(
      `UPDATE drug_trials
       SET trial_acronym = $1,
           trial_full_name = $2,
           drug_name = $3,
           result = $4,
           brief_abstract = $5,
           image_prompt = $6,
           reference_article = $7
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        trial_acronym,
        trial_full_name,
        drug_name,
        trialResult,
        brief_abstract ?? null,
        image_prompt ?? null,
        reference_article ?? null,
        id,
        userId
      ]
    );

    if (dbResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trial not found' });
    }

    return res.json(dbResult.rows[0]);
  } catch (error) {
    console.error('Update trial error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/trials/:id', authenticateToken, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const result = await pool.query(
      'DELETE FROM drug_trials WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trial not found' });
    }

    return res.json({ message: 'Trial deleted successfully' });
  } catch (error) {
    console.error('Delete trial error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/ai-search', authenticateToken, async (req: Request<unknown, unknown, AiSearchBody>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const { query, sources = [] } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = await fetchAiResults(query, sources);
    return res.json({ results, usedOpenAI: Boolean(OPENAI_API_KEY) });
  } catch (error) {
    console.error('AI search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(Number(PORT), () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

