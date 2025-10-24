-- FINAL DATABASE TEST - DIRECT INSERT TO VERIFY SEQUENCE

-- Step 1: Clear any existing test data
DELETE FROM users WHERE email = 'test@test.com';

-- Step 2: Insert a test user (this should auto-generate ID)
INSERT INTO users (email, name, phone, password_hash) VALUES 
('test@test.com', 'Test User', '+1234567890', '$2b$10$example_hash');

-- Step 3: Check what ID was assigned
SELECT 'TEST USER CREATED:' as info;
SELECT id, email, name FROM users WHERE email = 'test@test.com';

-- Step 4: Show all users
SELECT 'ALL USERS:' as info;
SELECT * FROM users ORDER BY id;

-- Step 5: Check sequence status
SELECT 'SEQUENCE STATUS:' as info;
SELECT last_value FROM users_id_seq;
