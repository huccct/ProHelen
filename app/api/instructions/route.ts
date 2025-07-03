import type { NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET /api/instructions - Get user's instructions list
export async function GET(request: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const filter = searchParams.get('filter') // all, favorites, published, drafts
    const sortBy = searchParams.get('sortBy') || 'updated' // updated, created, usage
    const limit = Number.parseInt(searchParams.get('limit') || '20')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    // Build query conditions
    const where: any = {
      userId: session.user.id,
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    // Category filter
    if (category && category !== 'All') {
      where.category = category
    }

    // Status filter
    if (filter === 'favorites') {
      where.isFavorite = true
    }
    else if (filter === 'published') {
      where.isPublished = true
    }
    else if (filter === 'drafts') {
      where.isDraft = true
    }

    // Sorting
    let orderBy: any = {}
    switch (sortBy) {
      case 'created':
        orderBy = { createdAt: 'desc' }
        break
      case 'usage':
        orderBy = { usageCount: 'desc' }
        break
      default:
        orderBy = { updatedAt: 'desc' }
    }

    const [instructions, total] = await Promise.all([
      prisma.instruction.findMany({
        where,
        orderBy,
        include: {
          publishedTemplate: {
            select: {
              id: true,
              title: true,
              isPublic: true,
            },
          },
        },
        take: limit,
        skip: offset,
      }),
      prisma.instruction.count({ where }),
    ])

    return NextResponse.json({
      instructions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  }
  catch (error) {
    console.error('Error fetching instructions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/instructions - Create new instruction
export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, content, tags, flowData, category, isDraft = false, sourceId = null } = await request.json()

    // if not draft, title and content are required
    if (!isDraft && (!title || !content)) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // if draft, check if there is an existing draft
    if (isDraft) {
      const existingDraft = await prisma.instruction.findFirst({
        where: {
          userId: session.user.id,
          isDraft: true,
          sourceId: sourceId || null,
        },
      })

      if (existingDraft) {
        // 更新现有草稿
        const updatedDraft = await prisma.instruction.update({
          where: { id: existingDraft.id },
          data: {
            title,
            description,
            content,
            tags: tags || [],
            flowData,
            category,
            updatedAt: new Date(),
          },
          include: {
            publishedTemplate: true,
          },
        })
        return NextResponse.json({ instruction: updatedDraft }, { status: 200 })
      }
    }

    // create new instruction or draft
    const instruction = await prisma.instruction.create({
      data: {
        title,
        description,
        content,
        tags: tags || [],
        flowData,
        category,
        userId: session.user.id,
        isDraft,
        sourceId,
      },
      include: {
        publishedTemplate: true,
      },
    })

    return NextResponse.json({ instruction }, { status: 201 })
  }
  catch (error) {
    console.error('Error creating instruction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
