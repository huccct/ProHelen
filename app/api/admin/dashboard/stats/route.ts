import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      totalUsers,
      activeUsers,
      totalTemplates,
      totalInstructions,
      rawCategoryStats,
      recentUsage,
    ] = await prisma.$transaction([
      prisma.user.count(),

      prisma.user.count({
        where: {
          OR: [
            {
              instructions: {
                some: {
                  updatedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
            {
              templates: {
                some: {
                  updatedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
          ],
        },
      }),

      prisma.template.count(),

      prisma.instruction.count(),

      prisma.template.groupBy({
        by: ['category'],
        _count: {
          _all: true,
        },
        orderBy: [
          {
            category: 'desc',
          },
        ],
      }),

      prisma.userBlockUsage.findMany({
        select: {
          blockType: true,
          usageCount: true,
        },
        orderBy: {
          usageCount: 'desc',
        },
        take: 10,
      }),
    ])

    const categoryStats = rawCategoryStats.map(stat => ({
      category: stat.category,
      _count: typeof stat._count === 'object' && stat._count?._all ? stat._count._all : 0,
    }))

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalTemplates,
      totalInstructions,
      categoryStats,
      recentUsage,
    })
  }
  catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 },
    )
  }
}
