'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

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

export function useInstructionColumns() {
  const { t } = useTranslation()

  const columns: ColumnDef<Instruction>[] = [
    {
      accessorKey: 'title',
      header: t('admin.instructions.columns.title'),
      cell: ({ row }) => (
        <div className="max-w-sm md:max-w-md whitespace-normal break-words">
          {row.getValue('title') as string}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: t('admin.instructions.columns.category'),
      cell: ({ row }) => row.getValue('category') || t('admin.instructions.noCategory'),
    },
    {
      accessorKey: 'user',
      header: t('admin.instructions.columns.author'),
      cell: ({ row }) => {
        const user = row.getValue('user') as Instruction['user']
        return user.name || user.email
      },
    },
    {
      accessorKey: 'isPublished',
      header: t('admin.instructions.columns.status'),
      cell: ({ row }) => (
        <Badge variant={row.getValue('isPublished') ? 'default' : 'secondary'}>
          {row.getValue('isPublished') ? t('admin.instructions.status.published') : t('admin.instructions.status.draft')}
        </Badge>
      ),
    },
    {
      accessorKey: 'isDraft',
      header: t('admin.instructions.columns.draftStatus'),
      cell: ({ row }) => (
        <Badge variant={row.getValue('isDraft') ? 'default' : 'secondary'}>
          {row.getValue('isDraft') ? t('admin.instructions.draftStatus.draft') : t('admin.instructions.draftStatus.completed')}
        </Badge>
      ),
    },
    {
      accessorKey: 'usageCount',
      header: t('admin.instructions.columns.usageCount'),
    },
    {
      accessorKey: 'publishedTemplate',
      header: t('admin.instructions.columns.relatedTemplate'),
      cell: ({ row }) => {
        const template = row.getValue('publishedTemplate') as Instruction['publishedTemplate']
        return template ? template.title : t('admin.instructions.noTemplate')
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('admin.instructions.columns.createdAt'),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
      },
    },
  ]

  return columns
}
