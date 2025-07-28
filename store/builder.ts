import type { BuilderActions, BuilderState, CustomNodeData, ExtractedBlock, HistoryState, SuggestedEnhancement } from '@/types/builder'
import type { Edge, Node } from '@xyflow/react'
import { BLOCK_PRIORITY, CONNECTION_RULES, QUICK_START_CONTENT, QUICK_START_CONTENT_ZH } from '@/lib/constants'
import i18n from '@/lib/i18n'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { create } from 'zustand'

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
  setTitle: title => set({ title }),
  setDescription: description => set({ description }),
  setContent: content => set({ content }),
  setTags: tags => set({ tags }),
  setIsTemplate: isTemplate => set({ isTemplate }),
  setSourceId: sourceId => set({ sourceId }),
  setOriginalUserQuery: query => set({ originalUserQuery: query }),
  setSelectedNode: nodeType => set({ selectedNode: nodeType }),
  setShowRecommendations: show => set({ showRecommendations: show }),
  setPreview: preview => set({ preview }),

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

  exportFlowData: () => {
    const { nodes, edges } = get()
    return { nodes, edges }
  },

  importFlowData: (flowData) => {
    const { nodes, edges } = flowData

    const adjustedNodes = nodes.map((node: Node<CustomNodeData>, index: number) => {
      const nodeSpacing = 350
      const startX = 200
      const baseY = 150

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
      const baseY = 150

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
      const baseY = 150

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
