'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: '用户名',
    cell: ({ row }) => row.getValue('name') || '未设置',
  },
  {
    accessorKey: 'email',
    header: '邮箱',
  },
  {
    accessorKey: 'role',
    header: '角色',
    cell: ({ row }) => (
      <Badge variant={row.getValue('role') === 'ADMIN' ? 'default' : 'secondary'}>
        {row.getValue('role') === 'ADMIN' ? '管理员' : '用户'}
      </Badge>
    ),
  },
  {
    accessorKey: '_count.instructions',
    header: '指令数',
  },
  {
    accessorKey: '_count.templates',
    header: '模板数',
  },
  {
    accessorKey: 'createdAt',
    header: '注册时间',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
    },
  },
]
