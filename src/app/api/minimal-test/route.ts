import { NextResponse } from 'next/server';
import { db } from '@/lib/db-minimal';

export async function GET() {
  try {
    // Just test database connection
    const result = await db.query('SELECT NOW() as time');
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      time: result.rows[0]?.time,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
} 