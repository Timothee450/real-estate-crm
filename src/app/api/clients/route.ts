import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const client = await prisma.client.create({
      data: {
        name: json.name,
        email: json.email,
        phone: json.phone,
        type: json.type,
        status: json.status || 'ACTIVE',
        properties: json.properties,
        lastContact: new Date(json.lastContact),
        userId: json.userId // In a real app, this would come from the session
      }
    })
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
} 