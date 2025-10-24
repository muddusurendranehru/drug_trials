-- CHECK EVERYTHING IN DRUG_TRIALS DATABASE
-- This will show you all the data and structure

-- Step 1: Check database name
SELECT 'DATABASE NAME:' as info;
SELECT current_database();

-- Step 2: Check all tables
SELECT 'ALL TABLES:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Step 3: Check users table structure
SELECT 'USERS TABLE STRUCTURE:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Step 4: Check drug_trials table structure
SELECT 'DRUG_TRIALS TABLE STRUCTURE:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'drug_trials' 
ORDER BY ordinal_position;

-- Step 5: Check all users data
SELECT 'ALL USERS DATA:' as info;
SELECT * FROM users ORDER BY id;

-- Step 6: Check all drug_trials data
SELECT 'ALL DRUG_TRIALS DATA:' as info;
SELECT * FROM drug_trials ORDER BY id;

-- Step 7: Check sequences (auto-increment)
SELECT 'SEQUENCES:' as info;
SELECT sequence_name, last_value 
FROM information_schema.sequences 
WHERE sequence_schema = 'public';

-- Step 8: Check foreign key relationships
SELECT 'FOREIGN KEYS:' as info;
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public';

-- Step 9: Count records
SELECT 'RECORD COUNTS:' as info;
SELECT 'Users count:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Drug_trials count:' as table_name, COUNT(*) as count FROM drug_trials;
