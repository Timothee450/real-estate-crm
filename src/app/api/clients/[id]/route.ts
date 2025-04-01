import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// GET handler
export function GET(
  request: Request | NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(async () => {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await db.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [params.id, session.user.id]
    );

    if (client.rows.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client.rows[0]);
  });
}

// PUT handler
export function PUT(
  request: Request | NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(async () => {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, notes } = body;

    const client = await db.query(
      `UPDATE clients 
       SET name = $1, email = $2, phone = $3, notes = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [name, email, phone, notes, params.id, session.user.id]
    );

    if (client.rows.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client.rows[0]);
  });
}

// DELETE handler
export function DELETE(
  request: Request | NextRequest,
  { params }: { params: { id: string } }
) {
  return handleRequest(async () => {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await db.query(
      'DELETE FROM clients WHERE id = $1 AND user_id = $2 RETURNING *',
      [params.id, session.user.id]
    );

    if (client.rows.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Client deleted successfully' });
  });
}

// Helper function to handle requests and catch errors
async function handleRequest(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 