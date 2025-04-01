import { Pool } from 'pg';

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// Mock Prisma client for backward compatibility
const client = {
  findMany: async () => [],
  findUnique: async () => null,
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({})
};

const expense = {
  findMany: async () => [],
  findUnique: async () => null,
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({})
};

const task = {
  findMany: async () => [],
  findUnique: async () => null,
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({})
};

const document = {
  findMany: async () => [],
  findUnique: async () => null,
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({})
};

const appointment = {
  findMany: async () => [],
  findUnique: async () => null,
  create: async () => ({}),
  update: async () => ({}),
  delete: async () => ({})
};

const user = {
  findUnique: async () => null,
  create: async () => ({})
};

// Export the prisma object
export const prisma = {
  client,
  expense,
  task,
  document,
  appointment,
  user
}; 