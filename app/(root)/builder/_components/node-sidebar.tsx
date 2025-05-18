'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { BlockPickerModal } from './block-picker-modal'

interface NodeSidebarProps {
  className?: string
}

export function NodeSidebar({ className }: NodeSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <aside className={className}>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Blocks</h3>
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
            <span className="text-sm text-gray-400">Add a new block</span>
          </div>
          <BlockPickerModal open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </aside>
  )
}
