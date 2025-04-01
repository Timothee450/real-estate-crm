import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    // Hard-coded test values
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    console.log(`Test login attempt for email: ${testEmail}`);
    
    // Check if the users table exists
    const tableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    
    if (!tableCheck.rows[0].exists) {
      return NextResponse.json({ 
        error: 'Users table does not exist',
        step: 'table_check'
      }, { status: 500 });
    }
    
    // Try to find the user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [testEmail]
    );
    
    console.log(`Query result rows: ${result.rows.length}`);
    
    // Check if user exists
    if (result.rows.length === 0) {
      console.log('User not found');
      return NextResponse.json({ 
        error: 'User not found',
        step: 'user_check'
      }, { status: 404 });
    }
    
    const user = result.rows[0];
    
    // Get the JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ 
        error: 'JWT_SECRET not configured',
        step: 'jwt_secret_check'
      }, { status: 500 });
    }
    
    // Check password field existence
    if (!user.password) {
      return NextResponse.json({ 
        error: 'User has no password field',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hasPassword: false,
          passwordType: typeof user.password
        },
        step: 'password_field_check'
      }, { status: 500 });
    }
    
    // Test real login attempt with password
    const passwordMatches = await bcryptjs.compare(testPassword, user.password);
    console.log(`Password match result: ${passwordMatches}`);
    
    if (!passwordMatches) {
      return NextResponse.json({ 
        error: 'Invalid password',
        step: 'password_match'
      }, { status: 401 });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '1d' }
    );
    
    console.log(`Login successful for ${testEmail}`);
    
    // Create the response
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      success: true,
      step: 'success'
    });
    
    // Set the JWT as an HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24
    });
    
    return response;
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message, step: 'exception' },
      { status: 500 }
    );
  }
}
 