-- TEST DATABASE DIRECTLY - INSERT USER WITHOUT ID

-- Step 1: Clear existing test data
DELETE FROM users WHERE email = 'test@test.com';

-- Step 2: Try to insert a user (this should auto-generate ID)
INSERT INTO users (email, name, phone, password_hash) VALUES 
('test@test.com', 'Test User', '+1234567890', '$2b$10$example_hash');

-- Step 3: Check what ID was assigned
SELECT id, email, name FROM users WHERE email = 'test@test.com';

-- Step 4: Show all users to see the pattern
SELECT * FROM users ORDER BY id;

-- Step 5: Check sequence status
SELECT last_value FROM users_id_seq;
