import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: 'unknown',
      connection: null,
      usersTable: null,
      testUser: null,
      rawQueryResult: null
    },
    auth: {
      status: 'unknown',
      jwtSecret: null,
      tokenTest: null
    },
    bcrypt: {
      status: 'unknown',
      version: null,
      hashTest: null,
      verifyTest: null
    },
    fixes: [],
    recommendations: []
  };

  // 1. Check database connection
  try {
    const dbResponse = await db.query('SELECT NOW() as time');
    diagnostics.database.status = 'connected';
    diagnostics.database.connection = {
      success: true,
      time: dbResponse.rows[0]?.time
    };
  } catch (error) {
    diagnostics.database.status = 'error';
    diagnostics.database.connection = {
      success: false,
      error: error.message
    };
    diagnostics.recommendations.push({
      component: 'database',
      message: 'Database connection failed. Check your DATABASE_URL environment variable.'
    });
    return NextResponse.json(diagnostics);
  }

  // 2. Check users table
  try {
    // Check table existence
    const tableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    const tableExists = tableCheck.rows[0].exists;
    
    // Get table structure
    let tableStructure = null;
    if (tableExists) {
      const columnsQuery = await db.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
      );
      tableStructure = columnsQuery.rows;
    }

    diagnostics.database.usersTable = {
      exists: tableExists,
      structure: tableStructure
    };

    // Create table if it doesn't exist
    if (!tableExists) {
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
      diagnostics.fixes.push({
        component: 'database',
        action: 'Created users table',
        details: 'Users table was created with required columns'
      });
    }
  } catch (error) {
    diagnostics.database.usersTable = {
      exists: false,
      error: error.message
    };
    diagnostics.recommendations.push({
      component: 'database',
      message: 'Error checking users table. Ensure your database user has sufficient privileges.'
    });
  }

  // 3. Check/create test user
  try {
    // Check if test user exists
    let userQuery = await db.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@example.com']
    );
    
    let testUser = userQuery.rows[0];
    let passwordNeedsReset = false;
    
    // Store full raw query result for debugging
    diagnostics.database.rawQueryResult = {
      rows: userQuery.rows.length,
      fields: userQuery.fields ? userQuery.fields.map(f => f.name) : null,
      rowsData: userQuery.rows.map(row => ({
        id: row.id,
        email: row.email,
        name: row.name,
        passwordLength: row.password ? row.password.length : 0,
        passwordPrefix: row.password ? row.password.substring(0, 10) + '...' : null
      }))
    };
    
    // If user exists, check password
    if (testUser) {
      // Test if the stored password hash is valid and can be compared
      try {
        const passwordTest = await bcrypt.compare('password123', testUser.password);
        if (!passwordTest) {
          passwordNeedsReset = true;
        }
      } catch (error) {
        passwordNeedsReset = true;
      }
    }
    
    // Create or update test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    if (!testUser) {
      // Create test user
      await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        ['Test User', 'test@example.com', hashedPassword]
      );
      diagnostics.fixes.push({
        component: 'users',
        action: 'Created test user',
        details: 'Test user created with email: test@example.com and password: password123'
      });
    } else if (passwordNeedsReset) {
      // Update password
      await db.query(
        'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
        [hashedPassword, 'test@example.com']
      );
      diagnostics.fixes.push({
        component: 'users',
        action: 'Reset test user password',
        details: 'Test user password has been reset to: password123'
      });
    }
    
    // Get the latest user data
    userQuery = await db.query(
      'SELECT * FROM users WHERE email = $1',
      ['test@example.com']
    );
    testUser = userQuery.rows[0];
    
    diagnostics.database.testUser = {
      exists: !!testUser,
      id: testUser?.id,
      email: testUser?.email,
      name: testUser?.name,
      passwordHash: testUser?.password ? `${testUser.password.substring(0, 10)}...` : null
    };
  } catch (error) {
    diagnostics.database.testUser = {
      exists: false,
      error: error.message
    };
    diagnostics.recommendations.push({
      component: 'users',
      message: 'Error managing test user. Check database permissions and structure.'
    });
  }

  // 4. Check JWT configuration
  try {
    const jwtSecret = process.env.JWT_SECRET;
    
    diagnostics.auth.jwtSecret = {
      configured: !!jwtSecret,
      length: jwtSecret ? jwtSecret.length : 0
    };
    
    if (!jwtSecret) {
      diagnostics.recommendations.push({
        component: 'auth',
        message: 'JWT_SECRET environment variable is not set. Set it in your Vercel environment variables.'
      });
    } else {
      // Test token creation/verification
      const testPayload = { id: 999, email: 'test@example.com', name: 'Test User' };
      const testToken = jwt.sign(testPayload, jwtSecret, { expiresIn: '1h' });
      const decoded = jwt.verify(testToken, jwtSecret);
      
      diagnostics.auth.tokenTest = {
        created: !!testToken,
        verified: !!decoded,
        payload: testPayload,
        token: `${testToken.substring(0, 20)}...`,
        decoded: decoded
      };
      
      diagnostics.auth.status = 'operational';
    }
  } catch (error) {
    diagnostics.auth.tokenTest = {
      error: error.message
    };
    diagnostics.auth.status = 'error';
    diagnostics.recommendations.push({
      component: 'auth',
      message: 'JWT token creation/verification failed. Check your JWT_SECRET.'
    });
  }

  // 5. Test bcrypt functionality
  try {
    diagnostics.bcrypt.version = bcrypt.version || 'unknown';
    
    // Test hash creation
    const testSalt = await bcrypt.genSalt(10);
    const testHash = await bcrypt.hash('password123', testSalt);
    
    diagnostics.bcrypt.hashTest = {
      success: !!testHash,
      salt: testSalt,
      hash: testHash
    };
    
    // Test verification
    const verifyResult = await bcrypt.compare('password123', testHash);
    
    diagnostics.bcrypt.verifyTest = {
      success: verifyResult,
      result: verifyResult
    };
    
    diagnostics.bcrypt.status = 'operational';
  } catch (error) {
    diagnostics.bcrypt.status = 'error';
    diagnostics.bcrypt.error = error.message;
    diagnostics.recommendations.push({
      component: 'bcrypt',
      message: 'bcrypt password hashing failed. Check your bcryptjs package installation.'
    });
  }

  // 6. Create a valid token for the test user
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const testUser = diagnostics.database.testUser;
    
    if (jwtSecret && testUser.exists) {
      const token = jwt.sign(
        { id: testUser.id, email: testUser.email, name: testUser.name },
        jwtSecret,
        { expiresIn: '7d' }
      );
      
      diagnostics.validTestToken = token;
      diagnostics.testCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };
    }
  } catch (error) {
    // Ignore token creation errors
  }

  return NextResponse.json(diagnostics);
} 