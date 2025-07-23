'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface Template {
  id: string
  title: string
  category: string
  isPublic: boolean
  isPremium: boolean
  rating: number | null
  createdAt: Date
  creator: {
    name: string | null
    email: string
  } | null
  _count: {
    reviews: number
    favorites: number
  }
}

export function useTemplateColumns() {
  const { t } = useTranslation()

  const columns: ColumnDef<Template>[] = [
    {
      accessorKey: 'title',
      header: t('admin.templates.columns.title'),
    },
    {
      accessorKey: 'category',
      header: t('admin.templates.columns.category'),
    },
    {
      accessorKey: 'creator',
      header: t('admin.templates.columns.author'),
      cell: ({ row }) => {
        const creator = row.getValue('creator') as Template['creator']
        return creator?.name || creator?.email || t('admin.templates.systemTemplate')
      },
    },
    {
      accessorKey: 'isPublic',
      header: t('admin.templates.columns.status'),
      cell: ({ row }) => (
        <Badge variant={row.getValue('isPublic') ? 'default' : 'secondary'}>
          {row.getValue('isPublic') ? t('admin.templates.status.public') : t('admin.templates.status.private')}
        </Badge>
      ),
    },
    {
      accessorKey: 'isPremium',
      header: t('admin.templates.columns.type'),
      cell: ({ row }) => (
        <Badge variant={row.getValue('isPremium') ? 'default' : 'secondary'}>
          {row.getValue('isPremium') ? t('admin.templates.type.premium') : t('admin.templates.type.basic')}
        </Badge>
      ),
    },
    {
      accessorKey: 'rating',
      header: t('admin.templates.columns.rating'),
      cell: ({ row }) => {
        const rating = row.getValue('rating') as number | null
        return rating
          ? (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {rating.toFixed(1)}
              </div>
            )
          : t('admin.templates.noRating')
      },
    },
    {
      accessorKey: '_count.reviews',
      header: t('admin.templates.columns.reviewCount'),
    },
    {
      accessorKey: '_count.favorites',
      header: t('admin.templates.columns.favoriteCount'),
    },
    {
      accessorKey: 'createdAt',
      header: t('admin.templates.columns.createdAt'),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
      },
    },
  ]

  return columns
}
