import { Pool } from 'pg';

// Create PostgreSQL connection pool
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
});

// Export a prisma-like interface for backward compatibility
export const prisma = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [where.email]);
      return result.rows[0] || null;
    }
  }
};

export { db }; 