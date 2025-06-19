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
      <DialogContent className="bg-background border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-destructive/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            Clear Canvas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Are you sure you want to clear the canvas? This will remove all blocks and connections.
          </p>

          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            ⚠️ This action cannot be undone.
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 cursor-pointer transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            >
              Clear Canvas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
