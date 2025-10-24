-- CLINICAL DRUG TRIALS DATABASE SETUP
-- Database: drug_trials (Neon PostgreSQL)
-- Following rules: Database first, tables are important, schema must be seen

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS drug_trials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================
-- TABLE 1: USERS
-- ===========================================
-- Purpose: Store user authentication and profile data
-- Primary Key: UUID (not integer as per rules)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- TABLE 2: DRUG_TRIALS  
-- ===========================================
-- Purpose: Store clinical drug trial data
-- Primary Key: UUID (not integer as per rules)
-- Foreign Key: user_id references users(id)
CREATE TABLE drug_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
-- INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_drug_trials_user_id ON drug_trials(user_id);
CREATE INDEX idx_drug_trials_created_at ON drug_trials(created_at);

-- ===========================================
-- SAMPLE DATA FOR TESTING
-- ===========================================
-- Insert sample user (password: "password123" hashed)
INSERT INTO users (email, name, phone, password_hash) VALUES 
('lakshmi@galla.com', 'Lakshmi Galla', '+91-9961234567', '$2b$10$example_hash_here'),
('test@example.com', 'Test User', '1234567890', '$2b$10$example_hash_here');

-- Insert sample drug trial
INSERT INTO drug_trials (user_id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article) 
SELECT 
    u.id,
    'RECOVERY',
    'Randomised Evaluation of COVID-19 Therapy',
    'Dexamethasone',
    'Reduced mortality by 35% in severe cases',
    'This trial showed that dexamethasone reduced mortality in patients with severe COVID-19 requiring oxygen or mechanical ventilation.',
    'Bar chart showing 35% mortality reduction with dexamethasone vs placebo',
    'https://www.nejm.org/doi/full/10.1056/NEJMoa2021436'
FROM users u WHERE u.email = 'lakshmi@galla.com';

-- ===========================================
-- VERIFY TABLES AND DATA
-- ===========================================
-- Show table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('users', 'drug_trials')
ORDER BY table_name, ordinal_position;

-- Show sample data
SELECT 'USERS TABLE DATA:' as info;
SELECT id, email, name, phone, created_at FROM users;

SELECT 'DRUG_TRIALS TABLE DATA:' as info;
SELECT id, user_id, trial_acronym, trial_full_name, drug_name, result, created_at FROM drug_trials;
