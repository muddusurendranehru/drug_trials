-- FINAL DATABASE FIX - DROP AND RECREATE WITH SERIAL PRIMARY KEYS
-- This will completely fix the NULL ID constraint error

-- Step 1: Drop existing tables (this will delete all data)
DROP TABLE IF EXISTS drug_trials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Create users table with SERIAL PRIMARY KEY
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- This will auto-increment: 1, 2, 3, 4...
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 3: Create drug_trials table with SERIAL PRIMARY KEY
CREATE TABLE drug_trials (
    id SERIAL PRIMARY KEY,  -- This will auto-increment: 1, 2, 3, 4...
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

-- Step 4: Insert sample data to test
INSERT INTO users (email, name, phone, password_hash) VALUES 
('admin@example.com', 'Admin User', '+1234567890', '$2b$10$example_hash'),
('test@example.com', 'Test User', '+9876543210', '$2b$10$example_hash');

INSERT INTO drug_trials (user_id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article) VALUES 
(1, 'TEST-001', 'Test Trial 1', 'Test Drug A', 'Positive Results', 'This is a test trial', 'Test image prompt', 'https://example.com/article1'),
(2, 'TEST-002', 'Test Trial 2', 'Test Drug B', 'Negative Results', 'This is another test trial', 'Test image prompt 2', 'https://example.com/article2');

-- Step 5: Verify the tables are created correctly
SELECT 'USERS TABLE STRUCTURE:' as info;
\d users;

SELECT 'DRUG_TRIALS TABLE STRUCTURE:' as info;
\d drug_trials;

-- Step 6: Check the data
SELECT 'USERS DATA:' as info;
SELECT * FROM users;

SELECT 'DRUG_TRIALS DATA:' as info;
SELECT * FROM drug_trials;

-- Step 7: Test auto-increment by inserting a new user
INSERT INTO users (email, name, phone, password_hash) VALUES 
('newuser@example.com', 'New User', '+1111111111', '$2b$10$example_hash');

SELECT 'NEW USER CREATED:' as info;
SELECT * FROM users WHERE email = 'newuser@example.com';

-- Step 8: Show sequence information
SELECT 'SEQUENCE INFORMATION:' as info;
SELECT sequence_name, last_value FROM pg_sequences WHERE sequence_name LIKE '%users%' OR sequence_name LIKE '%drug_trials%';
