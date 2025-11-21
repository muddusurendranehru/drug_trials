-- CLINICAL DRUG TRIALS DATABASE SETUP (INTEGER PRIMARY KEYS)
-- Database: drug_trials_new_neon2 (Neon PostgreSQL)
-- Rules satisfied:
--   • Exactly two tables (users, drug_trials)
--   • Integer PRIMARY KEY with auto-increment
--   • Names / phones / passwords accept universal variations
--   • Sample data included for validation

-- Clean slate
DROP TABLE IF EXISTS drug_trials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================================
-- TABLE 1: users  (staff + colleagues auth)
-- ===========================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- TABLE 2: drug_trials  (clinical entries)
-- ===========================================
CREATE TABLE drug_trials (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trial_acronym VARCHAR(100) NOT NULL,
    trial_full_name TEXT NOT NULL,
    drug_name VARCHAR(255) NOT NULL,
    result TEXT NOT NULL,
    brief_abstract TEXT,
    image_prompt TEXT,
    reference_article TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_drug_trials_user_id ON drug_trials(user_id);
CREATE INDEX idx_drug_trials_created_at ON drug_trials(created_at);

-- ===========================================
-- SAMPLE DATA (password hashes placeholder)
-- ===========================================
INSERT INTO users (email, name, phone, password_hash) VALUES
('lakshmi@galla.com', 'Lakshmi Galla', '+91-9961234567', '$2b$10$example_hash_here'),
('doc@example.com', 'Clinical Lead', '+1-415-996-0000', '$2b$10$example_hash_here');

INSERT INTO drug_trials (
    user_id,
    trial_acronym,
    trial_full_name,
    drug_name,
    result,
    brief_abstract,
    image_prompt,
    reference_article
) VALUES
(
    1,
    'RECOVERY',
    'Randomised Evaluation of COVID-19 Therapy',
    'Dexamethasone',
    'Reduced mortality by 35% in severe cases',
    'This trial showed dexamethasone lowered mortality in ventilated COVID-19 patients.',
    'Bar chart showing 35% mortality reduction with dexamethasone vs placebo',
    'https://www.nejm.org/doi/full/10.1056/NEJMoa2021436'
),
(
    2,
    'SURPASS-2',
    'Tirzepatide vs Semaglutide Once Weekly in Type 2 Diabetes',
    'Tirzepatide',
    'HbA1c reduction up to 2.3% at 40 weeks',
    'Weekly tirzepatide produced superior HbA1c and weight reductions vs semaglutide.',
    'Line plot showing HbA1c drop with tirzepatide dosing arms',
    'https://www.nejm.org/doi/full/10.1056/NEJMoa2107519'
);

-- ===========================================
-- QUICK VERIFICATION SELECTS
-- ===========================================
SELECT 'USERS TABLE DATA:' AS info;
SELECT id, email, name, phone, created_at FROM users ORDER BY id;

SELECT 'DRUG_TRIALS TABLE DATA:' AS info;
SELECT id, user_id, trial_acronym, trial_full_name, drug_name, result, created_at
FROM drug_trials
ORDER BY created_at DESC;
