'use client'

import { Button } from '@/components/ui/button'
import { Edit, HelpCircle, Lightbulb, PlayCircle, Plus, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface EmptyStateGuideProps {
  onAddBlock: () => void
  onStartTour: () => void
  onShowHelp: () => void
}

export function EmptyStateGuide({ onAddBlock, onStartTour, onShowHelp }: EmptyStateGuideProps) {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[200]">
      <div className="max-w-md mx-auto text-center pointer-events-auto">
        <div className="w-16 h-16 bg-muted/50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('builder.components.emptyStateGuide.title')}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          {t('builder.components.emptyStateGuide.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={onAddBlock}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {t('builder.components.emptyStateGuide.addFirstBlock')}
          </Button>
          <Button
            variant="outline"
            onClick={onStartTour}
            className="w-full sm:w-auto flex items-center gap-2 cursor-pointer"
          >
            <PlayCircle className="h-4 w-4" />
            {t('builder.components.emptyStateGuide.takeTour')}
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{t('builder.components.emptyStateGuide.features.addBlocks.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('builder.components.emptyStateGuide.features.addBlocks.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{t('builder.components.emptyStateGuide.features.autoConnect.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('builder.components.emptyStateGuide.features.autoConnect.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Edit className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">{t('builder.components.emptyStateGuide.features.customize.title')}</h4>
                <p className="text-xs text-muted-foreground">{t('builder.components.emptyStateGuide.features.customize.description')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowHelp}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
            {t('builder.components.emptyStateGuide.helpButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}
