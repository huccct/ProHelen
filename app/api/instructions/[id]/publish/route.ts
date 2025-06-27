import type { NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// POST /api/instructions/[id]/publish - Publish instruction to template library
export async function POST(
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

    // Parse request body with error handling
    let requestData
    try {
      const text = await request.text()
      if (!text.trim()) {
        // If no body provided, use defaults
        requestData = {}
      }
      else {
        requestData = JSON.parse(text)
      }
    }
    catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { templateTitle, templateDescription, templateCategory, isPublic } = requestData

    // Check if instruction exists and belongs to current user
    const instruction = await prisma.instruction.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!instruction) {
      return NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
    }

    // Check if already published
    if (instruction.isPublished) {
      return NextResponse.json({ error: 'Instruction already published' }, { status: 400 })
    }

    // Create template
    const template = await prisma.template.create({
      data: {
        title: templateTitle || instruction.title,
        description: templateDescription || instruction.description || '',
        category: templateCategory || 'Other',
        content: instruction.content,
        tags: instruction.tags,
        flowData: instruction.flowData as any,
        isPublic: isPublic ?? true,
        createdBy: session.user.id,
        sourceInstructionId: instruction.id,
        useCases: [],
        features: [],
      },
    })

    const updatedInstruction = await prisma.instruction.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
      include: {
        publishedTemplate: true,
      },
    })

    return NextResponse.json({
      instruction: updatedInstruction,
      template,
    }, { status: 201 })
  }
  catch (error) {
    console.error('Error publishing instruction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/instructions/[id]/publish - Unpublish (delete associated template)
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
      include: {
        publishedTemplate: true,
      },
    })

    if (!instruction) {
      return NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
    }

    if (!instruction.isPublished || !instruction.publishedTemplate) {
      return NextResponse.json({ error: 'Instruction is not published' }, { status: 400 })
    }

    await prisma.template.delete({
      where: { id: instruction.publishedTemplate.id },
    })

    const updatedInstruction = await prisma.instruction.update({
      where: { id },
      data: {
        isPublished: false,
        publishedAt: null,
      },
    })

    return NextResponse.json({ instruction: updatedInstruction })
  }
  catch (error) {
    console.error('Error unpublishing instruction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
