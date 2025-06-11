import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = Number.parseInt(searchParams.get('limit') || '20')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    const where: any = {
      isPublic: true,
    }

    // Category filter
    if (category && category !== 'All') {
      where.category = category
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ]
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        include: {
          examples: true,
          _count: {
            select: {
              reviews: true,
              favorites: true,
            },
          },
        },
        orderBy: [
          { usageCount: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.template.count({ where }),
    ])

    return NextResponse.json({
      templates,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  }
  catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      content,
      useCases,
      features,
      tags,
      overview,
      examples,
      isPublic = false,
    } = body

    const template = await prisma.template.create({
      data: {
        title,
        description,
        category,
        content,
        useCases,
        features,
        tags,
        overview,
        isPublic,
        examples: examples
          ? {
              create: examples,
            }
          : undefined,
      },
      include: {
        examples: true,
      },
    })

    return NextResponse.json(template, { status: 201 })
  }
  catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 },
    )
  }
}
