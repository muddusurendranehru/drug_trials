const fs = require('fs');
const path = require('path');
const pg = require('pg');
const dotenv = require('dotenv');

// Load env vars from backend/.env if present, otherwise rely on process env
const envPath = path.resolve('backend/.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL is not set. Provide it via env before running this script.');
  process.exit(1);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/run-sql.js <path-to-sql-file>');
  process.exit(1);
}

const absolutePath = path.resolve(filePath);
if (!fs.existsSync(absolutePath)) {
  console.error(`❌ SQL file not found: ${absolutePath}`);
  process.exit(1);
}

const sql = fs.readFileSync(absolutePath, 'utf8');
const statements = sql
  .split(/;\s*(?:\r?\n|$)/g)
  .map((stmt) => stmt.trim())
  .filter((stmt) => stmt.length > 0);

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log(`▶️  Executing ${statements.length} statements from ${absolutePath}`);
  const client = await pool.connect();

  try {
    for (const statement of statements) {
      const preview = statement.length > 80 ? `${statement.slice(0, 77)}...` : statement;
      try {
        const result = await client.query(statement);
        const meta = result.command === 'SELECT'
          ? `rows=${result.rowCount}`
          : `${result.command}`;
        console.log(`   ✓ ${meta} :: ${preview}`);
      } catch (err) {
        console.error(`   ❌ Failed statement: ${preview}`);
        throw err;
      }
    }
    console.log('✅ SQL file executed successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('❌ SQL execution halted:', err.message);
  process.exit(1);
});

