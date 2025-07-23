import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const instructions = await prisma.instruction.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        publishedTemplate: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(instructions)
  }
  catch (error) {
    console.error('Error fetching instructions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructions' },
      { status: 500 },
    )
  }
}
