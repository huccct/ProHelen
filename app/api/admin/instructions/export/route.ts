import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const instructions = await prisma.instruction.findMany({
      select: {
        title: true,
        description: true,
        category: true,
        isPublished: true,
        isDraft: true,
        usageCount: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        publishedTemplate: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const csvHeader = 'Title,Description,Category,Status,Draft Status,Usage Count,Related Template,Created At,Author\\n'
    const csvRows = instructions.map((instruction) => {
      return [
        instruction.title,
        instruction.description || '',
        instruction.category || '',
        instruction.isPublished ? 'Published' : 'Draft',
        instruction.isDraft ? 'Draft' : 'Completed',
        instruction.usageCount.toString(),
        instruction.publishedTemplate?.title || '',
        new Date(instruction.createdAt).toISOString(),
        instruction.user?.name || instruction.user?.email || '',
      ]
        .map(field => `"${field.replace(/"/g, '""')}"`)
        .join(',')
    }).join('\\n')

    const csv = csvHeader + csvRows

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=instructions.csv',
      },
    })
  }
  catch (error) {
    console.error('Error exporting instructions:', error)
    return NextResponse.json(
      { error: 'Failed to export instructions' },
      { status: 500 },
    )
  }
}
