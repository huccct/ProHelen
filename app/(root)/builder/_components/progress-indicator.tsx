'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderStore } from '@/store/builder'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Info, Target, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ProgressIndicatorProps {
  className?: string
}

export function ProgressIndicator({ className }: ProgressIndicatorProps) {
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)
  const nodes = useBuilderStore(state => state.nodes)

  // calculate the completeness score based on prompt engineering best practices
  const calculateCompleteness = () => {
    let score = 0
    const checklist: Array<{ id: string, label: string, completed: boolean, points: number }> = []

    // Core essential blocks (60 points total)
    const hasRoleDefinition = nodes.some(node => node.data?.type === 'role_definition')
    const hasContextSetting = nodes.some(node => node.data?.type === 'context_setting')
    const hasOutputFormat = nodes.some(node => node.data?.type === 'output_format')

    checklist.push({
      id: 'role',
      label: t('builder.components.progressIndicator.checklist.roleDefinition'),
      completed: hasRoleDefinition,
      points: 20,
    })

    checklist.push({
      id: 'context',
      label: t('builder.components.progressIndicator.checklist.contextSetting'),
      completed: hasContextSetting,
      points: 20,
    })

    checklist.push({
      id: 'output',
      label: t('builder.components.progressIndicator.checklist.outputFormat'),
      completed: hasOutputFormat,
      points: 20,
    })

    // Task clarity check - analyze content for clear task definition
    const hasTaskClarity = nodes.some((node) => {
      const content = node.data?.content?.toLowerCase() || ''
      return content.includes('任务') || content.includes('task')
        || content.includes('目标') || content.includes('goal')
        || content.includes('需要') || content.includes('need')
        || content.includes('帮助') || content.includes('help')
    })

    checklist.push({
      id: 'taskClarity',
      label: t('builder.components.progressIndicator.checklist.taskClarity'),
      completed: hasTaskClarity,
      points: 15,
    })

    // Communication style (reduced importance)
    const hasCommunicationStyle = nodes.some(node => node.data?.type === 'communication_style')
    checklist.push({
      id: 'communication',
      label: t('builder.components.progressIndicator.checklist.communicationStyle'),
      completed: hasCommunicationStyle,
      points: 10,
    })

    // Content quality assessment (improved scoring)
    const nodesWithContent = nodes.filter(node =>
      node.data?.content && node.data.content.trim().length > 20, // Require meaningful content
    ).length
    const contentCompleteness = nodes.length > 0 ? (nodesWithContent / nodes.length) * 100 : 0

    // Check for examples in content
    const hasExamples = nodes.some((node) => {
      const content = node.data?.content?.toLowerCase() || ''
      return content.includes('例如') || content.includes('example')
        || content.includes('示例') || content.includes('比如')
        || content.includes('for example') || content.includes('such as')
    })

    checklist.push({
      id: 'content',
      label: t('builder.components.progressIndicator.checklist.customContent'),
      completed: contentCompleteness >= 75,
      points: 15,
    })

    checklist.push({
      id: 'examples',
      label: t('builder.components.progressIndicator.checklist.examples'),
      completed: hasExamples,
      points: 10,
    })

    // Diversity scoring (reduced importance)
    const categories = new Set(nodes.filter(node => node.data?.type).map((node) => {
      const nodeType = node.data.type
      if (['role_definition', 'context_setting', 'output_format'].includes(nodeType))
        return 'core'
      if (['goal_setting', 'learning_style', 'subject_focus', 'difficulty_level'].includes(nodeType))
        return 'education'
      if (['communication_style', 'feedback_style', 'personality_traits'].includes(nodeType))
        return 'behavior'
      if (['step_by_step', 'time_management', 'prioritization'].includes(nodeType))
        return 'workflow'
      if (['conditional_logic', 'creative_thinking', 'error_handling'].includes(nodeType))
        return 'advanced'
      if (['career_planning', 'skill_assessment'].includes(nodeType))
        return 'planning'
      return 'other'
    }))

    checklist.push({
      id: 'diversity',
      label: t('builder.components.progressIndicator.checklist.diversity'),
      completed: categories.size >= 2,
      points: 10,
    })

    // Calculate final score
    const baseScore = checklist.reduce((total, item) => total + (item.completed ? item.points : 0), 0)

    // Bonus for high-quality content (replace previous simple bonus)
    let qualityBonus = 0
    if (contentCompleteness >= 90)
      qualityBonus += 5
    if (categories.size >= 3)
      qualityBonus += 5

    score = baseScore + qualityBonus

    return {
      score: Math.min(100, Math.round(score)),
      checklist,
      nodeCount: nodes.length,
      contentProgress: Math.round(contentCompleteness),
      hasExamples,
      hasTaskClarity,
      diversityCount: categories.size,
    }
  }

  const progress = calculateCompleteness()

  const getProgressStatus = (score: number) => {
    if (score >= 80)
      return { status: 'excellent', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60)
      return { status: 'good', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 30)
      return { status: 'fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { status: 'starting', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  }

  const status = getProgressStatus(progress.score)

  if (nodes.length === 0) {
    return null
  }

  return (
    <>
      <div className={`${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="h-auto px-3 py-2 hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
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
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress.score / 100)}`}
                      className={status.color}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-semibold ${status.color}`}>
                      {progress.score}
                    </span>
                  </div>
                </div>
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

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
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
                    transition={{ duration: 1, ease: 'easeOut' }}
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
                {progress.checklist.map(item => (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 bg-muted/30 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.completed
                      ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )
                      : (
                          <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.label}
                      </div>
                    </div>
                    <Badge variant={item.completed ? 'default' : 'secondary'} className="text-xs">
                      {item.points}
                      {' '}
                      {t('builder.components.progressIndicator.points')}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{progress.nodeCount}</div>
                <div className="text-xs text-muted-foreground">
                  {t('builder.components.progressIndicator.totalBlocks')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{progress.diversityCount}</div>
                <div className="text-xs text-muted-foreground">
                  {t('builder.components.progressIndicator.categories')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {progress.contentProgress}
                  %
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('builder.components.progressIndicator.customized')}
                </div>
              </div>
            </div>

            {progress.score < 100 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      {t('builder.components.progressIndicator.nextSteps')}
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {progress.score < 30
                        ? t('builder.components.progressIndicator.suggestions.addCore')
                        : progress.score < 60
                          ? t('builder.components.progressIndicator.suggestions.addContent')
                          : t('builder.components.progressIndicator.suggestions.refine')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
