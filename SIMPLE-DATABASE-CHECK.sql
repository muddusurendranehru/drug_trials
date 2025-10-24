-- SIMPLE DATABASE CHECK
-- Get basic database information

SELECT current_database();

SELECT current_user;

SELECT version();

SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'users';
