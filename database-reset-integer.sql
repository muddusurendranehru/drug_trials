-- RESET DATABASE TO INTEGER PRIMARY KEYS
-- This will drop existing tables and recreate with INTEGER primary keys

-- ===========================================
-- STEP 1: DROP EXISTING TABLES (CASCADE)
-- ===========================================
-- Drop tables in correct order (child first, then parent)
DROP TABLE IF EXISTS drug_trials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================
-- STEP 2: CREATE TABLES WITH INTEGER PRIMARY KEYS
-- ===========================================

-- Table 1: users - INTEGER PRIMARY KEY
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: drug_trials - INTEGER PRIMARY KEY
CREATE TABLE drug_trials (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    trial_acronym VARCHAR(100) NOT NULL,
    trial_full_name TEXT NOT NULL,
    drug_name VARCHAR(255) NOT NULL,
    result TEXT NOT NULL,
    brief_abstract TEXT,
    image_prompt TEXT,
    reference_article TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- STEP 3: CREATE INDEXES
-- ===========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_drug_trials_user_id ON drug_trials(user_id);
CREATE INDEX idx_drug_trials_created_at ON drug_trials(created_at);

-- ===========================================
-- STEP 4: INSERT SAMPLE DATA WITH INTEGER IDs
-- ===========================================
-- Insert sample users with INTEGER IDs
INSERT INTO users (id, email, name, phone, password_hash) VALUES 
(1, 'lakshmi@galla.com', 'Lakshmi Galla', '+91-9961234567', '$2b$10$example_hash_here'),
(2, 'test@example.com', 'Test User', '1234567890', '$2b$10$example_hash_here');

-- Insert sample drug trials with INTEGER IDs
INSERT INTO drug_trials (id, user_id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article) VALUES
(1, 1, 'RECOVERY', 'Randomised Evaluation of COVID-19 Therapy', 'Dexamethasone', 'Reduced mortality by 35% in severe cases', 'This trial showed that dexamethasone reduced mortality in patients with severe COVID-19 requiring oxygen or mechanical ventilation.', 'Bar chart showing 35% mortality reduction with dexamethasone vs placebo', 'https://www.nejm.org/doi/full/10.1056/NEJMoa2021436'),
(2, 2, 'TEST', 'Test Clinical Trial', 'Test Drug', 'Positive results', 'This is a test trial with positive results.', 'Bar chart showing 30% improvement', 'https://example.com/article');

-- ===========================================
-- STEP 5: VERIFY TABLES CREATED WITH INTEGER PRIMARY KEYS
-- ===========================================
-- Show table structure
SELECT 'TABLE STRUCTURE VERIFICATION:' as section;
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('users', 'drug_trials')
ORDER BY table_name, ordinal_position;

-- Show sample data with INTEGER IDs
SELECT 'USERS TABLE DATA (INTEGER IDs):' as section;
SELECT id, email, name, phone, created_at FROM users ORDER BY id;

SELECT 'DRUG_TRIALS TABLE DATA (INTEGER IDs):' as section;
SELECT id, user_id, trial_acronym, trial_full_name, drug_name, result, created_at FROM drug_trials ORDER BY id;

-- Verify INTEGER primary keys
SELECT 'INTEGER PRIMARY KEY VERIFICATION:' as section;
SELECT 
    'users' as "Table",
    count(*) as "Total Rows",
    min(id) as "Min ID",
    max(id) as "Max ID"
FROM users
UNION ALL
SELECT 
    'drug_trials' as "Table",
    count(*) as "Total Rows",
    min(id) as "Min ID", 
    max(id) as "Max ID"
FROM drug_trials;
