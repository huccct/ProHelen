'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ValueDemonstrationProps {
  currentBlocks: string[]
  onMotivateUser: () => void
}

interface ComparisonExample {
  scenario: string
  basicPrompt: string
  basicResponse: string
  optimizedPrompt: string
  optimizedResponse: string
  improvements: string[]
}

export function ValueDemonstration({ currentBlocks, onMotivateUser }: ValueDemonstrationProps) {
  const { t } = useTranslation()
  const [showDemo, setShowDemo] = useState(false)

  // 根据当前块生成对比示例
  const generateComparisonExample = (): ComparisonExample => {
    const hasRole = currentBlocks.includes('role_definition')
    const hasLearning = currentBlocks.includes('learning_style')
    const hasCommunication = currentBlocks.includes('communication_style')

    if (hasRole && hasLearning) {
      return {
        scenario: t('builder.components.valueDemonstration.scenarios.tutoring'),
        basicPrompt: 'Help me learn mathematics',
        basicResponse: 'Mathematics is a broad subject. What specific area would you like to learn about? I can help explain concepts and solve problems.',
        optimizedPrompt: 'Role: Expert Math Tutor | Learning Style: Step-by-step with examples',
        optimizedResponse: 'As your dedicated math tutor, I\'ll guide you through mathematics step-by-step! Let\'s start by identifying your current level and goals. I\'ll use visual examples, break down complex problems into manageable steps, and provide practice exercises. What specific math topic interests you? (Algebra, Geometry, Calculus, etc.)',
        improvements: [
          t('builder.components.valueDemonstration.improvements.personalizedApproach'),
          t('builder.components.valueDemonstration.improvements.structuredLearning'),
          t('builder.components.valueDemonstration.improvements.clearRoadmap'),
        ],
      }
    }

    if (hasRole && hasCommunication) {
      return {
        scenario: t('builder.components.valueDemonstration.scenarios.business'),
        basicPrompt: 'Write a business proposal',
        basicResponse: 'Here\'s a basic business proposal template: Executive Summary, Problem Statement, Solution, Timeline, Budget. Let me know what specific business you\'re proposing for.',
        optimizedPrompt: 'Role: Business Consultant | Tone: Professional & Persuasive | Format: Structured',
        optimizedResponse: 'As your business strategy consultant, I\'ll craft a compelling proposal that drives results. Here\'s my systematic approach:\n\n📊 EXECUTIVE SUMMARY (2-3 key points)\n🎯 PROBLEM ANALYSIS (data-driven insights)\n💡 STRATEGIC SOLUTION (clear value proposition)\n📈 IMPLEMENTATION ROADMAP (realistic timeline)\n💰 ROI PROJECTION (quantified benefits)\n\nWhat\'s your business context and target audience?',
        improvements: [
          t('builder.components.valueDemonstration.improvements.professionalTone'),
          t('builder.components.valueDemonstration.improvements.structuredFormat'),
          t('builder.components.valueDemonstration.improvements.actionableContent'),
        ],
      }
    }

    // 默认通用示例
    return {
      scenario: t('builder.components.valueDemonstration.scenarios.general'),
      basicPrompt: 'Help me with my project',
      basicResponse: 'I\'d be happy to help with your project. Could you provide more details about what you\'re working on and what specific assistance you need?',
      optimizedPrompt: `Enhanced with ${currentBlocks.length} ProHelen blocks`,
      optimizedResponse: 'I\'m your dedicated project assistant! Let me provide comprehensive support tailored to your needs. First, I\'ll understand your project scope, then create a structured action plan with clear milestones. I\'ll adapt my communication style to match your preferences and ensure every response moves you closer to success. What\'s your project about?',
      improvements: [
        t('builder.components.valueDemonstration.improvements.tailoredResponse'),
        t('builder.components.valueDemonstration.improvements.proactiveSupport'),
        t('builder.components.valueDemonstration.improvements.goalOriented'),
      ],
    }
  }

  const example = generateComparisonExample()

  const shouldShowButton = currentBlocks.length >= 2

  if (!shouldShowButton)
    return null

  return (
    <>
      {/* Canvas Bottom Right Button */}
      <div className="absolute bottom-4 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => setShowDemo(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg cursor-pointer"
            size="lg"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('builder.components.valueDemonstration.showImpact')}
            <Badge variant="secondary" className="ml-2">
              {currentBlocks.length}
            </Badge>
          </Button>
        </motion.div>
      </div>

      {/* Comparison Modal */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="bg-background border-border text-foreground max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              {t('builder.components.valueDemonstration.title')}
            </DialogTitle>
            <p className="text-muted-foreground">
              {t('builder.components.valueDemonstration.subtitle')}
              {' '}
              <span className="font-semibold text-primary">{currentBlocks.length}</span>
              {' '}
              {t('builder.components.valueDemonstration.blocksUsed')}
            </p>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] scrollbar">
            {/* Scenario Context */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                {t('builder.components.valueDemonstration.scenario')}
                :
                {example.scenario}
              </h3>
            </div>

            {/* Before/After Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Before - Basic */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    {t('builder.components.valueDemonstration.beforeTitle')}
                  </h3>
                </div>

                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('builder.components.valueDemonstration.userInput')}
                    :
                  </p>
                  <p className="font-medium mb-3 bg-white dark:bg-gray-800 p-3 rounded border break-words">
                    "
                    {example.basicPrompt}
                    "
                  </p>

                  <p className="text-sm text-muted-foreground mb-2">
                    {t('builder.components.valueDemonstration.aiResponse')}
                    :
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border text-sm break-words whitespace-pre-wrap">
                    {example.basicResponse}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{t('builder.components.valueDemonstration.genericResponse')}</span>
                  </div>
                </div>
              </motion.div>

              {/* After - Optimized */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-primary">
                    {t('builder.components.valueDemonstration.afterTitle')}
                  </h3>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('builder.components.valueDemonstration.enhancedPrompt')}
                    :
                  </p>
                  <p className="font-medium mb-3 bg-white dark:bg-gray-800 p-3 rounded border break-words">
                    "
                    {example.optimizedPrompt}
                    "
                  </p>

                  <p className="text-sm text-muted-foreground mb-2">
                    {t('builder.components.valueDemonstration.aiResponse')}
                    :
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border text-sm break-words whitespace-pre-wrap">
                    {example.optimizedResponse}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{t('builder.components.valueDemonstration.optimizedResponse')}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Key Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/30 border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t('builder.components.valueDemonstration.keyImprovements')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {example.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-1 p-4 bg-card rounded-lg border border-border">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm break-words">{improvement}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <div className="mt-6 text-center">
              <Button
                onClick={() => {
                  setShowDemo(false)
                  onMotivateUser()
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t('builder.components.valueDemonstration.addMoreBlocks')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {t('builder.components.valueDemonstration.keepBuilding')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
