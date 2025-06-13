import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET /api/instructions/[id] - Get single instruction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Temporarily disable auth for testing
    const user = await prisma.user.findFirst()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const instruction = await prisma.instruction.findFirst({
      where: {
        id: params.id,
        userId: user.id,
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
  { params }: { params: { id: string } },
) {
  try {
    const { title, description, content, tags, flowData, category, isFavorite } = await request.json()

    // Temporarily disable auth for testing
    const user = await prisma.user.findFirst()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const instruction = await prisma.instruction.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!instruction) {
      return NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
    }

    const updatedInstruction = await prisma.instruction.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } },
) {
  try {
    // Temporarily disable auth for testing
    const user = await prisma.user.findFirst()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const instruction = await prisma.instruction.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!instruction) {
      return NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
    }

    await prisma.instruction.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Instruction deleted successfully' })
  }
  catch (error) {
    console.error('Error deleting instruction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
