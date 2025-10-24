-- FIX BACKEND NULL ID ISSUE
-- Run this in your Neon console to fix the ID column

-- ===========================================
-- STEP 1: DROP AND RECREATE TABLES WITH PROPER SERIAL
-- ===========================================

-- Drop existing tables
DROP TABLE IF EXISTS drug_trials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with SERIAL (auto-increment)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create drug_trials table with SERIAL (auto-increment)
CREATE TABLE drug_trials (
    id SERIAL PRIMARY KEY,
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

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_drug_trials_user_id ON drug_trials(user_id);
CREATE INDEX idx_drug_trials_created_at ON drug_trials(created_at);

-- ===========================================
-- STEP 2: INSERT SAMPLE DATA
-- ===========================================

-- Insert sample users (let SERIAL auto-generate IDs)
INSERT INTO users (email, name, phone, password_hash) VALUES 
('lakshmi@galla.com', 'Lakshmi Galla', '+91-9961234567', '$2b$10$example_hash_here'),
('test@example.com', 'Test User', '1234567890', '$2b$10$example_hash_here');

-- Insert sample drug trials (let SERIAL auto-generate IDs)
INSERT INTO drug_trials (user_id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article) VALUES
(1, 'RECOVERY', 'Randomised Evaluation of COVID-19 Therapy', 'Dexamethasone', 'Reduced mortality by 35% in severe cases', 'This trial showed that dexamethasone reduced mortality in patients with severe COVID-19 requiring oxygen or mechanical ventilation.', 'Bar chart showing 35% mortality reduction with dexamethasone vs placebo', 'https://www.nejm.org/doi/full/10.1056/NEJMoa2021436'),
(2, 'TEST', 'Test Clinical Trial', 'Test Drug', 'Positive results', 'This is a test trial with positive results.', 'Bar chart showing 30% improvement', 'https://example.com/article');

-- ===========================================
-- STEP 3: VERIFY TABLES ARE FIXED
-- ===========================================

-- Check users table structure
SELECT 'USERS TABLE STRUCTURE:' as section;
SELECT 
    column_name as "Column Name",
    data_type as "Data Type",
    is_nullable as "Nullable",
    column_default as "Default Value"
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check users table content
SELECT 'USERS TABLE CONTENT:' as section;
SELECT 
    id as "ID",
    email as "Email",
    name as "Name",
    phone as "Phone",
    created_at as "Created"
FROM users
ORDER BY id;

-- Check sequences
SELECT 'SEQUENCES CHECK:' as section;
SELECT 
    sequence_name as "Sequence Name",
    last_value as "Last Value"
FROM information_schema.sequences
WHERE sequence_name LIKE '%users%' OR sequence_name LIKE '%drug_trials%';
