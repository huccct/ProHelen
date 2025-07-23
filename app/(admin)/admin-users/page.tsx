'use client'

import type { User } from './columns'
import { DataTable } from '@/components/admin/data-table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserColumns } from './columns'

export default function UsersPage() {
  const { t } = useTranslation()
  const columns = useUserColumns()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  )
}
