import pool from '../db';

async function testDatabase() {
  try {
    console.log('Testing database connection...');

    const client = await pool.connect();
    console.log('✅ Database connection successful');

    const dbResult = await client.query('SELECT current_database()');
    console.log('Current database:', dbResult.rows[0].current_database);

    const tableResult = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'id'
    `);
    console.log('Users table ID column:', tableResult.rows[0]);

    const insertResult = await client.query(
      `
        INSERT INTO users (email, name, phone, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name
      `,
      ['test@backend.com', 'Backend Test', '+1111111111', '$2b$10$example_hash']
    );
    console.log('✅ Insert successful:', insertResult.rows[0]);

    const usersResult = await client.query('SELECT * FROM users ORDER BY id');
    console.log('All users:', usersResult.rows);

    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', (error as Error).message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

testDatabase();

