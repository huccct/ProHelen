import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET - 获取模板的评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const templateId = params.id

    // 如果指定了userId，返回该用户的评论
    if (userId) {
      const userReview = await prisma.templateReview.findUnique({
        where: {
          templateId_userId: {
            templateId,
            userId,
          },
        },
      })

      return NextResponse.json({ userReview })
    }

    // 否则返回所有评论
    const reviews = await prisma.templateReview.findMany({
      where: { templateId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reviews })
  }
  catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 },
    )
  }
}

// POST - 创建或更新评论
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { rating, comment } = body
    const templateId = params.id

    // 验证评分范围
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      )
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    // 使用事务来创建/更新评论并更新模板平均评分
    const result = await prisma.$transaction(async (tx) => {
      // 创建或更新评论
      const review = await tx.templateReview.upsert({
        where: {
          templateId_userId: {
            templateId,
            userId: user.id,
          },
        },
        update: {
          rating,
          comment: comment || null,
        },
        create: {
          templateId,
          userId: user.id,
          rating,
          comment: comment || null,
        },
      })

      // 重新计算模板的平均评分
      const allReviews = await tx.templateReview.findMany({
        where: { templateId },
        select: { rating: true },
      })

      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      const ratingCount = allReviews.length

      // 更新模板的评分信息
      await tx.template.update({
        where: { id: templateId },
        data: {
          rating: averageRating,
          ratingCount,
        },
      })

      return review
    })

    return NextResponse.json(result, { status: 200 })
  }
  catch (error) {
    console.error('Error creating/updating review:', error)
    return NextResponse.json(
      { error: 'Failed to create/update review' },
      { status: 500 },
    )
  }
}
