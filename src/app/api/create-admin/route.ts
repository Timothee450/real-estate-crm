import { NextResponse } from 'next/server';
import { db } from '@/lib/db-minimal';

// This is a super-simplified user creation without bcrypt
// Just to get something working on Vercel
export async function GET() {
  try {
    // Step 1: Check if users table exists
    try {
      const tableCheck = await db.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
      );
      
      if (!tableCheck.rows[0].exists) {
        // Create a simple users table
        await db.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }
    } catch (tableError) {
      return NextResponse.json({
        status: 'error',
        phase: 'table-check',
        message: tableError.message
      }, { status: 500 });
    }
    
    // Step 2: Create fixed admin user with simple password
    // NOTE: In a production app, never store passwords in plain text
    // This is only for testing purposes
    try {
      // Check if admin exists
      const userCheck = await db.query(
        "SELECT * FROM users WHERE email = 'admin@example.com'"
      );
      
      if (userCheck.rows.length === 0) {
        // Create admin user with simple password
        await db.query(
          'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
          ['Admin User', 'admin@example.com', 'admin123'] // Simple password for testing
        );
      }
      
      return NextResponse.json({
        status: 'success',
        message: 'Admin user is ready',
        adminEmail: 'admin@example.com',
        adminPassword: 'admin123'
      });
    } catch (userError) {
      return NextResponse.json({
        status: 'error',
        phase: 'user-creation',
        message: userError.message
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
} 