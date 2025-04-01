import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// This is a maintenance endpoint to fix authentication issues
export async function GET() {
  try {
    const results = {
      steps: [],
      issues: [],
      fixes: []
    };

    // STEP 1: Check database connection
    try {
      const dbCheck = await db.query('SELECT NOW() as time');
      results.steps.push({
        name: 'Database connection',
        status: 'success',
        details: `Connected at ${dbCheck.rows[0]?.time}`
      });
    } catch (error) {
      results.steps.push({
        name: 'Database connection',
        status: 'failed',
        details: error.message
      });
      results.issues.push({
        component: 'database',
        error: 'Database connection failed',
        details: error.message
      });
      return NextResponse.json(results, { status: 500 });
    }

    // STEP 2: Check JWT secret
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      results.steps.push({
        name: 'JWT Secret check',
        status: 'failed',
        details: 'JWT_SECRET environment variable is not set'
      });
      results.issues.push({
        component: 'jwt',
        error: 'JWT_SECRET environment variable is not set'
      });
    } else {
      results.steps.push({
        name: 'JWT Secret check',
        status: 'success',
        details: 'JWT_SECRET is configured'
      });
    }

    // STEP 3: Check users table
    let usersTableExists = false;
    try {
      const tableCheck = await db.query(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
      );
      usersTableExists = tableCheck.rows[0].exists;
      
      if (!usersTableExists) {
        results.steps.push({
          name: 'Users table check',
          status: 'failed',
          details: 'Users table does not exist'
        });
        results.issues.push({
          component: 'database',
          error: 'Users table does not exist'
        });
        
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
        
        results.fixes.push({
          component: 'database',
          action: 'Created users table',
          details: 'Users table was created with required columns'
        });
        usersTableExists = true;
      } else {
        results.steps.push({
          name: 'Users table check',
          status: 'success',
          details: 'Users table exists'
        });
      }
    } catch (error) {
      results.steps.push({
        name: 'Users table check',
        status: 'failed',
        details: error.message
      });
      results.issues.push({
        component: 'database',
        error: 'Error checking users table',
        details: error.message
      });
    }
    
    // STEP 4: Check if test user exists and fix if needed
    if (usersTableExists) {
      try {
        const testUser = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        };
        
        // Check if test user exists
        const userCheck = await db.query(
          'SELECT * FROM users WHERE email = $1',
          [testUser.email]
        );
        
        if (userCheck.rows.length > 0) {
          results.steps.push({
            name: 'Test user check',
            status: 'success',
            details: 'Test user exists'
          });
          
          // Force update the password to ensure it's correct
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(testUser.password, salt);
          
          await db.query(
            'UPDATE users SET password = $1 WHERE email = $2',
            [hashedPassword, testUser.email]
          );
          
          results.fixes.push({
            component: 'users',
            action: 'Updated test user password',
            details: `Password for ${testUser.email} has been reset to '${testUser.password}'`
          });
        } else {
          results.steps.push({
            name: 'Test user check',
            status: 'failed',
            details: 'Test user does not exist'
          });
          
          // Create test user
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(testUser.password, salt);
          
          await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [testUser.name, testUser.email, hashedPassword]
          );
          
          results.fixes.push({
            component: 'users',
            action: 'Created test user',
            details: `Test user created with email: ${testUser.email} and password: ${testUser.password}`
          });
        }
      } catch (error) {
        results.steps.push({
          name: 'Test user check',
          status: 'failed',
          details: error.message
        });
        results.issues.push({
          component: 'users',
          error: 'Error checking/creating test user',
          details: error.message
        });
      }
    }
    
    // STEP 5: Create a working login token for test user
    if (jwtSecret && usersTableExists) {
      try {
        // Get the test user
        const userResult = await db.query(
          'SELECT * FROM users WHERE email = $1',
          ['test@example.com']
        );
        
        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          
          // Create token
          const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            jwtSecret,
            { expiresIn: '7d' }
          );
          
          results.steps.push({
            name: 'Token creation',
            status: 'success',
            details: 'Test token created successfully'
          });
          
          results.fixes.push({
            component: 'auth',
            action: 'Created test token',
            details: 'A working JWT token has been created for the test user'
          });
          
          // Include token in response for manual testing
          results.token = token;
          results.testUser = {
            email: 'test@example.com',
            password: 'password123'
          };
        }
      } catch (error) {
        results.steps.push({
          name: 'Token creation',
          status: 'failed',
          details: error.message
        });
        results.issues.push({
          component: 'auth',
          error: 'Error creating test token',
          details: error.message
        });
      }
    }
    
    // Return comprehensive results
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: results.issues.length === 0 ? 'success' : 'issues_found',
      message: results.issues.length === 0 
        ? 'Authentication system is now fixed and ready to use' 
        : `Found ${results.issues.length} issues, fixed ${results.fixes.length}`,
      ...results
    });
  } catch (error) {
    console.error('Fix auth error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'An unexpected error occurred while fixing authentication',
      error: error.message
    }, { status: 500 });
  }
} 