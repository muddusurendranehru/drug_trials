-- URGENT DATABASE FIX - COMPLETELY DROP AND RECREATE
-- The database still has INTEGER columns without SERIAL

-- Step 1: Drop everything completely
DROP TABLE IF EXISTS drug_trials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Step 2: Create users table with SERIAL PRIMARY KEY
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 3: Create drug_trials table with SERIAL PRIMARY KEY
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

-- Step 4: Test the tables work
INSERT INTO users (email, name, phone, password_hash) VALUES 
('test@example.com', 'Test User', '+1234567890', '$2b$10$example_hash');

-- Step 5: Verify the fix
SELECT 'USERS TABLE STRUCTURE:' as info;
\d users;

SELECT 'TEST INSERT:' as info;
SELECT * FROM users;
