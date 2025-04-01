import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function auth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return {
      user: {
        id: payload.sub,
        email: payload.email,
      },
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
} 