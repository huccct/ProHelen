'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'

export function SaveDialog({
  isOpen,
  onClose,
  onSave,
  onDiscard,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  onDiscard: () => void
}) {
  const { t } = useTranslation()

  if (!isOpen)
    return null

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t('builder.saveDialog.title')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('builder.saveDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={onDiscard}
            className="w-full sm:w-auto cursor-pointer"
          >
            {t('builder.saveDialog.discard')}
          </Button>
          <Button
            variant="default"
            onClick={onSave}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {t('builder.saveDialog.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
