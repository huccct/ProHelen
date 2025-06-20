'use client'

import type { Edge } from '@xyflow/react'
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
type InterfaceMode = 'simple' | 'advanced'

function BuilderContent() {
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

  // 检查是否应该显示简化模式
  useEffect(() => {
    const hasAdvancedPreference = localStorage.getItem('prohelen-prefer-advanced')
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    // 如果用户之前选择了高级模式，或者是从模板/指令导入，使用高级模式
    if (hasAdvancedPreference === 'true' || hasTemplate || hasInstruction) {
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

    // 如果有具体目标，添加目标设置块
    if (config.goal?.value) {
      addNode('goal_setting', { x: 450, y: 300 })
    }

    // 等待节点创建完成后填充内容和连线
    setTimeout(() => {
      const state = useBuilderStore.getState()
      const nodes = state.nodes
      const { setEdges } = useBuilderStore.getState()

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

      // 自动创建逻辑连线 - 根据用途创建有意义的连接
      const edges: Edge[] = []

      // 找到各种类型的节点
      const nodeMap = new Map()
      nodes.forEach((node) => {
        nodeMap.set(node.data.type, node)
      })

      const wizardRoleNode = nodeMap.get('role_definition')
      if (!wizardRoleNode)
        return

      // 根据用途创建不同的逻辑连线
      if (config.purpose) {
        switch (config.purpose.value) {
          case 'learning':
            // Learning Assistant逻辑: Role → Learning Style → Subject Focus → Difficulty Level
            if (nodeMap.has('learning_style')) {
              edges.push({
                id: `edge-${wizardRoleNode.id}-${nodeMap.get('learning_style').id}`,
                source: wizardRoleNode.id,
                target: nodeMap.get('learning_style').id,
                type: 'default',
              })

              if (nodeMap.has('subject_focus')) {
                edges.push({
                  id: `edge-${nodeMap.get('learning_style').id}-${nodeMap.get('subject_focus').id}`,
                  source: nodeMap.get('learning_style').id,
                  target: nodeMap.get('subject_focus').id,
                  type: 'default',
                })

                if (nodeMap.has('difficulty_level')) {
                  edges.push({
                    id: `edge-${nodeMap.get('subject_focus').id}-${nodeMap.get('difficulty_level').id}`,
                    source: nodeMap.get('subject_focus').id,
                    target: nodeMap.get('difficulty_level').id,
                    type: 'default',
                  })
                }
              }

              // Step-by-step连接到learning_style (教学方法相关)
              if (nodeMap.has('step_by_step')) {
                edges.push({
                  id: `edge-${nodeMap.get('learning_style').id}-${nodeMap.get('step_by_step').id}`,
                  source: nodeMap.get('learning_style').id,
                  target: nodeMap.get('step_by_step').id,
                  type: 'default',
                })
              }
            }
            break

          case 'writing':
            // Writing Assistant逻辑: Role → Communication Style → Output Format → Creative Thinking
            if (nodeMap.has('communication_style')) {
              edges.push({
                id: `edge-${wizardRoleNode.id}-${nodeMap.get('communication_style').id}`,
                source: wizardRoleNode.id,
                target: nodeMap.get('communication_style').id,
                type: 'default',
              })

              if (nodeMap.has('output_format')) {
                edges.push({
                  id: `edge-${nodeMap.get('communication_style').id}-${nodeMap.get('output_format').id}`,
                  source: nodeMap.get('communication_style').id,
                  target: nodeMap.get('output_format').id,
                  type: 'default',
                })

                if (nodeMap.has('creative_thinking')) {
                  edges.push({
                    id: `edge-${nodeMap.get('output_format').id}-${nodeMap.get('creative_thinking').id}`,
                    source: nodeMap.get('output_format').id,
                    target: nodeMap.get('creative_thinking').id,
                    type: 'default',
                  })
                }
              }
            }
            break

          case 'work':
            // Work Assistant逻辑: Role → Context Setting → Output Format, Role → Prioritization
            if (nodeMap.has('context_setting')) {
              edges.push({
                id: `edge-${wizardRoleNode.id}-${nodeMap.get('context_setting').id}`,
                source: wizardRoleNode.id,
                target: nodeMap.get('context_setting').id,
                type: 'default',
              })

              if (nodeMap.has('output_format')) {
                edges.push({
                  id: `edge-${nodeMap.get('context_setting').id}-${nodeMap.get('output_format').id}`,
                  source: nodeMap.get('context_setting').id,
                  target: nodeMap.get('output_format').id,
                  type: 'default',
                })
              }
            }

            if (nodeMap.has('prioritization')) {
              edges.push({
                id: `edge-${wizardRoleNode.id}-${nodeMap.get('prioritization').id}`,
                source: wizardRoleNode.id,
                target: nodeMap.get('prioritization').id,
                type: 'default',
              })
            }
            break

          case 'personal':
            // Personal Assistant逻辑: Role → Communication Style → Personality, Role → Goal Setting
            if (nodeMap.has('communication_style')) {
              edges.push({
                id: `edge-${wizardRoleNode.id}-${nodeMap.get('communication_style').id}`,
                source: wizardRoleNode.id,
                target: nodeMap.get('communication_style').id,
                type: 'default',
              })

              if (nodeMap.has('personality_traits')) {
                edges.push({
                  id: `edge-${nodeMap.get('communication_style').id}-${nodeMap.get('personality_traits').id}`,
                  source: nodeMap.get('communication_style').id,
                  target: nodeMap.get('personality_traits').id,
                  type: 'default',
                })
              }
            }

            if (nodeMap.has('goal_setting')) {
              edges.push({
                id: `edge-${wizardRoleNode.id}-${nodeMap.get('goal_setting').id}`,
                source: wizardRoleNode.id,
                target: nodeMap.get('goal_setting').id,
                type: 'default',
              })
            }
            break
        }
      }

      // 高级逻辑块连接到Role Definition (作为高级功能)
      if (nodeMap.has('conditional_logic')) {
        edges.push({
          id: `edge-${wizardRoleNode.id}-${nodeMap.get('conditional_logic').id}`,
          source: wizardRoleNode.id,
          target: nodeMap.get('conditional_logic').id,
          type: 'default',
        })
      }

      // 应用连线
      setEdges(edges)

      // 确保在连线设置后更新预览
      setTimeout(() => {
        const { updatePreview } = useBuilderStore.getState()
        updatePreview()
      }, 50)
    }, 150)

    // 自动生成标题和描述
    const generateTitleAndDesc = () => {
      let title = ''
      let description = ''

      // 提取样式名称，去掉emoji前缀
      const getStyleName = (label: string) => {
        if (!label)
          return 'Professional'
        // 去掉emoji和"&"后的部分，只保留主要形容词
        return label.replace(/^[^\w\s]+\s*/, '').split(' & ')[0]
      }

      // 提取经验级别描述
      const getExperienceDesc = (label: string) => {
        if (!label)
          return 'all'
        if (label.includes('Beginner'))
          return 'beginner'
        if (label.includes('Experience'))
          return 'intermediate'
        if (label.includes('Experienced'))
          return 'advanced'
        return 'all'
      }

      const styleName = getStyleName(config.tone?.label)
      const experienceLevel = getExperienceDesc(config.expertise?.label)

      switch (config.purpose?.value) {
        case 'learning':
          title = `${styleName} Learning Assistant`
          description = `An AI learning coach that provides ${styleName.toLowerCase()} guidance for ${experienceLevel} learners. Specializes in breaking down complex topics and adapting teaching methods to individual learning styles.`
          break
        case 'writing':
          title = `${styleName} Writing Assistant`
          description = `A creative writing companion that helps with content creation using a ${styleName.toLowerCase()} tone. Perfect for writers of ${experienceLevel} experience levels.`
          break
        case 'work':
          title = `${styleName} Work Assistant`
          description = `A productivity-focused AI that helps organize tasks, prioritize work, and provide ${styleName.toLowerCase()} business guidance for ${experienceLevel} professionals.`
          break
        case 'personal':
          title = `${styleName} Personal Assistant`
          description = `A supportive personal AI companion with a ${styleName.toLowerCase()} personality. Designed to help with daily life, goal setting, and personal development.`
          break
        default:
          title = 'Custom AI Assistant'
          description = 'A versatile AI assistant configured through the simple wizard setup.'
      }

      // 如果用户有具体目标，添加到描述中
      if (config.goal?.value) {
        description += ` Focus: ${config.goal.value}`
      }

      return { title, description }
    }

    const { title, description } = generateTitleAndDesc()

    // 更新builder状态和store
    setBuilderState(prev => ({
      ...prev,
      title,
      description,
    }))

    // 同时更新store中的title和description
    setTitle(title)
    setDescription(description)

    // 切换到高级模式
    setInterfaceMode('advanced')
  }, [setInterfaceMode])

  const handleSwitchToAdvanced = useCallback(() => {
    localStorage.setItem('prohelen-prefer-advanced', 'true')
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
              placeholder="Untitled Instruction"
              value={builderState.title}
              onChange={e => setBuilderState(prev => ({ ...prev, title: e.target.value }))}
              className="bg-transparent text-lg font-medium text-foreground border-none focus:outline-none w-full truncate"
            />
            <input
              type="text"
              placeholder="Add a description..."
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
                Simple Mode
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch to simple mode</p>
              <p className="text-xs text-muted-foreground mt-1">Question-based instruction creation</p>
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
              <p>Get help and shortcuts</p>
              <p className="text-xs text-muted-foreground mt-1">Press F1 or click for help</p>
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
