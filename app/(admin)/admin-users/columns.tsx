'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

export interface User {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'USER'
  createdAt: Date
  _count: {
    instructions: number
    templates: number
  }
}

export function useUserColumns() {
  const { t } = useTranslation()

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: t('admin.users.columns.name'),
      cell: ({ row }) => row.getValue('name') || t('admin.users.noName'),
    },
    {
      accessorKey: 'email',
      header: t('admin.users.columns.email'),
    },
    {
      accessorKey: 'role',
      header: t('admin.users.columns.role'),
      cell: ({ row }) => (
        <Badge variant={row.getValue('role') === 'ADMIN' ? 'default' : 'secondary'}>
          {row.getValue('role') === 'ADMIN' ? t('admin.users.roles.admin') : t('admin.users.roles.user')}
        </Badge>
      ),
    },
    {
      accessorKey: '_count.instructions',
      header: t('admin.users.columns.instructions'),
    },
    {
      accessorKey: '_count.templates',
      header: t('admin.users.columns.templates'),
    },
    {
      accessorKey: 'createdAt',
      header: t('admin.users.columns.createdAt'),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
      },
    },
  ]

  return columns
}
