import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if users table exists
    const usersTableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    
    const usersTableExists = usersTableCheck.rows[0].exists;
    
    if (!usersTableExists) {
      return NextResponse.json({
        error: 'Users table does not exist',
        tableExists: false
      }, { status: 404 });
    }
    
    // Get table structure
    const tableStructure = await db.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
    );
    
    // Get list of users (excluding passwords)
    const users = await db.query(
      "SELECT id, email, name, created_at FROM users"
    );
    
    return NextResponse.json({
      tableExists: true,
      tableStructure: tableStructure.rows,
      userCount: users.rows.length,
      users: users.rows.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }))
    });
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json(
      { error: 'Error fetching users', message: error.message },
      { status: 500 }
    );
  }
} 