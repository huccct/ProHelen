import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { Command, FileText, Star, Users } from 'lucide-react'

async function getStats() {
  const [
    userCount,
    templateCount,
    instructionCount,
    publishedTemplateCount,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.template.count(),
    prisma.instruction.count(),
    prisma.template.count({
      where: { isPublic: true },
    }),
  ])

  return {
    userCount,
    templateCount,
    instructionCount,
    publishedTemplateCount,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">仪表盘</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">模板总数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.templateCount}</div>
            <p className="text-xs text-muted-foreground">
              已发布:
              {' '}
              {stats.publishedTemplateCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">指令总数</CardTitle>
            <Command className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.instructionCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均评分</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground">
              基于所有模板评分
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
