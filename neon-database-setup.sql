-- Clinical Drug Trials Database Setup for Neon PostgreSQL
-- Run this in your Neon SQL Editor at: https://console.neon.tech/app/projects/autumn-darkness-64907462/branches/br-sweet-scene-a1jwwdse/tables?database=drug_trials

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS drug_trials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table 1: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: drug_trials
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

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_drug_trials_user_id ON drug_trials(user_id);
CREATE INDEX idx_drug_trials_created_at ON drug_trials(created_at);

-- Verify tables were created
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'drug_trials')
ORDER BY table_name, ordinal_position;
