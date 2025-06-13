import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// POST /api/instructions/[id]/publish - Publish instruction to template library
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { templateTitle, templateDescription, templateCategory, isPublic } = await request.json()

    // Temporarily disable auth for testing
    const user = await prisma.user.findFirst()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if instruction exists and belongs to current user
    const instruction = await prisma.instruction.findFirst({
      where: {
        id,
        userId: user.id,
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
        category: templateCategory,
        content: instruction.content,
        tags: instruction.tags,
        flowData: instruction.flowData as any,
        isPublic,
        createdBy: user.id,
        sourceInstructionId: instruction.id,
        useCases: [],
        features: [],
      },
    })

    // 更新指令状态
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
    // Temporarily disable auth for testing
    const user = await prisma.user.findFirst()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const instruction = await prisma.instruction.findFirst({
      where: {
        id,
        userId: user.id,
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

    // 删除模板
    await prisma.template.delete({
      where: { id: instruction.publishedTemplate.id },
    })

    // 更新指令状态
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
