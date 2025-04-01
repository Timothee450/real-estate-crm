import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: context.params.id }
    })
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const body = await request.json()
    const client = await prisma.client.update({
      where: { id: context.params.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        type: body.type,
        status: body.status,
        properties: body.properties,
        lastContact: new Date(body.lastContactDate),
      }
    })
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await prisma.client.delete({
      where: { id: context.params.id }
    })
    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
} 