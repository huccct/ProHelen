'use client'

import type { Template } from './columns'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useTemplateColumns } from './columns'

export default function TemplatesPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const columns = useTemplateColumns()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    async function fetchTemplates() {
      const response = await fetch('/api/admin/templates')
      const data = await response.json()
      setTemplates(data)
    }
    fetchTemplates()
  }, [])

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await fetch('/api/admin/templates/export')
      if (!response.ok)
        throw new Error('Export failed')

      const contentDisposition = response.headers.get('content-disposition')
      const filename = contentDisposition?.split('filename=')[1] || 'templates.csv'

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(t('admin.templates.exportSuccess'))
    }
    catch (error) {
      console.error('Export error:', error)
      toast.error(t('admin.templates.exportError'))
    }
    finally {
      setIsExporting(false)
    }
  }

  const handleCreate = () => {
    router.push('/builder?type=template')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.templates.title')}</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? t('common.loading') : t('admin.templates.actions.export')}
          </Button>
          <Button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer"
            onClick={handleCreate}
          >
            {t('admin.templates.actions.create')}
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={templates} />
    </div>
  )
}
