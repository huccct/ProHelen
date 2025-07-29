import type { NextRequest } from 'next/server'
import { authOptions } from '@/lib/auth-config'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const { id: templateId } = await params

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { rating, comment } = body
    const { id: templateId } = await params

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }
    const sanitizedComment = comment
      ? comment.replace(/[<>]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      : null
    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.templateReview.upsert({
        where: {
          templateId_userId: {
            templateId,
            userId: user.id,
          },
        },
        update: {
          rating,
          comment: sanitizedComment || null,
        },
        create: {
          templateId,
          userId: user.id,
          rating,
          comment: sanitizedComment || null,
        },
      })

      const allReviews = await tx.templateReview.findMany({
        where: { templateId },
        select: { rating: true },
      })

      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      const ratingCount = allReviews.length

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const { id: templateId } = await params

    const userReview = await prisma.templateReview.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: session.user.id,
        },
      },
    })

    if (!userReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 },
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.templateReview.delete({
        where: {
          templateId_userId: {
            templateId,
            userId: session.user.id,
          },
        },
      })

      const remainingReviews = await tx.templateReview.findMany({
        where: { templateId },
        select: { rating: true },
      })

      const averageRating = remainingReviews.length > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
        : 0
      const ratingCount = remainingReviews.length

      // 更新模板评分
      await tx.template.update({
        where: { id: templateId },
        data: {
          rating: averageRating,
          ratingCount,
        },
      })

      return { success: true }
    })

    return NextResponse.json(result, { status: 200 })
  }
  catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 },
    )
  }
}
