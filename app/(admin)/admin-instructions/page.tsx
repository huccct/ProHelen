import { DataTable } from '@/components/admin/data-table'
import { prisma } from '@/lib/db'
import { columns } from './columns'

async function getInstructions() {
  return await prisma.instruction.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      publishedTemplate: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function InstructionsPage() {
  const instructions = await getInstructions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">指令管理</h1>
      </div>

      <DataTable columns={columns} data={instructions} />
    </div>
  )
}
