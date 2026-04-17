import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    // Test basic connection
    const result = await sql`SELECT 1 as test`;
    console.log('✓ Connection successful:', result);
    
    // Check if users table exists
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✓ Tables in database:', tables);
    
    // Try to select from users
    const users = await sql`SELECT * FROM users LIMIT 1`;
    console.log('✓ Users table accessible:', users);
    
  } catch (error) {
    console.error('✗ Error:', {
      message: error.message,
      code: error.code,
      severity: error.severity,
      detail: error.detail,
      hint: error.hint,
    });
  }
}

testConnection();
