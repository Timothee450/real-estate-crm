import { NextResponse } from 'next/server';
import { db } from '@/lib/db-minimal';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const email = body.email || '';
    const password = body.password || '';
    
    console.log(`Login attempt for: ${email}`);
    
    if (!email || !password) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Email and password are required' 
      }, { status: 400 });
    }
    
    // Find user with exact match (no hashing for simplicity)
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    console.log(`Query returned ${result.rows.length} rows`);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    const user = result.rows[0];
    
    // Simple password check (THIS IS NOT SECURE - just for testing)
    if (user.password !== password) {
      console.log('Password does not match');
      return NextResponse.json({ 
        status: 'error', 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
    
    // Create a simple token (not a proper JWT)
    const simpleToken = Buffer.from(
      `${user.id}:${user.email}:${Date.now()}`
    ).toString('base64');
    
    console.log(`Login successful for ${email}`);
    
    // Create response with user data
    const response = NextResponse.json({
      status: 'success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
    // Set token as cookie
    response.cookies.set({
      name: 'token',
      value: simpleToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
} 