'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export interface Instruction {
  id: string
  title: string
  category: string | null
  isPublished: boolean
  isDraft: boolean
  usageCount: number
  createdAt: Date
  user: {
    name: string | null
    email: string
  }
  publishedTemplate: {
    id: string
    title: string
  } | null
}

export const columns: ColumnDef<Instruction>[] = [
  {
    accessorKey: 'title',
    header: '标题',
  },
  {
    accessorKey: 'category',
    header: '分类',
    cell: ({ row }) => row.getValue('category') || '未分类',
  },
  {
    accessorKey: 'user',
    header: '创建者',
    cell: ({ row }) => {
      const user = row.getValue('user') as Instruction['user']
      return user.name || user.email
    },
  },
  {
    accessorKey: 'isPublished',
    header: '发布状态',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isPublished') ? 'default' : 'secondary'}>
        {row.getValue('isPublished') ? '已发布' : '未发布'}
      </Badge>
    ),
  },
  {
    accessorKey: 'isDraft',
    header: '草稿状态',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isDraft') ? 'default' : 'secondary'}>
        {row.getValue('isDraft') ? '草稿' : '完成'}
      </Badge>
    ),
  },
  {
    accessorKey: 'usageCount',
    header: '使用次数',
  },
  {
    accessorKey: 'publishedTemplate',
    header: '关联模板',
    cell: ({ row }) => {
      const template = row.getValue('publishedTemplate') as Instruction['publishedTemplate']
      return template ? template.title : '无'
    },
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
