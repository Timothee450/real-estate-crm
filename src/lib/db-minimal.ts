import { Pool } from 'pg';

// Create a simple PostgreSQL connection pool
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

// Simple query function
export { db }; 