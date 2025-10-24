-- DATABASE CONTENT VERIFICATION
-- Check actual data in your Neon database

-- ===========================================
-- 1. CHECK TABLE ROW COUNTS
-- ===========================================
SELECT 'TABLE ROW COUNTS:' as section;
SELECT 
    'users' as table_name,
    count(*) as row_count
FROM users
UNION ALL
SELECT 
    'drug_trials' as table_name,
    count(*) as row_count  
FROM drug_trials;

-- ===========================================
-- 2. CHECK USERS TABLE CONTENT
-- ===========================================
SELECT 'USERS TABLE CONTENT:' as section;
SELECT 
    id,
    email,
    name,
    phone,
    created_at
FROM users
ORDER BY created_at DESC;

-- ===========================================
-- 3. CHECK DRUG_TRIALS TABLE CONTENT
-- ===========================================
SELECT 'DRUG_TRIALS TABLE CONTENT:' as section;
SELECT 
    id,
    user_id,
    trial_acronym,
    trial_full_name,
    drug_name,
    result,
    brief_abstract,
    image_prompt,
    reference_article,
    created_at
FROM drug_trials
ORDER BY created_at DESC;

-- ===========================================
-- 4. CHECK FOREIGN KEY RELATIONSHIPS
-- ===========================================
SELECT 'FOREIGN KEY RELATIONSHIPS:' as section;
SELECT 
    dt.id as trial_id,
    dt.trial_acronym,
    dt.drug_name,
    u.name as user_name,
    u.email as user_email
FROM drug_trials dt
JOIN users u ON dt.user_id = u.id
ORDER BY dt.created_at DESC;

-- ===========================================
-- 5. CHECK UUID FORMAT VALIDATION
-- ===========================================
SELECT 'UUID FORMAT VALIDATION:' as section;
SELECT 
    'users' as table_name,
    count(*) as total_rows,
    count(CASE WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as valid_uuids
FROM users
UNION ALL
SELECT 
    'drug_trials' as table_name,
    count(*) as total_rows,
    count(CASE WHEN id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 1 END) as valid_uuids
FROM drug_trials;

-- ===========================================
-- 6. CHECK DATA TYPES AND CONSTRAINTS
-- ===========================================
SELECT 'DATA TYPE VERIFICATION:' as section;
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('users', 'drug_trials')
ORDER BY table_name, ordinal_position;
