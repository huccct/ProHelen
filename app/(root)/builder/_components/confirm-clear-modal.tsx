'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ConfirmClearModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmClearModal({ open, onOpenChange, onConfirm }: ConfirmClearModalProps) {
  const { t } = useTranslation()

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
            {t('builder.modals.confirmClear.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            {t('builder.modals.confirmClear.message')}
          </p>

          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            {t('builder.modals.confirmClear.warning')}
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 cursor-pointer transition-colors"
            >
              {t('builder.modals.confirmClear.cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            >
              {t('builder.modals.confirmClear.confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
