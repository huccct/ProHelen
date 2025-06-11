import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        examples: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 },
      )
    }

    // Increment usage count
    await prisma.template.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    })

    return NextResponse.json(template)
  }
  catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()

    const template = await prisma.template.update({
      where: { id },
      data: body,
      include: {
        examples: true,
      },
    })

    return NextResponse.json(template)
  }
  catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await prisma.template.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  }
  catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 },
    )
  }
}
