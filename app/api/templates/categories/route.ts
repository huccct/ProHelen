import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 获取所有公开模板的不同分类
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

    // 提取分类名称并添加 "All" 选项
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
