import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcryptjs from 'bcryptjs';

export async function GET() {
  try {
    // Hard-coded test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    console.log(`Creating test user: ${testUser.email}`);
    
    // Check if the users table exists
    const tableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    
    if (!tableCheck.rows[0].exists) {
      console.log('Users table does not exist, creating it');
      
      // Create the users table
      await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Users table created successfully');
    }
    
    // Check if user already exists
    const userCheck = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [testUser.email]
    );
    
    if (userCheck.rows.length > 0) {
      console.log('Test user already exists, updating password');
      
      // Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(testUser.password, salt);
      
      // Update the user
      await db.query(
        'UPDATE users SET password = $1, name = $2 WHERE email = $3',
        [hashedPassword, testUser.name, testUser.email]
      );
      
      return NextResponse.json({
        message: 'Test user updated successfully',
        email: testUser.email,
        password: testUser.password
      });
    } else {
      console.log('Creating new test user');
      
      // Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(testUser.password, salt);
      
      // Insert the user
      const newUser = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [testUser.name, testUser.email, hashedPassword]
      );
      
      return NextResponse.json({
        message: 'Test user created successfully',
        user: newUser.rows[0],
        testEmail: testUser.email,
        testPassword: testUser.password
      });
    }
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 