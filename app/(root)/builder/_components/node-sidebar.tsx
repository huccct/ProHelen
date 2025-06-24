'use client'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/store/builder'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BlockPickerModal } from './block-picker-modal'

interface NodeSidebarProps {
  className?: string
}

export function NodeSidebar({ className }: NodeSidebarProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const addNode = useBuilderStore(state => state.addNode)
  const addQuickStartTemplate = useBuilderStore(state => state.addQuickStartTemplate)

  return (
    <aside className={className}>
      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">{t('builder.components.nodeSidebar.title')}</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-dashed border-2 hover:border-solid"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{t('builder.components.nodeSidebar.addBlock')}</span>
          </div>
          <BlockPickerModal
            open={open}
            onOpenChange={setOpen}
            onAddNode={addNode}
            onAddQuickStartTemplate={addQuickStartTemplate}
          />
        </div>
      </div>
    </aside>
  )
}
