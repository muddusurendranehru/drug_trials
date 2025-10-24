-- VERIFY DATABASE SCHEMA - CHECK IF SERIAL PRIMARY KEY IS WORKING

-- Step 1: Check users table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Step 2: Check if there's a sequence for users.id
SELECT 
    sequence_name, 
    last_value, 
    increment_by
FROM pg_sequences 
WHERE sequence_name LIKE '%users%';

-- Step 3: Try to insert a test user to see if auto-increment works
INSERT INTO users (email, name, phone, password_hash) VALUES 
('test@example.com', 'Test User', '+1234567890', '$2b$10$example_hash');

-- Step 4: Check what ID was assigned
SELECT id, email, name FROM users WHERE email = 'test@example.com';

-- Step 5: Show all users
SELECT * FROM users ORDER BY id;
