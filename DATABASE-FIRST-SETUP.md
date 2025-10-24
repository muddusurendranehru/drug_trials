# 🗄️ DATABASE FIRST SETUP - Following Rules

## Rule 1: Backend First ✅
## Rule 2: Only if database is success start frontend ✅  
## Rule 3: Database middleware frontend must align ✅
## Rule 4: Database is Neon ✅
## Rule 5: Tables are the important ✅
## Rule 6: Tables names, headings, content, schema must be seen ✅

---

## STEP 1: SETUP NEON DATABASE

### 1.1 Go to Neon Console
- **URL**: [https://console.neon.tech/app/projects/autumn-darkness-64907462/branches/br-sweet-scene-a1jwwdse/tables?database=drug_trials](https://console.neon.tech/app/projects/autumn-darkness-64907462/branches/br-sweet-scene-a1jwwdse/tables?database=drug_trials)

### 1.2 Run Database Setup SQL
1. **Open SQL Editor** in your Neon console
2. **Copy entire content** from `database-setup.sql`
3. **Paste and Run** the SQL
4. **Verify**: You should see 2 tables created: `users` and `drug_trials`

### 1.3 Verify Database Schema
1. **Copy content** from `database-verify.sql` 
2. **Run in SQL Editor**
3. **Check output** - you should see:
   - Table structure (schema)
   - Table content (data)
   - Foreign key relationships
   - UUID primary keys
   - Indexes

---

## STEP 2: VERIFY DATABASE SUCCESS

### 2.1 Check Tables Exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'drug_trials');
```

### 2.2 Check Data Content
```sql
-- Users table
SELECT * FROM users;

-- Drug trials table  
SELECT * FROM drug_trials;
```

### 2.3 Verify UUID Primary Keys
```sql
-- Check users table has UUID primary key
SELECT id, email, name FROM users LIMIT 1;

-- Check drug_trials table has UUID primary key
SELECT id, trial_acronym, drug_name FROM drug_trials LIMIT 1;
```

---

## STEP 3: DATABASE CONNECTION TEST

### 3.1 Test Connection String
Your connection string:
```
postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/drug_trials?sslmode=require&channel_binding=require
```

### 3.2 Create Backend .env File
Create `backend/.env` with:
```env
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/drug_trials?sslmode=require&channel_binding=require
JWT_SECRET=clinical_drug_trials_super_secret_jwt_key_2024_secure_random_string
PORT=3000
NODE_ENV=development
```

---

## STEP 4: BACKEND SETUP (Only After Database Success)

### 4.1 Install Dependencies
```bash
cd backend
npm install
```

### 4.2 Test Database Connection
```bash
npm start
```

**Expected Output:**
```
✅ Connected to Neon PostgreSQL database
🚀 Server running on port 3000
📊 Health check: http://localhost:3000/api/health
```

### 4.3 Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test database connection
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phone":"1234567890","password":"password123","confirmPassword":"password123"}'
```

---

## STEP 5: FRONTEND SETUP (Only After Backend Success)

### 5.1 Open Frontend
- Open `frontend/index.html` in browser
- Test complete flow: Sign up → Login → Dashboard

### 5.2 Verify Dashboard Functions
- ✅ Insert data into tables
- ✅ Fetch/view data from tables  
- ✅ Logout functionality

---

## 🎯 DATABASE SCHEMA OVERVIEW

### Table 1: users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key (not integer) |
| email | VARCHAR(255) | Unique email address |
| name | VARCHAR(255) | Full name (universal: lakshmi, Lakshmi, lakshmi galla) |
| phone | VARCHAR(50) | Phone number (universal: +91, 996, 10 digits) |
| password_hash | TEXT | Hashed password (universal: password, Password, password@) |
| created_at | TIMESTAMP | Creation timestamp |

### Table 2: drug_trials
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary Key (not integer) |
| user_id | UUID | Foreign Key to users.id |
| trial_acronym | VARCHAR(100) | Trial abbreviation |
| trial_full_name | TEXT | Full trial name |
| drug_name | VARCHAR(255) | Name of drug |
| result | TEXT | Trial results |
| brief_abstract | TEXT | Trial summary |
| image_prompt | TEXT | Image generation prompt |
| reference_article | TEXT | Reference URL |
| created_at | TIMESTAMP | Creation timestamp |

---

## ✅ SUCCESS CRITERIA

- [ ] Database tables created with UUID primary keys
- [ ] Sample data inserted and visible
- [ ] Backend connects to database successfully
- [ ] API endpoints working (signup, login, CRUD)
- [ ] Frontend can insert and fetch data
- [ ] Dashboard shows table content
- [ ] Logout functionality works

**Only proceed to frontend after ALL database and backend tests pass!**
