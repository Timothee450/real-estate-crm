import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Define JWT payload type
interface JwtPayload {
  id?: string | number;
  sub?: string | number;
  email?: string;
  name?: string;
  [key: string]: any;
}

export async function GET() {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Authentication system not configured properly' },
        { status: 500 }
      );
    }
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: decoded.id || decoded.sub,
          email: decoded.email
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 