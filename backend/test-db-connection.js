// Test database connection and schema
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
    try {
        console.log('Testing database connection...');
        
        // Test 1: Check if we can connect
        const client = await pool.connect();
        console.log('✅ Database connection successful');
        
        // Test 2: Check current database name
        const dbResult = await client.query('SELECT current_database()');
        console.log('Current database:', dbResult.rows[0].current_database);
        
        // Test 3: Check users table structure
        const tableResult = await client.query(`
            SELECT column_name, data_type, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'id'
        `);
        console.log('Users table ID column:', tableResult.rows[0]);
        
        // Test 4: Try to insert a test user
        const insertResult = await client.query(`
            INSERT INTO users (email, name, phone, password_hash) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, email, name
        `, ['test@backend.com', 'Backend Test', '+1111111111', '$2b$10$example_hash']);
        
        console.log('✅ Insert successful:', insertResult.rows[0]);
        
        // Test 5: Check all users
        const usersResult = await client.query('SELECT * FROM users ORDER BY id');
        console.log('All users:', usersResult.rows);
        
        client.release();
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.error('Error details:', error);
    }
}

testDatabase();
