'use client'

import type { ChecklistItem, ProgressData, ProgressStatus } from '@/types/builder'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ANIMATION_CONFIG } from '@/lib/constants'
import { useProgressCalculation } from '@/lib/hooks/use-progress-calculation'
import { useProgressStatus } from '@/lib/hooks/use-progress-status'
import { useBuilderStore } from '@/store/builder'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Info, Target, TrendingUp } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ProgressIndicatorProps {
  className?: string
}

interface CircularProgressProps {
  score: number
  status: ProgressStatus
}

const CircularProgress = memo<CircularProgressProps>(({ score, status }) => {
  const circumference = 2 * Math.PI * 14
  const strokeDashoffset = circumference * (1 - score / 100)

  return (
    <div className="relative w-8 h-8">
      <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted-foreground/20"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={status.color}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-semibold ${status.color}`}>
          {score}
        </span>
      </div>
    </div>
  )
})

CircularProgress.displayName = 'CircularProgress'

interface ChecklistItemComponentProps {
  item: ChecklistItem
  index: number
}

const ChecklistItemComponent = memo<ChecklistItemComponentProps>(({ item, index }) => {
  const { t } = useTranslation()

  return (
    <motion.div
      className="flex items-center gap-3 p-2.5 bg-muted/30 rounded-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * ANIMATION_CONFIG.CHECKLIST_ITEM.delay }}
    >
      {item.completed
        ? (
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          )
        : (
            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
      <div className="flex-1">
        <div className={`text-sm font-medium ${
          item.completed ? 'text-foreground' : 'text-muted-foreground'
        }`}
        >
          {t(item.label)}
        </div>
      </div>
      <Badge variant={item.completed ? 'default' : 'secondary'} className="text-xs">
        {item.points}
        {' '}
        {t('builder.components.progressIndicator.points')}
      </Badge>
    </motion.div>
  )
})

ChecklistItemComponent.displayName = 'ChecklistItemComponent'

interface StatsCardProps {
  progress: ProgressData
}

const StatsCard = memo<StatsCardProps>(({ progress }) => {
  const { t } = useTranslation()

  const stats = [
    {
      value: progress.nodeCount,
      label: t('builder.components.progressIndicator.totalBlocks'),
    },
    {
      value: progress.diversityCount,
      label: t('builder.components.progressIndicator.categories'),
    },
    {
      value: `${progress.contentProgress}%`,
      label: t('builder.components.progressIndicator.customized'),
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-xl font-bold text-primary">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
})

StatsCard.displayName = 'StatsCard'

interface SuggestionCardProps {
  score: number
}

const SuggestionCard = memo<SuggestionCardProps>(({ score }) => {
  const { t } = useTranslation()

  const getSuggestionKey = useCallback((score: number): string => {
    if (score < 30)
      return 'addCore'
    if (score < 60)
      return 'addContent'
    return 'refine'
  }, [])

  if (score >= 100)
    return null

  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            {t('builder.components.progressIndicator.nextSteps')}
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {t(`builder.components.progressIndicator.suggestions.${getSuggestionKey(score)}`)}
          </p>
        </div>
      </div>
    </div>
  )
})

SuggestionCard.displayName = 'SuggestionCard'

interface ProgressDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  progress: ProgressData
  status: ProgressStatus
}

const ProgressDetailsDialog = memo<ProgressDetailsDialogProps>(({
  open,
  onOpenChange,
  progress,
  status,
}) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            {t('builder.components.progressIndicator.detailTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {t('builder.components.progressIndicator.overallScore')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`builder.components.progressIndicator.status.${status.status}`)}
                  </p>
                </div>
                <div className={`text-3xl font-bold ${status.color}`}>
                  {progress.score}
                  %
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-3 mb-2">
                <motion.div
                  className={`h-3 rounded-full ${status.bgColor} ${status.color} bg-gradient-to-r from-current to-current opacity-80`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.score}%` }}
                  transition={ANIMATION_CONFIG.PROGRESS_BAR}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('builder.components.progressIndicator.starting')}</span>
                <span>{t('builder.components.progressIndicator.complete')}</span>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('builder.components.progressIndicator.improvementChecklist')}
            </h3>

            <div className="space-y-2">
              {progress.checklist.map((item, index) => (
                <ChecklistItemComponent key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>

          <StatsCard progress={progress} />

          <SuggestionCard score={progress.score} />
        </div>
      </DialogContent>
    </Dialog>
  )
})

ProgressDetailsDialog.displayName = 'ProgressDetailsDialog'

export const ProgressIndicator = memo<ProgressIndicatorProps>(({ className }) => {
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)

  const nodes = useBuilderStore(useCallback(state => state.nodes, []))

  const progress = useProgressCalculation(nodes)
  const status = useProgressStatus(progress.score)

  const handleShowDetails = useCallback(() => {
    setShowDetails(true)
  }, [])

  const handleCloseDetails = useCallback((open: boolean) => {
    setShowDetails(open)
  }, [])

  if (nodes.length === 0) {
    return null
  }

  return (
    <>
      <div className={className}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowDetails}
              className="h-auto px-3 py-2 hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CircularProgress score={progress.score} status={status} />
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">
                    {t('builder.components.progressIndicator.completeness')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {progress.nodeCount}
                    {' '}
                    {t('builder.components.progressIndicator.blocks')}
                  </div>
                </div>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('builder.components.progressIndicator.tooltip')}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <ProgressDetailsDialog
        open={showDetails}
        onOpenChange={handleCloseDetails}
        progress={progress}
        status={status}
      />
    </>
  )
})

ProgressIndicator.displayName = 'ProgressIndicator'
