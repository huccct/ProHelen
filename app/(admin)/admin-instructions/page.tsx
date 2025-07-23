'use client'

import type { Instruction } from './columns'
import { DataTable } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInstructionColumns } from './columns'

export default function InstructionsPage() {
  const { t } = useTranslation()
  const columns = useInstructionColumns()
  const [instructions, setInstructions] = useState<Instruction[]>([])

  useEffect(() => {
    async function fetchInstructions() {
      const response = await fetch('/api/admin/instructions')
      const data = await response.json()
      setInstructions(data)
    }
    fetchInstructions()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.instructions.title')}</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="cursor-pointer">
            {t('admin.instructions.actions.export')}
          </Button>
          <Button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer"
          >
            {t('admin.instructions.actions.create')}
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={instructions} />
    </div>
  )
}
