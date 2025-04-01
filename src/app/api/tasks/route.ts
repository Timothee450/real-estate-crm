import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const task = await prisma.task.create({
      data: {
        title: json.title,
        description: json.description,
        dueDate: new Date(json.dueDate),
        priority: json.priority,
        userId: json.userId // In a real app, this would come from the session
      }
    })
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
} 