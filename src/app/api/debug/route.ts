import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check database connection
    const dbResult = await db.query('SELECT NOW()');
    
    // Check if users table exists
    let usersTable = false;
    try {
      const usersResult = await db.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
      );
      usersTable = usersResult.rows[0].exists;
    } catch (error) {
      console.error('Error checking users table:', error);
    }
    
    // Count users if table exists
    let userCount = 0;
    if (usersTable) {
      try {
        const countResult = await db.query('SELECT COUNT(*) FROM users');
        userCount = parseInt(countResult.rows[0].count, 10);
      } catch (error) {
        console.error('Error counting users:', error);
      }
    }
    
    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasJwtSecret = !!process.env.JWT_SECRET;
    
    return NextResponse.json({
      status: 'ok',
      database: {
        connected: true,
        timestamp: dbResult.rows[0].now,
        usersTable,
        userCount
      },
      environment: {
        hasDbUrl,
        hasJwtSecret,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message,
      database: {
        connected: false
      },
      environment: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
} 