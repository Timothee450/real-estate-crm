import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log(`Login attempt for email: ${email}`);

    // Find user by email
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    console.log(`Query result rows: ${result.rows.length}`);
    
    const user = result.rows[0];
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log(`User found: ${user.id}, Comparing passwords`);
    
    // Check password
    const passwordMatches = await bcrypt.compare(password, user.password);
    
    console.log(`Password match result: ${passwordMatches}`);
    
    if (!passwordMatches) {
      console.log('Password does not match');
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "7d" }
    );
    
    console.log(`JWT created, setting cookies`);

    // Set cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    console.log(`Login successful for ${email}`);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 