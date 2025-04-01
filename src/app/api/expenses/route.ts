import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const expense = await prisma.expense.create({
      data: {
        title: json.title,
        amount: parseFloat(json.amount),
        category: json.category,
        property: json.property,
        date: new Date(json.date),
        status: json.status || 'PENDING',
        receipt: json.receipt,
        userId: json.userId // In a real app, this would come from the session
      }
    })
    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
} 