import type { CustomNodeData } from '@/app/(root)/builder/_components/custom-node'
import type { Connection, Edge, Node, OnEdgesChange, OnNodesChange } from '@xyflow/react'
import i18n from '@/lib/i18n'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { create } from 'zustand'

interface HistoryState {
  nodes: Node<CustomNodeData>[]
  edges: Edge[]
}

interface BuilderState {
  nodes: Node<CustomNodeData>[]
  edges: Edge[]
  title: string
  description: string
  content: string
  tags: string[]
  isTemplate: boolean
  sourceId: string | null
  originalUserQuery: string
  selectedNode: string | null
  showRecommendations: boolean
  preview: {
    system: string
    human: string
    assistant: string
  }
  history: HistoryState[]
  historyIndex: number
}

interface ExtractedBlock {
  type: string
  content: string
  confidence: number
  reasoning: string
}

interface SuggestedEnhancement {
  type: string
  reason: string
  impact: 'high' | 'medium' | 'low'
}

interface BuilderActions {
  setNodes: (nodes: Node<CustomNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (type: string, position?: { x: number, y: number }) => void
  addNodeWithContent: (type: string, content?: string, position?: { x: number, y: number }, skipHistorySave?: boolean) => void
  deleteNode: (nodeId: string) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: (connection: Connection) => void
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setContent: (content: string) => void
  setTags: (tags: string[]) => void
  setIsTemplate: (isTemplate: boolean) => void
  setSourceId: (sourceId: string | null) => void
  setOriginalUserQuery: (query: string) => void
  setSelectedNode: (nodeType: string | null) => void
  setShowRecommendations: (show: boolean) => void
  updatePreview: () => void
  setPreview: (preview: { system: string, human: string, assistant: string }) => void
  exportFlowData: () => { nodes: Node<CustomNodeData>[], edges: Edge[] }
  importFlowData: (flowData: { nodes: Node<CustomNodeData>[], edges: Edge[] }) => void
  resetFlow: () => void
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  applyAnalysisResults: (blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => void
  createEnhancementBlocks: (enhancements: SuggestedEnhancement[]) => void
  addQuickStartTemplate: (templateId: string) => void
  saveDraft: () => Promise<void>
  hasPendingChanges: () => boolean
}

// block priority based on 5-category system (lower number = higher priority)
const BLOCK_PRIORITY: Record<string, number> = {
  // 1. Role & Context (Foundation - Highest Priority)
  role_definition: 1,
  context_setting: 2,
  personality_traits: 3,
  subject_focus: 4,

  // 2. Interaction Style (Communication Layer)
  communication_style: 5,
  learning_style: 6,
  feedback_style: 7,

  // 3. Task Control (Execution Framework)
  goal_setting: 8,
  output_format: 9,
  difficulty_level: 10,
  time_management: 11,
  prioritization: 12,

  // 4. Thinking & Logic (Processing Methods)
  step_by_step: 13,
  creative_thinking: 14,
  conditional_logic: 15,
  error_handling: 16,

  // 5. Skills & Development (Specialized Functions)
  skill_assessment: 17,
  career_planning: 18,
}

// connection rules following logical flow: Role & Context → Interaction → Task Control → Thinking → Skills
const CONNECTION_RULES: Record<string, string[]> = {
  // 1. Role & Context → Interaction Style
  role_definition: ['context_setting', 'communication_style', 'personality_traits'],
  context_setting: ['subject_focus', 'goal_setting', 'communication_style'],
  personality_traits: ['communication_style', 'feedback_style', 'creative_thinking'],
  subject_focus: ['learning_style', 'difficulty_level', 'goal_setting'],

  // 2. Interaction Style → Task Control
  communication_style: ['output_format', 'feedback_style', 'goal_setting'],
  learning_style: ['difficulty_level', 'step_by_step', 'goal_setting'],
  feedback_style: ['output_format', 'error_handling'],

  // 3. Task Control → Thinking & Logic
  goal_setting: ['output_format', 'prioritization', 'step_by_step'],
  output_format: ['step_by_step', 'creative_thinking'],
  difficulty_level: ['step_by_step', 'conditional_logic'],
  time_management: ['prioritization', 'step_by_step'],
  prioritization: ['conditional_logic', 'time_management'],

  // 4. Thinking & Logic → Advanced Processing
  step_by_step: ['error_handling', 'conditional_logic'],
  creative_thinking: ['conditional_logic', 'error_handling'],
  conditional_logic: ['error_handling'],
  error_handling: [], // Terminal node

  // 5. Skills & Development (Can connect across categories)
  skill_assessment: ['career_planning', 'difficulty_level', 'goal_setting'],
  career_planning: ['goal_setting', 'prioritization'],
}

// quick start content
const QUICK_START_CONTENT: Record<string, Record<string, string>> = {
  tutor: {
    role_definition: `You are an expert AI tutor and learning coach with 10+ years of educational experience. Your specializations include:
- Transforming complex concepts into clear, digestible explanations using analogies and examples
- Designing personalized learning paths based on individual cognitive styles and pace
- Creating engaging, interactive learning experiences that promote active participation
- Building learner confidence through positive reinforcement and scaffolded challenges
- Adapting instructional methods across diverse subjects and skill levels`,
    context_setting: `Educational context and learning environment:
- Focus on creating a supportive and encouraging learning atmosphere
- Consider the user's current knowledge level and learning objectives
- Adapt to various educational settings (academic, professional, personal growth)
- Build upon prior knowledge while introducing new concepts gradually`,
    learning_style: `Adapt your teaching approach to be interactive and engaging:
- Use examples, analogies, and real-world applications
- Encourage questions and provide step-by-step explanations
- Offer multiple ways to understand the same concept
- Provide immediate feedback and positive reinforcement
- Adjust difficulty based on user progress and understanding`,
    goal_setting: `Learning objectives and measurable outcomes:
- Establish SMART learning goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Create progressive milestones that build confidence and maintain motivation
- Design assessment checkpoints to track comprehension and skill development
- Connect learning activities to real-world applications and learner interests
- Foster learner autonomy by encouraging self-directed goal setting and reflection`,
    step_by_step: `Provide systematic learning guidance:
- Break complex topics into digestible, sequential steps
- Ensure each step builds upon previous knowledge
- Provide clear instructions and examples for each stage
- Check for understanding before moving to the next step
- Offer additional practice and reinforcement when needed`,
  },
  business_consultant: {
    role_definition: `You are a strategic business consultant with expertise in:
- Business strategy and planning
- Market analysis and competitive intelligence
- Operational efficiency and process optimization
- Financial planning and risk assessment
- Leadership development and organizational change`,
    context_setting: `Business consulting context and environment:
- Understand the client's industry, market position, and competitive landscape
- Consider current business challenges, opportunities, and constraints
- Assess organizational culture, resources, and capabilities
- Factor in regulatory environment and market trends
- Align recommendations with business objectives and stakeholder interests`,
    communication_style: `Maintain a professional and analytical communication style:
- Be direct, clear, and results-oriented
- Use data-driven insights and evidence-based recommendations
- Present information in structured, logical formats
- Ask probing questions to understand business context
- Focus on actionable solutions and measurable outcomes`,
    output_format: `Structure all business recommendations as follows:
## Executive Summary
Brief overview of key findings and recommendations

## Analysis
Detailed assessment of the situation, including:
- Current state evaluation
- Key challenges and opportunities
- Market/competitive factors

## Recommendations
1. Priority actions with specific steps
2. Timeline and resource requirements
3. Expected outcomes and success metrics
4. Risk mitigation strategies`,
    prioritization: `Strategic prioritization framework:
- Assess impact vs. effort for all recommended actions
- Consider short-term wins alongside long-term strategic goals
- Identify critical path dependencies and resource constraints
- Balance risk tolerance with potential returns
- Establish clear decision criteria and success metrics for prioritization`,
  },
  creative_assistant: {
    role_definition: `You are a creative AI assistant specializing in:
- Brainstorming and idea generation
- Creative problem-solving and innovation
- Artistic and design thinking processes
- Writing and content creation
- Inspiring and nurturing creativity in others`,
    personality_traits: `Embody an inspiring and enthusiastic personality:
- Be energetic, optimistic, and encouraging
- Show genuine excitement about creative possibilities
- Embrace experimentation and celebrate "beautiful failures"
- Use vivid language and engaging storytelling
- Balance imagination with practical application`,
    creative_thinking: `Foster creativity through innovative approaches:
- Encourage out-of-the-box thinking and unconventional solutions
- Use techniques like mind mapping, word association, and scenario building
- Combine seemingly unrelated concepts to generate fresh ideas
- Challenge assumptions and explore alternative perspectives
- Provide inspiration from diverse fields and disciplines`,
    output_format: `Present creative ideas in engaging formats:
## Creative Concept
Brief, compelling overview of the main idea

## Inspiration & Context
- Sources of inspiration and creative influences
- Relevant trends, themes, or artistic movements
- Connection to user's creative goals

## Development & Execution
- Detailed exploration of the concept
- Multiple variations and creative directions
- Practical steps for implementation
- Resources and tools needed`,
    feedback_style: `Provide constructive creative feedback:
- Focus on strengths and creative potential first
- Offer specific, actionable suggestions for improvement
- Encourage experimentation and iteration
- Balance critique with encouragement and inspiration
- Help refine ideas while maintaining creative vision`,
  },
  step_by_step_guide: {
    role_definition: `You are a systematic guide specializing in:
- Breaking down complex tasks into manageable steps
- Creating clear, actionable instructions
- Helping users navigate multi-step processes
- Ensuring nothing important is missed
- Building confidence through structured approaches`,
    context_setting: `Process guidance context and environment:
- Understand the user's experience level and familiarity with the task
- Consider available resources, tools, and time constraints
- Assess potential obstacles and preparation requirements
- Factor in safety considerations and best practices
- Align the process with the user's specific goals and circumstances`,
    step_by_step: `Always provide instructions in clear, sequential steps:

**Step 1: [Action]**
- Detailed explanation of what to do
- Why this step is important
- What to expect as a result

**Step 2: [Next Action]**
- Clear instructions for the next phase
- Any prerequisite requirements
- Common mistakes to avoid

**Continue this pattern for all steps...**`,
    output_format: `Structure all step-by-step guides as follows:
## Overview
Brief summary of the process and expected outcomes

## Prerequisites
- Required materials, tools, or knowledge
- Preparation steps needed
- Estimated time required

## Step-by-Step Instructions
Numbered steps with detailed explanations

## Troubleshooting
Common issues and their solutions

## Next Steps
What to do after completion`,
    error_handling: `Anticipate and address potential issues:
- Identify common mistakes and how to avoid them
- Provide troubleshooting guidance for when things go wrong
- Offer alternative approaches if the primary method fails
- Include safety checks and quality verification steps
- Encourage users to ask questions when uncertain`,
  },
}

// Chinese version of quick start content
const QUICK_START_CONTENT_ZH: Record<string, Record<string, string>> = {
  tutor: {
    role_definition: `你是一位拥有10年以上教育经验的专业AI导师和学习教练。你的专业领域包括：
- 运用类比和实例将复杂概念转化为清晰易懂的解释
- 基于个人认知风格和学习节奏设计个性化学习路径
- 创造引人入胜的互动学习体验，促进主动参与
- 通过正面强化和渐进式挑战建立学习者信心
- 适应不同学科和技能水平的教学方法`,
    context_setting: `教育背景和学习环境：
- 专注于创造支持性和鼓励性的学习氛围
- 考虑用户当前的知识水平和学习目标
- 适应各种教育环境（学术、职业、个人成长）
- 在引入新概念的同时建立在已有知识基础上`,
    learning_style: `采用互动性和吸引力的教学方法：
- 使用实例、类比和现实应用
- 鼓励提问并提供逐步解释
- 提供理解同一概念的多种方式
- 提供即时反馈和正面强化
- 根据用户进步和理解调整难度`,
    goal_setting: `学习目标和可衡量的成果：
- 建立SMART学习目标（具体、可衡量、可实现、相关、有时限）
- 创建渐进式里程碑，建立信心并保持动力
- 设计评估检查点来跟踪理解和技能发展
- 将学习活动与现实应用和学习者兴趣联系起来
- 通过鼓励自主目标设定和反思培养学习者自主性`,
    step_by_step: `提供系统性学习指导：
- 将复杂主题分解为易消化的顺序步骤
- 确保每个步骤都建立在先前知识基础上
- 为每个阶段提供清晰的说明和示例
- 在进入下一步之前检查理解情况
- 在需要时提供额外的练习和强化`,
  },
  business_consultant: {
    role_definition: `你是一位战略商业顾问，在以下领域具有专业知识：
- 商业战略和规划
- 市场分析和竞争情报
- 运营效率和流程优化
- 财务规划和风险评估
- 领导力发展和组织变革`,
    context_setting: `商业咨询背景和环境：
- 了解客户的行业、市场地位和竞争格局
- 考虑当前的商业挑战、机遇和约束
- 评估组织文化、资源和能力
- 考虑监管环境和市场趋势
- 将建议与商业目标和利益相关者利益保持一致`,
    communication_style: `保持专业和分析性的沟通风格：
- 直接、清晰且以结果为导向
- 使用数据驱动的洞察和基于证据的建议
- 以结构化、逻辑性的格式呈现信息
- 提出探索性问题以了解商业背景
- 专注于可行的解决方案和可衡量的结果`,
    output_format: `按以下格式构建所有商业建议：
## 执行摘要
关键发现和建议的简要概述

## 分析
情况的详细评估，包括：
- 当前状态评估
- 关键挑战和机遇
- 市场/竞争因素

## 建议
1. 优先行动和具体步骤
2. 时间表和资源要求
3. 预期结果和成功指标
4. 风险缓解策略`,
    prioritization: `战略优先级框架：
- 评估所有推荐行动的影响与努力比
- 在短期收益与长期战略目标之间取得平衡
- 识别关键路径依赖性和资源约束
- 平衡风险承受能力与潜在回报
- 建立明确的决策标准和优先级成功指标`,
  },
  creative_assistant: {
    role_definition: `你是一位专业的创意AI助手，专长领域包括：
- 头脑风暴和创意生成
- 创造性问题解决和创新
- 艺术和设计思维过程
- 写作和内容创作
- 激发和培养他人的创造力`,
    personality_traits: `体现鼓舞人心和热情的个性：
- 充满活力、乐观和鼓励
- 对创意可能性表现出真正的兴奋
- 拥抱实验并庆祝"美丽的失败"
- 使用生动的语言和引人入胜的叙述
- 在想象力与实际应用之间取得平衡`,
    creative_thinking: `通过创新方法培养创造力：
- 鼓励跳出框框的思维和非常规解决方案
- 使用思维导图、词汇联想和情景构建等技巧
- 结合看似无关的概念产生新鲜想法
- 挑战假设并探索替代观点
- 从不同领域和学科提供灵感`,
    output_format: `以引人入胜的格式呈现创意想法：
## 创意概念
主要想法的简洁、吸引人概述

## 灵感与背景
- 灵感来源和创意影响
- 相关趋势、主题或艺术运动
- 与用户创意目标的联系

## 发展与执行
- 概念的详细探索
- 多种变化和创意方向
- 实施的实际步骤
- 所需资源和工具`,
    feedback_style: `提供建设性的创意反馈：
- 首先关注优势和创意潜力
- 提供具体的、可行的改进建议
- 鼓励实验和迭代
- 在批评与鼓励和灵感之间取得平衡
- 帮助完善想法同时保持创意愿景`,
  },
  step_by_step_guide: {
    role_definition: `你是一位系统化指导专家，专长于：
- 将复杂任务分解为可管理的步骤
- 创建清晰、可行的指导说明
- 帮助用户导航多步骤过程
- 确保不遗漏重要环节
- 通过结构化方法建立信心`,
    context_setting: `过程指导背景和环境：
- 了解用户的经验水平和对任务的熟悉程度
- 考虑可用资源、工具和时间约束
- 评估潜在障碍和准备要求
- 考虑安全考虑和最佳实践
- 使过程与用户的具体目标和情况保持一致`,
    step_by_step: `始终以清晰的顺序步骤提供指导：

**步骤1：[行动]**
- 详细解释要做什么
- 为什么这一步很重要
- 预期的结果

**步骤2：[下一个行动]**
- 下一阶段的清晰指导
- 任何先决条件要求
- 避免常见错误

**继续这种模式处理所有步骤...**`,
    output_format: `按以下格式构建所有分步指南：
## 概述
过程和预期结果的简要总结

## 先决条件
- 所需材料、工具或知识
- 需要的准备步骤
- 估计所需时间

## 分步说明
带有详细解释的编号步骤

## 故障排除
常见问题及其解决方案

## 下一步
完成后要做的事情`,
    error_handling: `预期并解决潜在问题：
- 识别常见错误以及如何避免它们
- 为出现问题时提供故障排除指导
- 如果主要方法失败，提供替代方法
- 包括安全检查和质量验证步骤
- 鼓励用户在不确定时提问`,
  },
}

// auto connect algorithm
function autoConnect(nodes: Node<CustomNodeData>[]): Edge[] {
  if (nodes.length === 0)
    return []

  // sort nodes by priority
  const sortedNodes = [...nodes].sort((a, b) => {
    const priorityA = BLOCK_PRIORITY[a.data.type] || 999
    const priorityB = BLOCK_PRIORITY[b.data.type] || 999
    return priorityA - priorityB
  })

  const edges: Edge[] = []
  const nodeTypes = nodes.map(n => n.data.type)

  // find suitable connection targets for each node
  sortedNodes.forEach((sourceNode, index) => {
    const sourceType = sourceNode.data.type
    const possibleTargets = CONNECTION_RULES[sourceType] || []

    // find actual existing nodes in possible targets
    const availableTargets = possibleTargets.filter(targetType =>
      nodeTypes.includes(targetType),
    ).map(targetType =>
      nodes.find(n => n.data.type === targetType)!,
    )

    // connect to the highest priority available target
    if (availableTargets.length > 0) {
      availableTargets.sort((a, b) => {
        const priorityA = BLOCK_PRIORITY[a.data.type] || 999
        const priorityB = BLOCK_PRIORITY[b.data.type] || 999
        return priorityA - priorityB
      })

      // connect to the first (highest priority) target
      const targetNode = availableTargets[0]

      // check if connection already exists
      const existingConnection = edges.find(edge =>
        edge.source === sourceNode.id && edge.target === targetNode.id,
      )

      if (!existingConnection) {
        edges.push({
          id: `auto-${sourceNode.id}-${targetNode.id}`,
          source: sourceNode.id,
          target: targetNode.id,
        })
      }
    }

    // if no predefined rules, connect to the next higher priority node
    if (availableTargets.length === 0 && index < sortedNodes.length - 1) {
      const nextNode = sortedNodes[index + 1]
      const existingConnection = edges.find(edge =>
        edge.source === sourceNode.id && edge.target === nextNode.id,
      )

      if (!existingConnection) {
        edges.push({
          id: `auto-${sourceNode.id}-${nextNode.id}`,
          source: sourceNode.id,
          target: nextNode.id,
        })
      }
    }
  })

  // ensure no isolated nodes (except the last one)
  const connectedSources = new Set(edges.map(e => e.source))
  const connectedTargets = new Set(edges.map(e => e.target))

  sortedNodes.forEach((node, index) => {
    const isConnected = connectedSources.has(node.id) || connectedTargets.has(node.id)
    const isLastNode = index === sortedNodes.length - 1

    if (!isConnected && !isLastNode && index < sortedNodes.length - 1) {
      const nextNode = sortedNodes[index + 1]
      edges.push({
        id: `auto-fallback-${node.id}-${nextNode.id}`,
        source: node.id,
        target: nextNode.id,
      })
    }
  })

  return edges
}

export const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  title: '',
  description: '',
  content: '',
  tags: [],
  isTemplate: false,
  sourceId: null,
  originalUserQuery: '',
  selectedNode: null,
  showRecommendations: false,
  preview: {
    system: '',
    human: '',
    assistant: '',
  },
  history: [],
  historyIndex: -1,

  // Actions
  setNodes: nodes => set({ nodes }),
  setEdges: edges => set({ edges }),

  addNode: (type, position) => {
    get().saveToHistory()

    const nodes = get().nodes

    const nodePosition = position || (() => {
      const nodeSpacing = 350
      const startX = 200
      const baseY = 200

      const newX = startX + (nodes.length * nodeSpacing)

      return {
        x: newX,
        y: baseY,
      }
    })()

    // special label mapping
    const labelMap: Record<string, string> = {
      step_by_step: 'Step by Step',
      role_definition: 'Role Definition',
      context_setting: 'Context Setting',
      output_format: 'Output Format',
      goal_setting: 'Goal Setting',
      learning_style: 'Learning Style',
      subject_focus: 'Subject Focus',
      difficulty_level: 'Difficulty Level',
      communication_style: 'Communication Style',
      creative_thinking: 'Creative Thinking',
      conditional_logic: 'Conditional Logic',
      personality_traits: 'Personality Traits',
      error_handling: 'Error Handling',
    }

    const label = labelMap[type] || type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    const newNode: Node<CustomNodeData> = {
      id: `${type}-${nodes.length + 1}`,
      type: 'custom',
      position: nodePosition,
      data: {
        label,
        type,
      },
    }

    const newNodes = [...nodes, newNode]

    const autoEdges = autoConnect(newNodes)

    set({
      nodes: newNodes,
      edges: autoEdges,
    })
    get().updatePreview()
  },

  addNodeWithContent: (type, content, position, skipHistorySave) => {
    if (!skipHistorySave) {
      get().saveToHistory()
    }

    const nodes = get().nodes

    const nodePosition = position || (() => {
      const nodeSpacing = 350
      const startX = 200
      const baseY = 200

      const newX = startX + (nodes.length * nodeSpacing)

      return {
        x: newX,
        y: baseY,
      }
    })()

    // special label mapping
    const labelMap: Record<string, string> = {
      step_by_step: 'Step by Step',
      role_definition: 'Role Definition',
      context_setting: 'Context Setting',
      output_format: 'Output Format',
      goal_setting: 'Goal Setting',
      learning_style: 'Learning Style',
      subject_focus: 'Subject Focus',
      difficulty_level: 'Difficulty Level',
      communication_style: 'Communication Style',
      creative_thinking: 'Creative Thinking',
      conditional_logic: 'Conditional Logic',
      personality_traits: 'Personality Traits',
      error_handling: 'Error Handling',
    }

    const label = labelMap[type] || type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

    const newNode: Node<CustomNodeData> = {
      id: `${type}-${nodes.length + 1}`,
      type: 'custom',
      position: nodePosition,
      data: {
        label,
        type,
        content,
      },
    }

    const newNodes = [...nodes, newNode]

    const autoEdges = autoConnect(newNodes)

    set({
      nodes: newNodes,
      edges: autoEdges,
    })
    get().updatePreview()
  },

  deleteNode: (nodeId) => {
    get().saveToHistory()

    const state = get()

    const newNodes = state.nodes.filter(node => node.id !== nodeId)

    const autoEdges = autoConnect(newNodes)

    set({
      nodes: newNodes,
      edges: autoEdges,
    })
    get().updatePreview()
  },

  onNodesChange: (changes) => {
    // Save to history for non-selection changes
    const hasNonSelectionChanges = changes.some(change => change.type !== 'select')
    if (hasNonSelectionChanges) {
      get().saveToHistory()
    }

    const prevState = get()
    const newNodes = applyNodeChanges(changes, prevState.nodes) as Node<CustomNodeData>[]

    set({ nodes: newNodes })

    // only update preview if node content has changed
    const hasContentChange = changes.some(change =>
      change.type === 'add'
      || change.type === 'remove'
      || (change.type === 'replace'
        && ((change as any).item?.data?.content !== (prevState.nodes.find(n => n.id === change.id)?.data?.content))),
    )

    if (hasContentChange) {
      get().updatePreview()
    }
  },

  onEdgesChange: (changes) => {
    // filter out remove operations, because connection lines are automatically generated, and users cannot reconnect after deletion
    const filteredChanges = changes.filter(change => change.type !== 'remove')

    // Save to history for non-selection changes
    const hasNonSelectionChanges = filteredChanges.some(change => change.type !== 'select')
    if (hasNonSelectionChanges) {
      get().saveToHistory()
    }

    set(state => ({
      edges: applyEdgeChanges(filteredChanges, state.edges),
    }))

    if (hasNonSelectionChanges) {
      get().updatePreview()
    }
  },

  onConnect: (connection) => {
    const state = get()

    const isDuplicateConnection = state.edges.some(edge =>
      edge.source === connection.source && edge.target === connection.target,
    )

    if (isDuplicateConnection) {
      console.warn('Duplicate connection attempted - connection already exists')
      return
    }

    if (connection.source === connection.target) {
      console.warn('Self-connection attempted - nodes cannot connect to themselves')
      return
    }

    get().saveToHistory()

    set(state => ({
      edges: [...state.edges, { ...connection, id: `edge-${state.edges.length + 1}` }],
    }))
    get().updatePreview()
  },

  updateNodeData: (nodeId, data) => {
    get().saveToHistory()

    set(state => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...data },
          }
        }
        return node
      }),
    }))
    get().updatePreview()
  },

  setTitle: title => set({ title }),
  setDescription: description => set({ description }),
  setContent: content => set({ content }),
  setTags: tags => set({ tags }),
  setIsTemplate: isTemplate => set({ isTemplate }),
  setSourceId: sourceId => set({ sourceId }),
  setOriginalUserQuery: query => set({ originalUserQuery: query }),
  setSelectedNode: nodeType => set({ selectedNode: nodeType }),
  setShowRecommendations: show => set({ showRecommendations: show }),

  updatePreview: () => {
    const state = get()
    const { nodes, edges, originalUserQuery } = state

    // Detect content language from user's original query for prompt content
    const detectLanguageFromContent = (text: string): string => {
      if (!text)
        return 'en'
      // Simple Chinese character detection
      const chineseRegex = /[\u4E00-\u9FFF]/
      return chineseRegex.test(text) ? 'zh' : 'en'
    }

    // Use interface language for UI text (headers, placeholders)
    const interfaceLanguage = i18n.language?.startsWith('zh') ? 'zh' : 'en'

    // Use content language for prompt structure and flow when content is from user input
    const contentLanguage = originalUserQuery
      ? detectLanguageFromContent(originalUserQuery)
      : interfaceLanguage

    // Language-specific headers - use interface language for UI text
    const headers = interfaceLanguage === 'zh'
      ? {
          coreDefinition: '## 核心定义',
          contextHeader: '\n## 上下文',
          behaviorGuidelines: '\n## 行为准则',
          processInstructions: '\n## 过程指导',
          constraintsRules: '\n## 约束与规则',
          outputFormat: '\n## 输出格式',
          workflow: '\n\n## 工作流程',
          logicalFlow: '逻辑流程：',
          logicalFlows: '逻辑流程：\n',
          noInstructions: '尚未定义系统指令。添加块来构建您的提示词。',
          role: '角色：',
          contextLabel: '上下文：',
          goals: '目标：',
          learningStyle: '学习风格：',
          subjectFocus: '主题焦点：',
          difficultyLevel: '难度级别：',
          communicationStyle: '沟通风格：',
          feedbackApproach: '反馈方式：',
          personality: '个性：',
          stepByStep: '分步指导：',
          timeManagement: '时间管理：',
          prioritization: '优先级排序：',
          conditionalLogic: '条件逻辑：',
          creativeApproach: '创意方法：',
          errorHandling: '错误处理：',
          careerPlanning: '职业规划：',
          skillAssessment: '技能评估：',
        }
      : {
          coreDefinition: '## Core Definition',
          contextHeader: '\n## Context',
          behaviorGuidelines: '\n## Behavior Guidelines',
          processInstructions: '\n## Process Instructions',
          constraintsRules: '\n## Constraints & Rules',
          outputFormat: '\n## Output Format',
          workflow: '\n\n## Workflow',
          logicalFlow: 'Logical flow: ',
          logicalFlows: 'Logical flows:\n',
          noInstructions: 'No system instructions defined yet. Add blocks to build your prompt.',
          role: 'Role: ',
          contextLabel: 'Context: ',
          goals: 'Goals: ',
          learningStyle: 'Learning Style: ',
          subjectFocus: 'Subject Focus: ',
          difficultyLevel: 'Difficulty Level: ',
          communicationStyle: 'Communication Style: ',
          feedbackApproach: 'Feedback Approach: ',
          personality: 'Personality: ',
          stepByStep: 'Step by Step: ',
          timeManagement: 'Time Management: ',
          prioritization: 'Prioritization: ',
          conditionalLogic: 'Conditional Logic: ',
          creativeApproach: 'Creative Approach: ',
          errorHandling: 'Error Handling: ',
          careerPlanning: 'Career Planning: ',
          skillAssessment: 'Skill Assessment: ',
        }

    const _nodeMap = new Map(nodes.map(node => [node.id, node]))
    const edgeMap = new Map()

    edges.forEach((edge) => {
      if (!edgeMap.has(edge.source)) {
        edgeMap.set(edge.source, [])
      }
      edgeMap.get(edge.source).push(edge.target)
    })

    const _startNodes = nodes.filter(node =>
      !edges.some(edge => edge.target === node.id),
    )

    const contentByType = {
      system: [] as string[],
      context: [] as string[],
      behavior: [] as string[],
      format: [] as string[],
      process: [] as string[],
      constraints: [] as string[],
    }

    nodes.forEach((node) => {
      if (!node.data.content)
        return

      const content = node.data.content.trim()
      if (!content)
        return

      switch (node.data.type) {
        // Core system instructions
        case 'role_definition':
          contentByType.system.push(`${headers.role}${content}`)
          break
        case 'context_setting':
          contentByType.context.push(`${headers.contextLabel}${content}`)
          break
        case 'output_format':
          contentByType.format.push(`${headers.outputFormat.replace('\n## ', '')}${content}`)
          break

        // Educational and behavioral instructions
        case 'goal_setting':
          contentByType.system.push(`${headers.goals}${content}`)
          break
        case 'learning_style':
          contentByType.process.push(`${headers.learningStyle}${content}`)
          break
        case 'subject_focus':
          contentByType.context.push(`${headers.subjectFocus}${content}`)
          break
        case 'difficulty_level':
          contentByType.process.push(`${headers.difficultyLevel}${content}`)
          break

        // Communication and feedback style
        case 'communication_style':
          contentByType.behavior.push(`${headers.communicationStyle}${content}`)
          break
        case 'feedback_style':
          contentByType.behavior.push(`${headers.feedbackApproach}${content}`)
          break
        case 'personality_traits':
          contentByType.behavior.push(`${headers.personality}${content}`)
          break

        // Workflow and process instructions
        case 'step_by_step':
          contentByType.process.push(`${headers.stepByStep}${content}`)
          break
        case 'time_management':
          contentByType.process.push(`${headers.timeManagement}${content}`)
          break
        case 'prioritization':
          contentByType.process.push(`${headers.prioritization}${content}`)
          break

        // Advanced features
        case 'conditional_logic':
          contentByType.constraints.push(`${headers.conditionalLogic}${content}`)
          break
        case 'creative_thinking':
          contentByType.behavior.push(`${headers.creativeApproach}${content}`)
          break
        case 'error_handling':
          contentByType.constraints.push(`${headers.errorHandling}${content}`)
          break

        // Planning instructions
        case 'career_planning':
          contentByType.context.push(`${headers.careerPlanning}${content}`)
          break
        case 'skill_assessment':
          contentByType.process.push(`${headers.skillAssessment}${content}`)
          break

        default:
          contentByType.system.push(content)
      }
    })

    let systemPrompt = ''
    let humanPrompt = ''
    let assistantPrompt = ''

    // System prompt construction
    const systemSections = []

    if (contentByType.system.length > 0) {
      systemSections.push(`${headers.coreDefinition}\n${contentByType.system.join('\n')}`)
    }

    if (contentByType.context.length > 0) {
      systemSections.push(`${headers.contextHeader}\n${contentByType.context.join('\n')}`)
    }

    if (contentByType.behavior.length > 0) {
      systemSections.push(`${headers.behaviorGuidelines}\n${contentByType.behavior.join('\n')}`)
    }

    if (contentByType.process.length > 0) {
      systemSections.push(`${headers.processInstructions}\n${contentByType.process.join('\n')}`)
    }

    if (contentByType.constraints.length > 0) {
      systemSections.push(`${headers.constraintsRules}\n${contentByType.constraints.join('\n')}`)
    }

    if (contentByType.format.length > 0) {
      systemSections.push(`${headers.outputFormat}\n${contentByType.format.join('\n')}`)
    }

    systemPrompt = systemSections.join('\n').trim()

    // if there are edges, build the flow description
    if (edges.length > 0) {
      const getFlowDescription = () => {
        // find the start node (usually role_definition)
        const startNodes = nodes.filter(node =>
          !edges.some(edge => edge.target === node.id),
        )

        if (startNodes.length === 0)
          return ''

        const startNode = startNodes[0]
        const visited = new Set<string>()
        const paths: string[] = []

        // recursively build all paths
        const buildPaths = (nodeId: string, currentPath: string[] = []) => {
          if (visited.has(nodeId))
            return

          const node = nodes.find(n => n.id === nodeId)
          if (!node)
            return

          const newPath = [...currentPath, node.data.label]

          const outgoingEdges = edges.filter(edge => edge.source === nodeId)

          if (outgoingEdges.length === 0) {
            if (newPath.length > 1) {
              paths.push(newPath.join(' → '))
            }
          }
          else if (outgoingEdges.length === 1) {
            visited.add(nodeId)
            buildPaths(outgoingEdges[0].target, newPath)
          }
          else {
            visited.add(nodeId)
            outgoingEdges.forEach((edge) => {
              buildPaths(edge.target, newPath)
            })
          }
        }

        buildPaths(startNode.id)

        if (paths.length === 1) {
          return `${headers.logicalFlow}${paths[0]}`
        }
        else if (paths.length > 1) {
          return `${headers.logicalFlows}${paths.map(path => `• ${path}`).join('\n')}`
        }

        return ''
      }

      const flowDescription = getFlowDescription()
      if (flowDescription) {
        systemPrompt += `${headers.workflow}\n${flowDescription}`
      }
    }

    // Human prompt - mainly contains user interaction guidelines
    const userGuidelines = []
    if (contentByType.context.some(c => c.includes('user') || c.includes('User') || c.includes('用户'))) {
      userGuidelines.push(contentLanguage === 'zh'
        ? '请根据上述定义的上下文和准则进行交互。'
        : 'Please interact according to the defined context and guidelines above.')
    }
    humanPrompt = userGuidelines.join('\n')

    // Assistant prompt - response format and behavior reminders
    const responseGuidelines = []
    if (contentByType.format.length > 0) {
      responseGuidelines.push(contentLanguage === 'zh'
        ? '记住在回复中遵循指定的输出格式。'
        : 'Remember to follow the specified output format in your responses.')
    }
    if (contentByType.behavior.length > 0) {
      responseGuidelines.push(contentLanguage === 'zh'
        ? '在整个对话过程中保持指定的沟通风格和个性。'
        : 'Maintain the specified communication style and personality throughout the conversation.')
    }
    assistantPrompt = responseGuidelines.join('\n')

    set({
      preview: {
        system: systemPrompt || headers.noInstructions,
        human: humanPrompt || '',
        assistant: assistantPrompt || '',
      },
    })
  },

  setPreview: preview => set({ preview }),

  exportFlowData: () => {
    const { nodes, edges } = get()
    return { nodes, edges }
  },

  importFlowData: (flowData) => {
    const { nodes, edges } = flowData

    const adjustedNodes = nodes.map((node: Node<CustomNodeData>, index: number) => {
      const nodeSpacing = 350
      const startX = 200
      const baseY = 300

      return {
        ...node,
        position: {
          x: startX + index * nodeSpacing,
          y: baseY,
        },
      }
    })

    set({
      nodes: adjustedNodes,
      edges,
      originalUserQuery: '',
    })
    get().updatePreview()
  },

  resetFlow: () => {
    set({
      nodes: [],
      edges: [],
      title: '',
      description: '',
      content: '',
      tags: [],
      isTemplate: false,
      sourceId: null,
      originalUserQuery: '',
      selectedNode: null,
      showRecommendations: false,
      history: [],
      historyIndex: -1,
    })
    get().updatePreview()
  },

  // History management
  saveToHistory: () => {
    const { nodes, edges, history, historyIndex } = get()
    const currentState: HistoryState = { nodes, edges }

    // Remove any history after current index (when we make a new change after undoing)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(currentState)

    // Limit history to last 50 states
    const maxHistorySize = 50
    if (newHistory.length > maxHistorySize) {
      newHistory.shift()
    }
    else {
      set({ historyIndex: historyIndex + 1 })
    }

    set({ history: newHistory })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1]
      set({
        nodes: previousState.nodes,
        edges: previousState.edges,
        historyIndex: historyIndex - 1,
      })
      get().updatePreview()
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: historyIndex + 1,
      })
      get().updatePreview()
    }
  },

  canUndo: () => {
    const { historyIndex } = get()
    return historyIndex > 0
  },

  canRedo: () => {
    const { history, historyIndex } = get()
    return historyIndex < history.length - 1
  },

  applyAnalysisResults: (blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => {
    const { addNode, updateNodeData } = get()

    if (userQuery) {
      set({ originalUserQuery: userQuery })
    }

    get().saveToHistory()

    blocks.forEach((block, index) => {
      const nodeSpacing = 350
      const startX = 200
      const baseY = 200

      const position = {
        x: startX + index * nodeSpacing,
        y: baseY,
      }

      addNode(block.type, position)

      setTimeout(() => {
        const currentNodes = get().nodes
        const newNode = currentNodes.find(n =>
          n.data.type === block.type
          && !n.data.content,
        )
        if (newNode) {
          updateNodeData(newNode.id, { content: block.content })
        }
      }, index * 50)
    })

    if (enhancements.length > 0) {
      get().createEnhancementBlocks(enhancements)
    }

    setTimeout(() => {
      get().updatePreview()
    }, blocks.length * 50 + 100)
  },

  createEnhancementBlocks: (enhancements: SuggestedEnhancement[]) => {
    const { addNode } = get()

    const existingNodes = get().nodes
    const nodeSpacing = 350
    const startX = 200 + (existingNodes.length * nodeSpacing)
    const baseY = 200

    enhancements.forEach((enhancement, index) => {
      const position = {
        x: startX + index * nodeSpacing,
        y: baseY,
      }

      addNode(enhancement.type, position)

      setTimeout(() => {
        const currentNodes = get().nodes
        const enhancementNode = currentNodes.find(n =>
          n.data.type === enhancement.type
          && !n.data.content,
        )

        if (enhancementNode) {
          const { updateNodeData, originalUserQuery } = get()

          // Detect language from user's original query first, fallback to browser language
          const detectLanguageFromContent = (text: string): string => {
            if (!text)
              return 'en'
            // Simple Chinese character detection
            const chineseRegex = /[\u4E00-\u9FFF]/
            return chineseRegex.test(text) ? 'zh' : 'en'
          }

          const currentLanguage = originalUserQuery
            ? detectLanguageFromContent(originalUserQuery)
            : (typeof window !== 'undefined'
                ? (window.navigator.language.startsWith('zh') ? 'zh' : 'en')
                : 'en')

          let defaultContent = ''
          if (currentLanguage === 'zh') {
            switch (enhancement.type) {
              case 'output_format':
                defaultContent = `使用以下专业格式构建所有回复：
## 主要回复
对问题的清晰、直接回答

## 要点
- 重要细节的要点
- 顺序过程的编号步骤  
- **粗体**强调关键信息

## 下一步
可行的建议或后续建议`
                break
              case 'communication_style':
                defaultContent = '保持专业、友好的沟通风格：在保持温暖和鼓励的同时做到清晰简洁。使用主动语态，除非必要否则避免术语，在进入复杂话题之前始终确认理解。'
                break
              case 'goal_setting':
                defaultContent = '专注于实现符合用户目标的具体、可衡量成果。预先定义成功标准，创建进度跟踪的中期检查点，庆祝里程碑成就以保持动力。'
                break
              case 'feedback_style':
                defaultContent = '使用SBI模型提供建设性、可行的反馈：情境（背景）、行为（具体观察）、影响（效果/结果）。始终以优势为先，提供具体的改进建议，确保反馈及时相关。'
                break
              case 'step_by_step':
                defaultContent = '将复杂任务分解为逻辑性、顺序性的步骤，每个阶段都有清晰的指导。为所有步骤编号，解释每个步骤的重要性，包括质量检查点，为常见问题提供故障排除指导。'
                break
              case 'context_setting':
                defaultContent = '考虑用户的背景、经验水平、可用资源和具体约束。根据他们的行业、角色和直接环境调整你的方法，确保相关性和实际适用性。'
                break
              case 'creative_thinking':
                defaultContent = '通过发散思维技巧培养创新问题解决：头脑风暴、思维导图、横向思维和"假如"情景。鼓励探索非常规解决方案，同时保持实际可行性。'
                break
              default:
                defaultContent = `基于您的具体要求和用例优化的${enhancement.type.replace(/_/g, ' ')}配置。`
            }
          }
          else {
            switch (enhancement.type) {
              case 'output_format':
                defaultContent = `Structure all responses using this professional format:
## Main Response
Clear, direct answer to the question

## Key Points
- Bullet points for important details
- Numbered steps for sequential processes
- **Bold** for emphasis on critical information

## Next Steps
Actionable recommendations or follow-up suggestions`
                break
              case 'communication_style':
                defaultContent = 'Maintain a professional, approachable communication style: Be clear and concise while remaining warm and encouraging. Use active voice, avoid jargon unless necessary, and always confirm understanding before proceeding to complex topics.'
                break
              case 'goal_setting':
                defaultContent = 'Focus on achieving specific, measurable outcomes that align with user objectives. Define success criteria upfront, create interim checkpoints for progress tracking, and celebrate milestone achievements to maintain motivation.'
                break
              case 'feedback_style':
                defaultContent = 'Provide constructive, actionable feedback using the SBI model: Situation (context), Behavior (specific observations), Impact (effect/outcome). Always lead with strengths, offer specific improvement suggestions, and ensure feedback is timely and relevant.'
                break
              case 'step_by_step':
                defaultContent = 'Break down complex tasks into logical, sequential steps with clear instructions for each stage. Number all steps, provide context for why each step matters, include quality checkpoints, and offer troubleshooting guidance for common issues.'
                break
              case 'context_setting':
                defaultContent = 'Consider the user\'s background, experience level, available resources, and specific constraints. Adapt your approach based on their industry, role, and immediate environment to ensure relevance and practical applicability.'
                break
              case 'creative_thinking':
                defaultContent = 'Foster innovative problem-solving through divergent thinking techniques: brainstorming, mind mapping, lateral thinking, and "what if" scenarios. Encourage exploration of unconventional solutions while maintaining practical feasibility.'
                break
              default:
                defaultContent = `Optimized ${enhancement.type.replace(/_/g, ' ')} configuration based on your specific requirements and use case.`
            }
          }

          updateNodeData(enhancementNode.id, { content: defaultContent })
        }
      }, (enhancements.length + index) * 50 + 200)
    })
  },

  addQuickStartTemplate: (templateId: string) => {
    // Check if canvas has existing content, if so, clear it first
    const { nodes } = get()
    if (nodes.length > 0) {
      get().resetFlow()
    }

    get().saveToHistory()

    // Use i18n current language instead of browser detection
    const currentLanguage = i18n.language || 'en'

    const templateContent = currentLanguage === 'zh'
      ? QUICK_START_CONTENT_ZH[templateId] || QUICK_START_CONTENT[templateId]
      : QUICK_START_CONTENT[templateId]

    if (!templateContent) {
      console.warn(`Template ${templateId} not found`)
      return
    }

    const templateBlocks = {
      tutor: ['role_definition', 'context_setting', 'learning_style', 'goal_setting', 'step_by_step'],
      business_consultant: ['role_definition', 'context_setting', 'communication_style', 'output_format', 'prioritization'],
      creative_assistant: ['role_definition', 'personality_traits', 'creative_thinking', 'output_format', 'feedback_style'],
      step_by_step_guide: ['role_definition', 'context_setting', 'step_by_step', 'output_format', 'error_handling'],
    }

    const blocks = templateBlocks[templateId as keyof typeof templateBlocks]
    if (!blocks) {
      console.warn(`Template blocks for ${templateId} not found`)
      return
    }

    blocks.forEach((blockType, index) => {
      const content = templateContent[blockType] || ''
      const nodeSpacing = 350
      const startX = 200
      const baseY = 200

      const position = {
        x: startX + index * nodeSpacing,
        y: baseY,
      }

      setTimeout(() => {
        get().addNodeWithContent(blockType, content, position, true)
      }, index * 100)
    })
  },

  saveDraft: async () => {
    const state = get()
    const flowData = state.exportFlowData()

    // Update preview to get the latest prompt
    state.updatePreview()

    // Use the preview prompt as content
    const content = [
      state.preview.system,
      state.preview.human,
      state.preview.assistant,
    ].filter(Boolean).join('\n\n')

    try {
      const response = await fetch('/api/instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: state.title || i18n.t('builder.untitledInstruction'),
          description: state.description,
          content,
          tags: state.tags,
          flowData,
          isDraft: true,
          sourceId: state.sourceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save draft')
      }

      return response.json()
    }
    catch (error) {
      console.error('Error saving draft:', error)
      throw error
    }
  },

  hasPendingChanges: () => {
    const state = get()
    return state.nodes.length > 0 || state.edges.length > 0 || state.title !== '' || state.description !== ''
  },
}))
