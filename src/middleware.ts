import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from './lib/auth';

// Flag to track if we've already checked the system on startup
let systemChecked = false;

export async function middleware(request: NextRequest) {
  // For API routes that should be protected
  if (request.nextUrl.pathname.startsWith('/api/protected') ||
      request.nextUrl.pathname.startsWith('/api/clients') || 
      request.nextUrl.pathname.startsWith('/api/properties')) {
    try {
      // Verify the JWT token
      const token = request.cookies.get('token')?.value;
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      const verified = await verifyJWT(token);
      if (!verified) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      // If verification passed, continue to the route
      return NextResponse.next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }
  }
  
  // For all other routes, just continue
  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    '/api/protected/:path*',
    '/api/clients/:path*',
    '/api/properties/:path*'
  ],
}; 