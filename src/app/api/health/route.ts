import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuthSystem } from '../auth/utils/auth-verification';

export async function GET() {
  try {
    // Check database connection
    const dbCheck = await db.query('SELECT NOW() as time');
    
    // Verify auth system configuration
    const authSystemCheck = await verifyAuthSystem();
    
    // Get environment info
    const environment = process.env.NODE_ENV || 'development';
    const hasJwtSecret = !!process.env.JWT_SECRET;
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    
    // Return health status
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment,
      database: {
        connected: true,
        time: dbCheck.rows[0]?.time || null
      },
      auth: {
        success: authSystemCheck.success,
        critical: authSystemCheck.critical,
        issues: authSystemCheck.issues.length > 0 ? authSystemCheck.issues : null
      },
      environment_variables: {
        DATABASE_URL: hasDatabaseUrl ? 'configured' : 'missing',
        JWT_SECRET: hasJwtSecret ? 'configured' : 'missing'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      database: {
        connected: false,
      },
      auth: {
        success: false,
        critical: true,
      }
    }, { status: 500 });
  }
} 