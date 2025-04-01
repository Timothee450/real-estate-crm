import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from './db';

export async function auth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const payload = jwt.verify(token, secret);

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    // Get user from database
    const userId = payload.sub as string;
    const result = await db.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
} 