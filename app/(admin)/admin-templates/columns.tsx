'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Star } from 'lucide-react'

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

export const columns: ColumnDef<Template>[] = [
  {
    accessorKey: 'title',
    header: '标题',
  },
  {
    accessorKey: 'category',
    header: '分类',
  },
  {
    accessorKey: 'creator',
    header: '创建者',
    cell: ({ row }) => {
      const creator = row.getValue('creator') as Template['creator']
      return creator?.name || creator?.email || '系统模板'
    },
  },
  {
    accessorKey: 'isPublic',
    header: '状态',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isPublic') ? 'default' : 'secondary'}>
        {row.getValue('isPublic') ? '已发布' : '未发布'}
      </Badge>
    ),
  },
  {
    accessorKey: 'isPremium',
    header: '类型',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isPremium') ? 'default' : 'secondary'}>
        {row.getValue('isPremium') ? '高级版' : '基础版'}
      </Badge>
    ),
  },
  {
    accessorKey: 'rating',
    header: '评分',
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number | null
      return rating
        ? (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              {rating.toFixed(1)}
            </div>
          )
        : (
            '暂无评分'
          )
    },
  },
  {
    accessorKey: '_count.reviews',
    header: '评价数',
  },
  {
    accessorKey: '_count.favorites',
    header: '收藏数',
  },
  {
    accessorKey: 'createdAt',
    header: '创建时间',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
    },
  },
]
