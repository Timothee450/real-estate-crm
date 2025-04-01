import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ message: 'GET route working' });
}

export function PUT() {
  return NextResponse.json({ message: 'PUT route working' });
}

export function DELETE() {
  return NextResponse.json({ message: 'DELETE route working' });
} 