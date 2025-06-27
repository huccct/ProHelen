import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.template.findMany({
      where: {
        isPublic: true,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    })

    const categoryNames = ['All', ...categories.map(c => c.category).filter(Boolean)]

    return NextResponse.json({
      categories: categoryNames,
    })
  }
  catch (error) {
    console.error('Error fetching template categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    )
  }
}
