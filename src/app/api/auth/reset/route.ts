import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;
    
    console.log(`Password reset attempt for email: ${email}`);
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    const result = await db.query(
      `UPDATE users SET password = $1, updated_at = NOW() 
       WHERE email = $2 RETURNING id, email`,
      [hashedPassword, email]
    );
    
    if (result.rows.length === 0) {
      console.log(`User with email ${email} not found for password reset`);
      // Don't reveal if the user exists or not for security
      return NextResponse.json({ 
        message: 'If the account exists, the password has been reset' 
      });
    }
    
    console.log(`Password reset successful for user ID: ${result.rows[0].id}`);
    
    return NextResponse.json({ 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Error resetting password' },
      { status: 500 }
    );
  }
} 