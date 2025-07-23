'use client'

import { CategoryDistribution } from '@/components/admin/category-distribution'
import { UsageChart } from '@/components/admin/usage-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Dashboard {
  totalUsers: number
  activeUsers: number
  totalTemplates: number
  totalInstructions: number
  categoryStats: {
    category: string
    _count: number
  }[]
  recentUsage: {
    blockType: string
    usageCount: number
  }[]
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      const response = await fetch('/api/admin/dashboard/stats')
      const data = await response.json()
      setDashboard(data)
    }
    fetchDashboard()
  }, [])

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('admin.dashboard.title')}</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.totalUsers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {t('admin.dashboard.activeUsers')}
              :
              {dashboard.activeUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.totalTemplates')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalTemplates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.totalInstructions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totalInstructions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.dashboard.activeRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((dashboard.activeUsers / dashboard.totalUsers) * 100).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.dashboard.userActivity')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.usageTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageChart data={dashboard.recentUsage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.categoryDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryDistribution data={dashboard.categoryStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
