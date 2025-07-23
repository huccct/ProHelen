import { DataTable } from '@/components/admin/data-table'
import { prisma } from '@/lib/db'
import { columns } from './columns'

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          instructions: true,
          templates: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">用户管理</h1>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  )
}
