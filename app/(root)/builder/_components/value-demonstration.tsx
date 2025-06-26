'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBuilderStore } from '@/store/builder'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  FileText,
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/shallow'

interface ValueDemonstrationProps {
  currentBlocks: string[]
  onMotivateUser: () => void
}

interface BlockContribution {
  blockType: string
  blockName: string
  icon: React.ComponentType<{ className?: string }>
  beforeText: string
  afterText: string
  improvement: string
  content: string
}

const MIN_BLOCKS_FOR_DEMO = 2

function previewSelector(state: any) {
  return {
    nodes: state.nodes,
  }
}

export function ValueDemonstration({ currentBlocks, onMotivateUser }: ValueDemonstrationProps) {
  const { t } = useTranslation()
  const { nodes } = useBuilderStore(useShallow(previewSelector))
  const [showDemo, setShowDemo] = useState(false)

  const getNodeContent = (type: string): string => {
    const node = nodes.find((n: any) => n.data.type === type)
    return node?.data.content || ''
  }

  const generateBlockContributions = (): BlockContribution[] => {
    const contributions: BlockContribution[] = []

    currentBlocks.forEach((blockType) => {
      const content = getNodeContent(blockType)
      if (!content)
        return

      let blockContribution: BlockContribution | null = null

      switch (blockType) {
        case 'role_definition':
          blockContribution = {
            blockType,
            blockName: t('builder.components.valueDemonstration.blocks.roleDefinition'),
            icon: Users,
            beforeText: t('builder.components.valueDemonstration.blockExamples.roleDefinition.before'),
            afterText: content.includes('我是')
              ? t('builder.components.valueDemonstration.blockExamples.roleDefinition.afterWithIdentity', {
                  identity: content.split('。')[0],
                })
              : t('builder.components.valueDemonstration.blockExamples.roleDefinition.afterTemplate', {
                  role: content,
                }),
            improvement: t('builder.components.valueDemonstration.improvements.personalizedApproach'),
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          }
          break

        case 'communication_style':
          blockContribution = {
            blockType,
            blockName: t('builder.components.valueDemonstration.blocks.communicationStyle'),
            icon: MessageCircle,
            beforeText: t('builder.components.valueDemonstration.blockExamples.communicationStyle.before'),
            afterText: t('builder.components.valueDemonstration.blockExamples.communicationStyle.afterTemplate', {
              style: content,
            }),
            improvement: t('builder.components.valueDemonstration.improvements.professionalTone'),
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          }
          break

        case 'output_format':
          blockContribution = {
            blockType,
            blockName: t('builder.components.valueDemonstration.blocks.outputFormat'),
            icon: FileText,
            beforeText: t('builder.components.valueDemonstration.blockExamples.outputFormat.before'),
            afterText: t('builder.components.valueDemonstration.blockExamples.outputFormat.afterTemplate', {
              format: content,
            }),
            improvement: t('builder.components.valueDemonstration.improvements.structuredFormat'),
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          }
          break

        case 'learning_style':
          blockContribution = {
            blockType,
            blockName: t('builder.components.valueDemonstration.blocks.learningStyle'),
            icon: Target,
            beforeText: t('builder.components.valueDemonstration.blockExamples.learningStyle.before'),
            afterText: t('builder.components.valueDemonstration.blockExamples.learningStyle.afterTemplate', {
              style: content,
            }),
            improvement: t('builder.components.valueDemonstration.improvements.structuredLearning'),
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          }
          break

        case 'goal_setting':
          blockContribution = {
            blockType,
            blockName: t('builder.components.valueDemonstration.blocks.goalSetting'),
            icon: Zap,
            beforeText: t('builder.components.valueDemonstration.blockExamples.goalSetting.before'),
            afterText: t('builder.components.valueDemonstration.blockExamples.goalSetting.afterTemplate', {
              goal: content,
            }),
            improvement: t('builder.components.valueDemonstration.improvements.goalOriented'),
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          }
          break

        case 'context_setting':
          blockContribution = {
            blockType,
            blockName: t('builder.components.valueDemonstration.blocks.contextSetting'),
            icon: Settings,
            beforeText: t('builder.components.valueDemonstration.blockExamples.contextSetting.before'),
            afterText: t('builder.components.valueDemonstration.blockExamples.contextSetting.afterTemplate', {
              context: content,
            }),
            improvement: t('builder.components.valueDemonstration.improvements.tailoredResponse'),
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          }
          break
      }

      if (blockContribution) {
        contributions.push(blockContribution)
      }
    })

    return contributions
  }

  const blockContributions = generateBlockContributions()
  const shouldShowButton = currentBlocks.length >= MIN_BLOCKS_FOR_DEMO

  if (!shouldShowButton) {
    return null
  }

  const handleOpenDemo = () => {
    setShowDemo(true)
  }

  const handleContinueBuilding = () => {
    setShowDemo(false)
    onMotivateUser()
  }

  const qualityImprovement = Math.min(currentBlocks.length * 25, 100)
  const professionalFeatures = currentBlocks.length * 2

  return (
    <>
      {/* Floating Action Button */}
      <div className="absolute bottom-4 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={handleOpenDemo}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer"
            size="lg"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('builder.components.valueDemonstration.showImpact')}
            <Badge variant="secondary" className="ml-2 bg-background/20 text-primary-foreground">
              {currentBlocks.length}
            </Badge>
          </Button>
        </motion.div>
      </div>

      {/* Value Demonstration Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="bg-background border-border text-foreground max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              {t('builder.components.valueDemonstration.title')}
            </DialogTitle>
            <p className="text-muted-foreground">
              {t('builder.components.valueDemonstration.subtitle')}
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto scrollbar pr-2 space-y-6">
            {/* Overall Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  {t('builder.components.valueDemonstration.beforeTitle')}
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {t('builder.components.valueDemonstration.beforeResponse')}
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {t('builder.components.valueDemonstration.afterTitle')}
                </h3>
                <div className="text-sm text-primary leading-relaxed">
                  {t('builder.components.valueDemonstration.afterDescription', { count: currentBlocks.length })}
                </div>
              </div>
            </div>

            {/* Individual Block Contributions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t('builder.components.valueDemonstration.blocksTitle')}
              </h3>

              <div className="space-y-3">
                {blockContributions.map((contribution, index) => {
                  const IconComponent = contribution.icon
                  return (
                    <motion.div
                      key={contribution.blockType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Block Icon */}
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          {/* Block Header */}
                          <div>
                            <h4 className="font-semibold text-primary">{contribution.blockName}</h4>
                            <p className="text-sm text-muted-foreground">{contribution.content}</p>
                          </div>

                          {/* Before/After Comparison */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-muted/30 rounded-lg p-3 max-h-32 overflow-y-auto">
                              <p className="text-xs text-muted-foreground mb-1">
                                {t('builder.components.valueDemonstration.before')}
                              </p>
                              <p className="text-sm leading-relaxed">{contribution.beforeText}</p>
                            </div>
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 max-h-32 overflow-y-auto">
                              <p className="text-xs text-primary mb-1">
                                {t('builder.components.valueDemonstration.after')}
                              </p>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{contribution.afterText}</p>
                            </div>
                          </div>

                          {/* Improvement Badge */}
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">{contribution.improvement}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Cumulative Impact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t('builder.components.valueDemonstration.cumulativeTitle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentBlocks.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('builder.components.valueDemonstration.blocksCount', { count: currentBlocks.length })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {qualityImprovement}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('builder.components.valueDemonstration.qualityImprovement', { percent: qualityImprovement })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{professionalFeatures}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('builder.components.valueDemonstration.professionalFeatures', { count: professionalFeatures })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action - Fixed at bottom */}
          <div className="flex-shrink-0 text-center pt-4 border-t border-border">
            <Button
              onClick={handleContinueBuilding}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors cursor-pointer"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('builder.components.valueDemonstration.addMoreBlocks')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              {t('builder.components.valueDemonstration.keepBuilding')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
