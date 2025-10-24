-- CHECK TABLES FOR NULL ID ISSUE
-- Run this in your Neon console to see what's happening

-- ===========================================
-- 1. CHECK USERS TABLE STRUCTURE
-- ===========================================
SELECT 'USERS TABLE STRUCTURE:' as section;
SELECT 
    column_name as "Column Name",
    data_type as "Data Type",
    is_nullable as "Nullable",
    column_default as "Default Value",
    is_identity as "Is Identity"
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- ===========================================
-- 2. CHECK USERS TABLE CONTENT
-- ===========================================
SELECT 'USERS TABLE CONTENT:' as section;
SELECT 
    id as "ID",
    email as "Email",
    name as "Name",
    phone as "Phone",
    created_at as "Created"
FROM users
ORDER BY id;

-- ===========================================
-- 3. CHECK FOR NULL IDs
-- ===========================================
SELECT 'NULL ID CHECK:' as section;
SELECT 
    count(*) as "Total Rows",
    count(id) as "Non-Null IDs",
    count(*) - count(id) as "Null IDs"
FROM users;

-- ===========================================
-- 4. CHECK SEQUENCES
-- ===========================================
SELECT 'SEQUENCES CHECK:' as section;
SELECT 
    sequence_name as "Sequence Name",
    last_value as "Last Value",
    start_value as "Start Value",
    increment_by as "Increment By"
FROM information_schema.sequences
WHERE sequence_name LIKE '%users%' OR sequence_name LIKE '%drug_trials%';

-- ===========================================
-- 5. CHECK DRUG_TRIALS TABLE STRUCTURE
-- ===========================================
SELECT 'DRUG_TRIALS TABLE STRUCTURE:' as section;
SELECT 
    column_name as "Column Name",
    data_type as "Data Type",
    is_nullable as "Nullable",
    column_default as "Default Value",
    is_identity as "Is Identity"
FROM information_schema.columns 
WHERE table_name = 'drug_trials'
ORDER BY ordinal_position;

-- ===========================================
-- 6. CHECK DRUG_TRIALS TABLE CONTENT
-- ===========================================
SELECT 'DRUG_TRIALS TABLE CONTENT:' as section;
SELECT 
    id as "ID",
    user_id as "User ID",
    trial_acronym as "Trial Acronym",
    drug_name as "Drug Name",
    created_at as "Created"
FROM drug_trials
ORDER BY id;

-- ===========================================
-- 7. CHECK FOREIGN KEY RELATIONSHIPS
-- ===========================================
SELECT 'FOREIGN KEY CHECK:' as section;
SELECT 
    dt.id as "Trial ID",
    dt.user_id as "User ID",
    u.id as "User Exists",
    u.name as "User Name"
FROM drug_trials dt
LEFT JOIN users u ON dt.user_id = u.id
ORDER BY dt.id;
