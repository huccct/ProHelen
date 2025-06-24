import type { NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET /api/instructions/[id] - Get single instruction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // Get current user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const instruction = await prisma.instruction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        publishedTemplate: true,
      },
    })

    if (!instruction) {
      return NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
    }

    return NextResponse.json({ instruction })
  }
  catch (error) {
    console.error('Error fetching instruction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/instructions/[id] - Update instruction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { title, description, content, tags, flowData, category, isFavorite } = await request.json()

    // Get current user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const instruction = await prisma.instruction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!instruction) {
      return NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
    }

    const updatedInstruction = await prisma.instruction.update({
      where: { id },
      data: {
        title,
        description,
        content,
        tags,
        flowData,
        category,
        isFavorite,
        updatedAt: new Date(),
      },
      include: {
        publishedTemplate: true,
      },
    })

    return NextResponse.json({ instruction: updatedInstruction })
  }
  catch (error) {
    console.error('Error updating instruction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/instructions/[id] - Delete instruction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    // Get current user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const instruction = await prisma.instruction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!instruction) {
      return NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
    }

    await prisma.instruction.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Instruction deleted successfully' })
  }
  catch (error) {
    console.error('Error deleting instruction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
