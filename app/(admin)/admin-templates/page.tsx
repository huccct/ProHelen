import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { columns } from './columns'

async function getTemplates() {
  return await prisma.template.findMany({
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          reviews: true,
          favorites: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">模板管理</h1>
        <div className="flex gap-4">
          <Button variant="outline">导出数据</Button>
          <Button>创建模板</Button>
        </div>
      </div>

      <DataTable columns={columns} data={templates} />
    </div>
  )
}
