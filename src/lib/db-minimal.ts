import { Pool } from 'pg';

// Create PostgreSQL connection pool
const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

export { db }; 