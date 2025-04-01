import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Specify Node.js runtime to avoid Edge compatibility issues with jsonwebtoken
export const runtime = 'nodejs';

export interface JwtPayload {
  id: string | number;
  email: string;
  name?: string;
}

/**
 * Verifies a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export async function verifyJWT(token: string): Promise<JwtPayload | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured');
      return null;
    }
    
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Gets the current user from the JWT token in cookies
 */
export async function getCurrentUser(): Promise<JwtPayload | null> {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) return null;
    
    return await verifyJWT(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get token from request
 */
export function getTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get('token')?.value;
}

/**
 * Create a new JWT token
 */
export function createToken(payload: object, expiresIn = '1d'): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Legacy auth function 
 */
export async function auth() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }
    
    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return { id: decoded.id };
    } catch (error) {
      throw new Error('Invalid token');
    }
  } catch (error) {
    throw new Error('Not authenticated');
  }
} 