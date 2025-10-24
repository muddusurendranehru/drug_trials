-- DATABASE VERIFICATION SCRIPT - INTEGER PRIMARY KEYS
-- Following rules: ALWAYS USE INTEGER PRIMARY KEYS - NO UUID, NO SERIAL, JUST INTEGER AUTO_INCREMENT

-- ===========================================
-- 1. SHOW DATABASE CONNECTION INFO
-- ===========================================
SELECT 
    'DATABASE CONNECTION VERIFIED' as status,
    current_database() as database_name,
    current_user as connected_user,
    now() as connection_time;

-- ===========================================
-- 2. SHOW TABLE STRUCTURE (SCHEMA) - INTEGER PRIMARY KEYS
-- ===========================================
SELECT 'TABLE STRUCTURE - USERS (INTEGER PRIMARY KEY):' as section;
SELECT 
    column_name as "Column Name",
    data_type as "Data Type",
    is_nullable as "Nullable",
    column_default as "Default Value"
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT 'TABLE STRUCTURE - DRUG_TRIALS (INTEGER PRIMARY KEY):' as section;
SELECT 
    column_name as "Column Name",
    data_type as "Data Type", 
    is_nullable as "Nullable",
    column_default as "Default Value"
FROM information_schema.columns 
WHERE table_name = 'drug_trials'
ORDER BY ordinal_position;

-- ===========================================
-- 3. SHOW TABLE RELATIONSHIPS - INTEGER FOREIGN KEYS
-- ===========================================
SELECT 'FOREIGN KEY RELATIONSHIPS (INTEGER IDs):' as section;
SELECT 
    tc.table_name as "Child Table",
    kcu.column_name as "Child Column", 
    ccu.table_name as "Parent Table",
    ccu.column_name as "Parent Column"
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('users', 'drug_trials');

-- ===========================================
-- 4. SHOW TABLE CONTENT (DATA) - INTEGER IDs
-- ===========================================
SELECT 'USERS TABLE CONTENT (INTEGER IDs):' as section;
SELECT 
    id as "User ID (INTEGER)",
    email as "Email",
    name as "Full Name", 
    phone as "Phone Number",
    created_at as "Created Date"
FROM users
ORDER BY id;

SELECT 'DRUG_TRIALS TABLE CONTENT (INTEGER IDs):' as section;
SELECT 
    id as "Trial ID (INTEGER)",
    user_id as "User ID (INTEGER)",
    trial_acronym as "Trial Acronym",
    trial_full_name as "Full Trial Name",
    drug_name as "Drug Name",
    result as "Result",
    created_at as "Created Date"
FROM drug_trials
ORDER BY id;

-- ===========================================
-- 5. SHOW INDEXES
-- ===========================================
SELECT 'DATABASE INDEXES:' as section;
SELECT 
    schemaname as "Schema",
    tablename as "Table Name",
    indexname as "Index Name",
    indexdef as "Index Definition"
FROM pg_indexes 
WHERE tablename IN ('users', 'drug_trials')
ORDER BY tablename, indexname;

-- ===========================================
-- 6. SHOW TABLE STATISTICS - INTEGER COUNTS
-- ===========================================
SELECT 'TABLE STATISTICS (INTEGER IDs):' as section;
SELECT 
    'users' as "Table Name",
    count(*) as "Row Count",
    min(id) as "Min ID",
    max(id) as "Max ID"
FROM users
UNION ALL
SELECT 
    'drug_trials' as "Table Name", 
    count(*) as "Row Count",
    min(id) as "Min ID",
    max(id) as "Max ID"
FROM drug_trials;

-- ===========================================
-- 7. VERIFY INTEGER PRIMARY KEYS
-- ===========================================
SELECT 'INTEGER PRIMARY KEY VERIFICATION:' as section;
SELECT 
    'users' as "Table",
    count(*) as "Total Rows",
    count(CASE WHEN id > 0 AND id::text ~ '^[0-9]+$' THEN 1 END) as "Valid Integer IDs"
FROM users
UNION ALL
SELECT 
    'drug_trials' as "Table",
    count(*) as "Total Rows", 
    count(CASE WHEN id > 0 AND id::text ~ '^[0-9]+$' THEN 1 END) as "Valid Integer IDs"
FROM drug_trials;
