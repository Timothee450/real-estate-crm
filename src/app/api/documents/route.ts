import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(documents)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const document = await prisma.document.create({
      data: {
        title: json.title,
        client: json.client,
        property: json.property,
        type: json.type,
        status: json.status || 'PENDING',
        size: json.size,
        url: json.url,
        date: new Date(),
        user: {
          connect: {
            id: json.userId // In a real app, this would come from the session
          }
        }
      }
    })
    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
} 