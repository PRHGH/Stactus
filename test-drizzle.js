import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users } from './src/models/user.model.js';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function testDrizzle() {
  console.log('Testing Drizzle query...');
  
  try {
    // Test Drizzle select
    const result = await db.select().from(users).limit(1);
    console.log('✓ Drizzle select successful:', result);
    
    // Test Drizzle where clause
    const filtered = await db.select().from(users).where(eq(users.email, 'test@test.com')).limit(1);
    console.log('✓ Drizzle where clause successful:', filtered);
    
  } catch (error) {
    console.error('✗ Drizzle Error:', {
      message: error.message,
      cause: error.cause,
    });
  }
}

testDrizzle();
