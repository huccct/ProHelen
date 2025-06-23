'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBuilderStore } from '@/store/builder'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/shallow'

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

function previewSelector(state: any) {
  return {
    nodes: state.nodes,
  }
}

export function ValueDemonstration({ currentBlocks, onMotivateUser }: ValueDemonstrationProps) {
  const { t } = useTranslation()
  const { nodes } = useBuilderStore(useShallow(previewSelector))
  const [showDemo, setShowDemo] = useState(false)

  // 分析用户实际构建的指令内容，生成真实的对比示例
  const generateComparisonExample = (): ComparisonExample => {
    const hasRole = currentBlocks.includes('role_definition')
    const hasLearning = currentBlocks.includes('learning_style')
    const hasCommunication = currentBlocks.includes('communication_style')
    const hasFormat = currentBlocks.includes('output_format')
    const hasGoals = currentBlocks.includes('goal_setting')

    // 从节点中提取实际内容
    const getNodeContent = (type: string): string => {
      const node = nodes.find((n: any) => n.data.type === type)
      return node?.data.content || ''
    }

    const roleContent = getNodeContent('role_definition')
    const learningContent = getNodeContent('learning_style')
    const commContent = getNodeContent('communication_style')
    const formatContent = getNodeContent('output_format')
    const goalContent = getNodeContent('goal_setting')

    // 根据实际角色生成相应的场景和提示词
    let scenario = t('builder.components.valueDemonstration.scenarios.general')
    let userQuestion = 'Could you help me understand this topic better?'

    // 智能识别角色类型并生成对应场景
    if (roleContent.toLowerCase().includes('tutor') || roleContent.toLowerCase().includes('teacher')
      || roleContent.toLowerCase().includes('教师') || roleContent.toLowerCase().includes('导师')) {
      scenario = t('builder.components.valueDemonstration.scenarios.tutoring')
      userQuestion = 'Can you teach me about this subject?'
    }
    else if (roleContent.toLowerCase().includes('consultant') || roleContent.toLowerCase().includes('advisor')
      || roleContent.toLowerCase().includes('顾问') || roleContent.toLowerCase().includes('专家')) {
      scenario = t('builder.components.valueDemonstration.scenarios.business')
      userQuestion = 'What would you recommend for my situation?'
    }
    else if (roleContent.toLowerCase().includes('assistant') || roleContent.toLowerCase().includes('helper')
      || roleContent.toLowerCase().includes('助手') || roleContent.toLowerCase().includes('助理')) {
      scenario = 'Smart Personal Assistant'
      userQuestion = 'Can you help me organize my work?'
    }
    else if (roleContent.toLowerCase().includes('writer') || roleContent.toLowerCase().includes('editor')
      || roleContent.toLowerCase().includes('写作') || roleContent.toLowerCase().includes('编辑')) {
      scenario = 'Writing Assistant'
      userQuestion = 'Can you help me improve my writing?'
    }

    // 生成基础回复（普通AI回复）
    const basicResponse = 'I\'d be happy to help you. Could you provide more specific details about what you need assistance with? I\'ll do my best to give you useful information.'

    // 生成优化后的回复（基于用户实际构建的指令）
    let optimizedResponse = ''
    let optimizedPrompt = ''

    // 构建优化提示词描述
    const promptParts = []
    if (roleContent)
      promptParts.push(`Role: ${roleContent.substring(0, 30)}${roleContent.length > 30 ? '...' : ''}`)
    if (commContent)
      promptParts.push(`Style: ${commContent.substring(0, 25)}${commContent.length > 25 ? '...' : ''}`)
    if (formatContent)
      promptParts.push(`Format: Structured`)

    optimizedPrompt = promptParts.length > 0 ? promptParts.join(' | ') : `Enhanced with ${currentBlocks.length} ProHelen blocks`

    // 基于实际角色内容生成优化回复
    if (roleContent) {
      // 使用实际的角色定义开头
      const roleIntro = roleContent.includes('I am') || roleContent.includes('我是')
        ? `${roleContent.split('.')[0]}.`
        : `As your ${roleContent.toLowerCase()},`

      optimizedResponse = `${roleIntro} I'm here to provide you with comprehensive support tailored to your specific needs.\n\n`
    }
    else {
      optimizedResponse = `I'm your dedicated AI assistant, ready to provide personalized support.\n\n`
    }

    // 根据学习风格添加方法说明
    if (learningContent) {
      optimizedResponse += `📚 **My Approach**: ${learningContent}\n`
    }

    // 根据沟通风格调整语调
    if (commContent) {
      optimizedResponse += `💬 **Communication**: ${commContent}\n`
    }

    // 根据输出格式添加结构
    if (formatContent) {
      optimizedResponse += `📋 **Format**: I'll structure my responses according to: ${formatContent}\n`
    }

    // 根据目标设置添加方向
    if (goalContent) {
      optimizedResponse += `🎯 **Goals**: ${goalContent}\n`
    }

    optimizedResponse += `\nWhat specific area would you like to focus on? I'll create a customized plan to help you achieve the best results.`

    // 生成改进点（基于实际使用的blocks）
    const improvements = []
    if (hasRole)
      improvements.push(t('builder.components.valueDemonstration.improvements.personalizedApproach'))
    if (hasCommunication)
      improvements.push(t('builder.components.valueDemonstration.improvements.professionalTone'))
    if (hasFormat)
      improvements.push(t('builder.components.valueDemonstration.improvements.structuredFormat'))
    if (hasLearning)
      improvements.push(t('builder.components.valueDemonstration.improvements.structuredLearning'))
    if (hasGoals)
      improvements.push(t('builder.components.valueDemonstration.improvements.goalOriented'))

    // 确保至少有3个改进点
    if (improvements.length < 3) {
      improvements.push(
        t('builder.components.valueDemonstration.improvements.tailoredResponse'),
        t('builder.components.valueDemonstration.improvements.proactiveSupport'),
        t('builder.components.valueDemonstration.improvements.actionableContent'),
      )
    }

    return {
      scenario,
      basicPrompt: userQuestion,
      basicResponse,
      optimizedPrompt,
      optimizedResponse,
      improvements: improvements.slice(0, 3), // 最多显示3个
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
