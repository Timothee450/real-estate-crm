import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const results = {
    status: 'checking',
    database: null,
    users_table: null,
    test_user: null,
    jwt_secret: null,
    fixes: []
  };
  
  try {
    // 1. Check database connection
    try {
      const dbResult = await db.query('SELECT NOW() as time');
      results.database = {
        connected: true,
        time: dbResult.rows[0]?.time
      };
    } catch (error) {
      results.database = {
        connected: false,
        error: error.message
      };
      return NextResponse.json(results);
    }
    
    // 2. Check users table
    try {
      const tableCheck = await db.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
      );
      
      const tableExists = tableCheck.rows[0].exists;
      results.users_table = { exists: tableExists };
      
      if (!tableExists) {
        // Create users table
        await db.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        results.fixes.push('Created users table');
        results.users_table.exists = true;
      }
    } catch (error) {
      results.users_table = {
        error: error.message
      };
    }
    
    // 3. Check if test user exists
    try {
      const userCheck = await db.query(
        "SELECT * FROM users WHERE email = 'test@example.com'"
      );
      
      const hasUser = userCheck.rows.length > 0;
      results.test_user = { exists: hasUser };
      
      if (!hasUser) {
        // We can't create a user here without bcrypt, but we can report status
        results.test_user.message = 'Test user does not exist. Visit /api/auth/addtestuser to create one.';
      }
    } catch (error) {
      results.test_user = {
        error: error.message
      };
    }
    
    // 4. Check JWT secret
    const hasJwtSecret = !!process.env.JWT_SECRET;
    results.jwt_secret = { configured: hasJwtSecret };
    
    results.status = 'complete';
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
} 