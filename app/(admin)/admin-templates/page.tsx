'use client'

import type { Template } from './columns'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTemplateColumns } from './columns'

export default function TemplatesPage() {
  const { t } = useTranslation()
  const columns = useTemplateColumns()
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    async function fetchTemplates() {
      const response = await fetch('/api/admin/templates')
      const data = await response.json()
      setTemplates(data)
    }
    fetchTemplates()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.templates.title')}</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="cursor-pointer">{t('admin.templates.actions.export')}</Button>
          <Button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer"
          >
            {t('admin.templates.actions.create')}
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={templates} />
    </div>
  )
}
