import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        date: 'asc'
      }
    })
    return NextResponse.json(appointments)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const appointment = await prisma.appointment.create({
      data: {
        title: json.title,
        client: json.client,
        date: new Date(json.date),
        time: json.time,
        location: json.location,
        type: json.type,
        userId: json.userId // In a real app, this would come from the session
      }
    })
    return NextResponse.json(appointment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
} 