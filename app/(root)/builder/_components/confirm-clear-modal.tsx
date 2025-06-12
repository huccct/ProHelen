'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface ConfirmClearModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmClearModal({ open, onOpenChange, onConfirm }: ConfirmClearModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            Clear Canvas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Are you sure you want to clear the canvas? This will remove all blocks and connections.
          </p>

          <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            ⚠️ This action cannot be undone.
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 cursor-pointer transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Clear Canvas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
