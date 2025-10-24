-- CHECK DATABASE LOCATION AND CONNECTION
-- This will show you exactly which database you're connected to

-- Step 1: Check current database name
SELECT 'CURRENT DATABASE:' as info;
SELECT current_database() as database_name;

-- Step 2: Check current user and connection info
SELECT 'CONNECTION INFO:' as info;
SELECT 
    current_user as user_name,
    current_database() as database_name,
    version() as postgresql_version;

-- Step 3: Check if users table exists and its structure
SELECT 'USERS TABLE STRUCTURE:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Step 4: Check if drug_trials table exists
SELECT 'DRUG_TRIALS TABLE STRUCTURE:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'drug_trials' 
ORDER BY ordinal_position;

-- Step 5: Check all tables in current database
SELECT 'ALL TABLES IN DATABASE:' as info;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Step 6: Check if sequences exist (for auto-increment)
SELECT 'SEQUENCES:' as info;
SELECT sequence_name, last_value 
FROM information_schema.sequences 
WHERE sequence_schema = 'public';
