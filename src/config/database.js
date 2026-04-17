import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const { DATABASE_URL, DATABASE_SSL_REJECT_UNAUTHORIZED } = process.env;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set in environment variables');
  throw new Error('DATABASE_URL is required');
}

const postgresOptions =
  DATABASE_SSL_REJECT_UNAUTHORIZED === 'false' ? { ssl: { rejectUnauthorized: false } } : {};

const client = postgres(DATABASE_URL, postgresOptions);
const db = drizzle(client);

export { db, client };
