import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyAuthSystem } from '../utils/auth-verification';

export async function POST(request: Request) {
  try {
    // First verify the auth system is properly configured
    const authSystemCheck = await verifyAuthSystem();
    if (!authSystemCheck.success && authSystemCheck.critical) {
      console.error('Critical auth system issues:', authSystemCheck.issues);
      return NextResponse.json(
        { 
          error: 'Authentication system not properly configured',
          issues: authSystemCheck.issues.map(issue => ({
            component: issue.component,
            error: issue.error,
            fix: issue.fix
          })) 
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;
    
    console.log(`Login attempt for email: ${email}`);
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    console.log(`Query result rows: ${result.rows.length}`);
    
    if (result.rows.length === 0) {
      console.log('User not found');
      // Don't leak information about whether the user exists
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const user = result.rows[0];
    
    // Check if user has a password field
    if (!user.password) {
      console.error(`User ${user.id} has no password field`);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if password matches
    const passwordMatches = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${passwordMatches}`);
    
    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Internal server error - JWT not configured' },
        { status: 500 }
      );
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      jwtSecret,
      { expiresIn: '1d' }
    );
    
    console.log(`Login successful for ${email}`);
    
    // Create response with user data
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
    
    // Set JWT token as HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 