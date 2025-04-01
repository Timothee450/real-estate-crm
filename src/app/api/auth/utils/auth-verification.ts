import { db } from '@/lib/db';

/**
 * Utility to verify the authentication system is properly configured
 */
export async function verifyAuthSystem() {
  const issues = [];
  
  // Check database connection
  try {
    await db.query('SELECT NOW()');
  } catch (error) {
    issues.push({
      component: 'database',
      error: 'Database connection failed',
      details: error.message
    });
    return { 
      success: false, 
      issues,
      critical: true
    };
  }
  
  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    issues.push({
      component: 'jwt',
      error: 'JWT_SECRET environment variable is not set',
      fix: 'Add JWT_SECRET to environment variables'
    });
  }
  
  // Check if users table exists
  try {
    const tableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    
    if (!tableCheck.rows[0].exists) {
      issues.push({
        component: 'database',
        error: 'Users table does not exist',
        fix: 'Visit /api/auth/addtestuser to create the table'
      });
    } else {
      // Check table structure
      const tableStructure = await db.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
      );
      
      const requiredColumns = ['id', 'email', 'password', 'name'];
      const missingColumns = requiredColumns.filter(
        col => !tableStructure.rows.some(row => row.column_name === col)
      );
      
      if (missingColumns.length > 0) {
        issues.push({
          component: 'database',
          error: `Users table is missing columns: ${missingColumns.join(', ')}`,
          fix: 'Check database migration or recreate the users table'
        });
      }
      
      // Check if any users exist
      const userCount = await db.query('SELECT COUNT(*) FROM users');
      if (parseInt(userCount.rows[0].count) === 0) {
        issues.push({
          component: 'users',
          error: 'No users exist in the database',
          fix: 'Visit /api/auth/addtestuser to create a test user'
        });
      }
    }
  } catch (error) {
    issues.push({
      component: 'database',
      error: 'Error checking users table',
      details: error.message
    });
  }
  
  return {
    success: issues.length === 0,
    issues,
    critical: issues.some(i => i.component === 'database' || i.component === 'jwt')
  };
} 