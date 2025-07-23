import { CategoryDistribution } from '@/components/admin/category-distribution'
import { UsageChart } from '@/components/admin/usage-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'

async function getAnalytics() {
  const [
    totalUsers,
    activeUsers,
    totalTemplates,
    totalInstructions,
    categoryStats,
    recentUsage,
  ] = await prisma.$transaction([
    prisma.user.count(),

    prisma.user.count({
      where: {
        OR: [
          {
            instructions: {
              some: {
                updatedAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
          {
            templates: {
              some: {
                updatedAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        ],
      },
    }),

    prisma.template.count(),

    prisma.instruction.count(),

    prisma.template.groupBy({
      by: ['category'],
      _count: {
        _all: true,
      },
      orderBy: [
        {
          category: 'desc',
        },
      ],
    }),

    prisma.userBlockUsage.findMany({
      select: {
        blockType: true,
        usageCount: true,
      },
      orderBy: {
        usageCount: 'desc',
      },
      take: 10,
    }),
  ])

  return {
    totalUsers,
    activeUsers,
    totalTemplates,
    totalInstructions,
    categoryStats,
    recentUsage,
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">数据分析</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              活跃用户:
              {' '}
              {analytics.activeUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">模板总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTemplates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">指令总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalInstructions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              近30天活跃用户比例
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>使用趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageChart data={analytics.recentUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分类分布</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryDistribution data={analytics.categoryStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
