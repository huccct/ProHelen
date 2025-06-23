'use client'

import { FlowCanvas } from '@/components/flow-canvas'
import { HelpPanel } from '@/components/help-panel'
import { OnboardingTour } from '@/components/onboarding-tour'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderStore } from '@/store/builder'
import { ArrowLeft, HelpCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GuidedCanvas } from './_components/guided-canvas'
import { GuidedHeader } from './_components/guided-header'
import { GuidedWelcome } from './_components/guided-welcome'
import { PromptPreview } from './_components/prompt-preview'
import { SimpleWizard } from './_components/simple-wizard'

interface BuilderState {
  title: string
  description: string
  content: string
  tags: string[]
  isTemplate: boolean
  sourceId: string | null
}

// 添加界面模式类型
type InterfaceMode = 'simple' | 'guided' | 'advanced'

function BuilderContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const importFlowData = useBuilderStore(state => state.importFlowData)
  const setTitle = useBuilderStore(state => state.setTitle)
  const setDescription = useBuilderStore(state => state.setDescription)
  const resetFlow = useBuilderStore(state => state.resetFlow)
  const undo = useBuilderStore(state => state.undo)
  const redo = useBuilderStore(state => state.redo)
  const canUndo = useBuilderStore(state => state.canUndo)
  const canRedo = useBuilderStore(state => state.canRedo)
  const [builderState, setBuilderState] = useState<BuilderState>({
    title: '',
    description: '',
    content: '',
    tags: [],
    isTemplate: false,
    sourceId: null,
  })
  const [previewWidth, setPreviewWidth] = useState(320)
  const [isDragging, setIsDragging] = useState(false)
  const [showHelpPanel, setShowHelpPanel] = useState(false)
  const [showOnboardingTour, setShowOnboardingTour] = useState(false)

  // 添加界面模式状态
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('simple')

  // 添加引导状态
  const [guidedState, setGuidedState] = useState({
    step: 'welcome', // welcome, arrange, customize, test
    isFirstTime: true,
    showHints: true,
  })

  // 检查是否应该显示简化模式
  useEffect(() => {
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    // 只有从模板/指令导入时才使用高级模式，其他情况都从简单模式开始
    if (hasTemplate || hasInstruction) {
      setInterfaceMode('advanced')
    }
  }, [searchParams])

  const handleWizardComplete = useCallback((config: any) => {
    // 根据用户配置自动创建blocks
    const { addNode, setTitle, setDescription, updateNodeData } = useBuilderStore.getState()

    // 生成动态标题
    let generatedTitle = 'My AI Assistant'
    if (config.purpose) {
      generatedTitle = config.purpose.label.replace('🎓 ', '').replace('✍️ ', '').replace('💼 ', '').replace('🏠 ', '')
    }

    // 生成描述
    let generatedDescription = 'Created with Quick Setup'
    if (config.purpose && config.tone) {
      generatedDescription = `${config.purpose.description} with ${config.tone.description.toLowerCase()}`
    }

    setTitle(generatedTitle)
    setDescription(generatedDescription)

    // 生成Role Definition内容
    let roleContent = `You are a helpful AI assistant`
    if (config.purpose) {
      switch (config.purpose.value) {
        case 'learning':
          roleContent = `You are an expert learning coach and tutor. Your role is to help users learn new knowledge effectively, answer their questions clearly, and guide them through skill development.`
          break
        case 'writing':
          roleContent = `You are a professional writing assistant. Your expertise includes helping with articles, emails, creative content, and improving writing quality across different formats.`
          break
        case 'work':
          roleContent = `You are a productivity and business consultant. You help users improve their work efficiency, analyze data, solve business problems, and make informed decisions.`
          break
        case 'personal':
          roleContent = `You are a personal life assistant. You provide guidance on daily decisions, health advice, personal planning, and help users organize their personal lives.`
          break
      }
    }

    // 添加核心块 - Role Definition (所有类型都需要)
    addNode('role_definition', { x: 250, y: 100 })

    // 根据用途添加相应的块
    if (config.purpose) {
      switch (config.purpose.value) {
        case 'learning':
          addNode('learning_style', { x: 250, y: 200 })
          addNode('subject_focus', { x: 250, y: 300 })
          addNode('difficulty_level', { x: 250, y: 400 })
          break
        case 'writing':
          addNode('communication_style', { x: 250, y: 200 })
          addNode('output_format', { x: 250, y: 300 })
          addNode('creative_thinking', { x: 250, y: 400 })
          break
        case 'work':
          addNode('context_setting', { x: 250, y: 200 })
          addNode('output_format', { x: 250, y: 300 })
          addNode('prioritization', { x: 250, y: 400 })
          break
        case 'personal':
          addNode('communication_style', { x: 250, y: 200 })
          addNode('personality_traits', { x: 250, y: 300 })
          addNode('goal_setting', { x: 250, y: 400 })
          break
      }
    }

    // 根据经验水平添加相应的块
    if (config.expertise?.value === 'beginner') {
      addNode('step_by_step', { x: 450, y: 200 })
    }
    else if (config.expertise?.value === 'advanced') {
      addNode('conditional_logic', { x: 450, y: 200 })
    }

    // 如果有具体目标且不是personal类型（personal类型已经添加过goal_setting），添加目标设置块
    if (config.goal?.value && config.purpose?.value !== 'personal') {
      addNode('goal_setting', { x: 450, y: 300 })
    }

    // 等待节点创建完成后填充内容
    setTimeout(() => {
      const state = useBuilderStore.getState()
      const nodes = state.nodes

      // 填充Role Definition内容
      const roleNode = nodes.find(n => n.data.type === 'role_definition')
      if (roleNode) {
        updateNodeData(roleNode.id, { content: roleContent })
      }

      // 填充所有blocks的内容
      nodes.forEach((node) => {
        const nodeType = node.data.type
        let content = ''

        switch (nodeType) {
          case 'communication_style':
            if (config.tone) {
              switch (config.tone.value) {
                case 'professional':
                  content = 'Maintain a professional and formal tone. Be authoritative, use proper terminology, and present information in a structured manner.'
                  break
                case 'friendly':
                  content = 'Use a warm, friendly, and approachable tone. Be conversational, encouraging, and make the user feel comfortable.'
                  break
                case 'encouraging':
                  content = 'Be motivating and supportive. Provide positive reinforcement, celebrate progress, and help build confidence.'
                  break
                case 'direct':
                  content = 'Be concise and direct. Get straight to the point, avoid unnecessary details, and provide clear, actionable information.'
                  break
              }
            }
            break

          case 'learning_style':
            content = `Adapt your teaching approach to be interactive and engaging. Use examples, analogies, and step-by-step explanations. Encourage questions and provide multiple ways to understand concepts.`
            break

          case 'subject_focus':
            content = `Focus on the specific subject matter the user wants to learn. Provide accurate, up-to-date information and relate concepts to real-world applications.`
            break

          case 'difficulty_level':
            if (config.expertise) {
              switch (config.expertise.value) {
                case 'beginner':
                  content = 'Adjust explanations for beginners. Use simple language, provide basic concepts first, and include plenty of examples.'
                  break
                case 'intermediate':
                  content = 'Provide intermediate-level guidance. Assume some basic knowledge but still explain complex concepts clearly.'
                  break
                case 'advanced':
                  content = 'Offer advanced insights. Use technical language when appropriate and focus on nuanced or complex aspects.'
                  break
              }
            }
            break

          case 'output_format':
            content = `Structure your responses clearly with headings, bullet points, or numbered lists when appropriate. Make information easy to scan and understand.`
            break

          case 'creative_thinking':
            content = `Encourage creative approaches to writing. Suggest different perspectives, brainstorming techniques, and innovative ways to express ideas.`
            break

          case 'context_setting':
            content = `Understand the user's work environment and constraints. Consider their industry, role, and specific challenges when providing advice.`
            break

          case 'prioritization':
            content = `Help users identify what's most important and urgent. Provide frameworks for decision-making and task management.`
            break

          case 'personality_traits':
            content = `Be empathetic, understanding, and non-judgmental. Show genuine interest in the user's well-being and personal growth.`
            break

          case 'goal_setting':
            if (config.goal?.value) {
              content = `Primary Goal: ${config.goal.value}\n\nFocus on helping the user achieve this specific objective through structured guidance and support.`
            }
            else {
              content = `Help users set clear, achievable goals. Use the SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound) when appropriate.`
            }
            break

          case 'step_by_step':
            content = `Break down complex tasks into manageable steps. Provide clear instructions and check for understanding before moving to the next step.`
            break

          case 'conditional_logic':
            content = `Adapt your responses based on the user's specific situation. Ask clarifying questions when needed and provide tailored advice.`
            break
        }

        if (content && !node.data.content) {
          updateNodeData(node.id, { content })
        }
      })

      // 自动连接系统会处理所有连接，不需要手动创建
    }, 100)

    // 更新builder state
    setBuilderState({
      title: generatedTitle,
      description: generatedDescription,
      content: '',
      tags: [],
      isTemplate: false,
      sourceId: null,
    })

    // 切换到引导模式而不是高级模式
    setInterfaceMode('guided')
  }, [setInterfaceMode])

  const handleSwitchToAdvanced = useCallback(() => {
    setInterfaceMode('advanced')
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newWidth = window.innerWidth - e.clientX
      setPreviewWidth(Math.max(280, Math.min(600, newWidth)))
    }
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Check if user is new and should see onboarding
  useEffect(() => {
    const tourCompleted = localStorage.getItem('prohelen-tour-completed')
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    // Show tour for new users who aren't importing something
    if (!tourCompleted && !hasTemplate && !hasInstruction) {
      setTimeout(() => setShowOnboardingTour(true), 1000)
    }
  }, [searchParams])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 for help
      if (e.key === 'F1') {
        e.preventDefault()
        setShowHelpPanel(true)
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setShowHelpPanel(false)
        setShowOnboardingTour(false)
      }

      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) {
          undo()
        }
      }

      // Ctrl+Y for redo (or Ctrl+Shift+Z)
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        if (canRedo()) {
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  useEffect(() => {
    const templateId = searchParams.get('template')
    const instructionId = searchParams.get('instruction')

    if (templateId) {
      // Fetch template from API
      fetch(`/api/templates/${templateId}`)
        .then(res => res.json())
        .then((template) => {
          if (template) {
            // Update builder state
            setBuilderState({
              title: template.title,
              description: template.description,
              content: template.content || '',
              tags: [],
              isTemplate: false,
              sourceId: templateId,
            })

            // Update store with title and description
            setTitle(template.title)
            setDescription(template.description)

            // Import flow data if available
            if (template.flowData) {
              importFlowData(template.flowData)
            }
          }
        })
        .catch(console.error)
    }
    else if (instructionId) {
      // Fetch instruction from API
      fetch(`/api/instructions/${instructionId}`)
        .then(res => res.json())
        .then((data) => {
          if (data.instruction) {
            const instruction = data.instruction
            setBuilderState({
              title: `Copy of ${instruction.title}`,
              description: instruction.description || '',
              content: instruction.content || '',
              tags: instruction.tags || [],
              isTemplate: false,
              sourceId: instructionId,
            })

            // Update store
            setTitle(`Copy of ${instruction.title}`)
            setDescription(instruction.description || '')

            // Import flow data if available
            if (instruction.flowData) {
              importFlowData(instruction.flowData)
            }
          }
        })
        .catch(console.error)
    }
    else {
      // No query parameters, reset to fresh state
      setBuilderState({
        title: '',
        description: '',
        content: '',
        tags: [],
        isTemplate: false,
        sourceId: null,
      })

      // Reset store and flow data
      resetFlow()
    }
  }, [searchParams, importFlowData, setTitle, setDescription, resetFlow])

  // 简化模式显示向导
  if (interfaceMode === 'simple') {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">ProHelen</span>
            </div>
            <div />
            {' '}
            {/* spacer */}
          </div>
        </div>
        <div className="pt-20">
          <SimpleWizard
            onComplete={handleWizardComplete}
            onSwitchToAdvanced={handleSwitchToAdvanced}
          />
        </div>
      </div>
    )
  }

  // 引导模式显示欢迎界面或引导流程
  if (interfaceMode === 'guided') {
    if (guidedState.step === 'welcome') {
      return (
        <GuidedWelcome
          onNext={() => setGuidedState(prev => ({ ...prev, step: 'arrange' }))}
          onBackToSimple={() => setInterfaceMode('simple')}
          onSkipToAdvanced={handleSwitchToAdvanced}
        />
      )
    }

    // 引导步骤界面
    const handleNextStep = () => {
      const steps = ['arrange', 'customize', 'test']
      const currentIndex = steps.indexOf(guidedState.step as string)
      if (currentIndex < steps.length - 1) {
        setGuidedState(prev => ({ ...prev, step: steps[currentIndex + 1] as any }))
      }
      else {
        // 完成引导，切换到高级模式
        setInterfaceMode('advanced')
      }
    }

    const handlePreviousStep = () => {
      const steps = ['arrange', 'customize', 'test']
      const currentIndex = steps.indexOf(guidedState.step as string)
      if (currentIndex > 0) {
        setGuidedState(prev => ({ ...prev, step: steps[currentIndex - 1] as any }))
      }
      else {
        setGuidedState(prev => ({ ...prev, step: 'welcome' }))
      }
    }

    const canProceed = true // TODO: Add step-specific validation

    return (
      <div className="flex flex-col h-screen bg-background">
        <GuidedHeader
          step={guidedState.step as any}
          onNext={handleNextStep}
          onPrevious={handlePreviousStep}
          onAdvanced={handleSwitchToAdvanced}
          canProceed={canProceed}
        />

        <div className="flex-1 relative">
          <GuidedCanvas
            step={guidedState.step as any}
          />

          {/* 简化的预览面板 */}
          <div className="absolute right-4 top-4 bottom-4 w-80">
            <PromptPreview className="h-full border rounded-lg shadow-sm" />
          </div>
        </div>
      </div>
    )
  }

  // 高级模式显示完整编辑器
  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-background">
      <div className="flex-none px-4 py-3 border-b border-border">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex-1 min-w-0" data-tour="title-input">
            <input
              type="text"
              placeholder={t('builder.untitledInstruction')}
              value={builderState.title}
              onChange={e => setBuilderState(prev => ({ ...prev, title: e.target.value }))}
              className="bg-transparent text-lg font-medium text-foreground border-none focus:outline-none w-full truncate"
            />
            <input
              type="text"
              placeholder={t('builder.addDescription')}
              value={builderState.description}
              onChange={e => setBuilderState(prev => ({ ...prev, description: e.target.value }))}
              className="bg-transparent text-sm text-muted-foreground border-none focus:outline-none w-full mt-0.5 truncate"
            />
          </div>

          {/* Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInterfaceMode('simple')}
                className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <Zap className="h-4 w-4 mr-1" />
                {t('builder.simpleMode')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('builder.switchToSimpleMode')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('builder.simpleModeTip')}</p>
            </TooltipContent>
          </Tooltip>

          {/* Help Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpPanel(true)}
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
      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas
          className="flex-1 h-full"
          onStartTour={() => setShowOnboardingTour(true)}
          onShowHelp={() => setShowHelpPanel(true)}
        />
        <div
          className="w-1 hover:w-2 bg-border cursor-col-resize transition-all hover:bg-border/80 active:bg-border/60"
          onMouseDown={handleMouseDown}
        />
        <PromptPreview
          className="overflow-y-hidden border-l border-border"
          style={{ width: previewWidth }}
          data-tour="preview-panel"
        />
      </div>

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        onStartTour={() => {
          setShowHelpPanel(false)
          setShowOnboardingTour(true)
        }}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboardingTour}
        onClose={() => setShowOnboardingTour(false)}
        onComplete={() => {
          setShowOnboardingTour(false)
          localStorage.setItem('prohelen-tour-completed', 'true')
        }}
      />

    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense>
      <BuilderContent />
    </Suspense>
  )
}
