'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ArrowLeft, HelpCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export function BuilderHeader({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onBackClick,
  onSmartAnalysisClick,
  onShowHelp,
}: {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onBackClick: (e: React.MouseEvent) => void
  onSmartAnalysisClick: (e: React.MouseEvent) => void
  onShowHelp: () => void
  siteName: string
}) {
  const { t } = useTranslation()

  return (
    <div className="flex-none px-4 py-3 border-b border-border">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
          onClick={onBackClick}
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="h-6 w-px bg-border" />
        <div className="flex-1 min-w-0" data-tour="title-input">
          <input
            type="text"
            placeholder={t('builder.untitledInstruction')}
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            className="bg-transparent text-lg font-medium text-foreground border-none focus:outline-none w-full truncate"
          />
          <input
            type="text"
            placeholder={t('builder.addDescription')}
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            className="bg-transparent text-sm text-muted-foreground border-none focus:outline-none w-full mt-0.5 truncate"
          />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSmartAnalysisClick}
              className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Zap className="h-4 w-4 mr-1" />
              {t('builder.analyzer.title')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('builder.analyzer.subtitle')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHelp}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('builder.getHelp')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('builder.helpTip')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
