import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      select: {
        title: true,
        description: true,
        category: true,
        isPublic: true,
        isPremium: true,
        rating: true,
        ratingCount: true,
        usageCount: true,
        createdAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const csvHeader = 'Title,Description,Category,Status,Type,Rating,Reviews,Usage Count,Created At,Author\\n'
    const csvRows = templates.map((template) => {
      return [
        template.title,
        template.description || '',
        template.category || '',
        template.isPublic ? 'Public' : 'Private',
        template.isPremium ? 'Premium' : 'Basic',
        template.rating?.toString() || '0',
        template.ratingCount.toString(),
        template.usageCount.toString(),
        new Date(template.createdAt).toISOString(),
        template.creator?.name || template.creator?.email || 'System',
      ]
        .map(field => `"${field.replace(/"/g, '""')}"`)
        .join(',')
    }).join('\\n')

    const csv = csvHeader + csvRows

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=templates.csv',
      },
    })
  }
  catch (error) {
    console.error('Error exporting templates:', error)
    return NextResponse.json(
      { error: 'Failed to export templates' },
      { status: 500 },
    )
  }
}
