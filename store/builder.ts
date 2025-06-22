import type { CustomNodeData } from '@/app/(root)/builder/_components/custom-node'
import type { Connection, Edge, Node, OnEdgesChange, OnNodesChange } from '@xyflow/react'
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
  preview: {
    system: string
    human: string
    assistant: string
  }
  history: HistoryState[]
  historyIndex: number
}

interface BuilderActions {
  setNodes: (nodes: Node<CustomNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (type: string, position?: { x: number, y: number }) => void
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
  updatePreview: () => void
  exportFlowData: () => { nodes: Node<CustomNodeData>[], edges: Edge[] }
  importFlowData: (flowData: { nodes: Node<CustomNodeData>[], edges: Edge[] }) => void
  resetFlow: () => void
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

// 定义块的优先级和连接规则
const BLOCK_PRIORITY: Record<string, number> = {
  role_definition: 1, // 最高优先级，通常是起始点
  context_setting: 2,
  communication_style: 3,
  learning_style: 3,
  personality_traits: 4,
  subject_focus: 4,
  output_format: 5,
  goal_setting: 6,
  difficulty_level: 7,
  creative_thinking: 8,
  step_by_step: 9,
  time_management: 9,
  prioritization: 9,
  conditional_logic: 10, // 逻辑性块，较后执行
  error_handling: 11, // 错误处理，最后执行
  career_planning: 8,
  skill_assessment: 8,
  feedback_style: 8,
}

// 定义块之间的逻辑连接规则
const CONNECTION_RULES: Record<string, string[]> = {
  role_definition: ['context_setting', 'communication_style', 'learning_style'],
  context_setting: ['output_format', 'goal_setting', 'subject_focus'],
  communication_style: ['personality_traits', 'feedback_style', 'output_format'],
  learning_style: ['subject_focus', 'difficulty_level'],
  personality_traits: ['goal_setting', 'creative_thinking'],
  subject_focus: ['difficulty_level', 'output_format'],
  output_format: ['step_by_step', 'prioritization', 'creative_thinking'],
  goal_setting: ['time_management', 'prioritization', 'step_by_step'],
  difficulty_level: ['step_by_step', 'conditional_logic'],
  creative_thinking: ['conditional_logic', 'error_handling'],
  step_by_step: ['time_management', 'error_handling'],
  time_management: ['prioritization', 'error_handling'],
  prioritization: ['conditional_logic', 'error_handling'],
  conditional_logic: ['error_handling'],
  career_planning: ['skill_assessment', 'goal_setting'],
  skill_assessment: ['difficulty_level', 'prioritization'],
  feedback_style: ['step_by_step', 'error_handling'],
}

// 自动连接算法
function autoConnect(nodes: Node<CustomNodeData>[]): Edge[] {
  if (nodes.length === 0)
    return []

  // 按优先级排序节点
  const sortedNodes = [...nodes].sort((a, b) => {
    const priorityA = BLOCK_PRIORITY[a.data.type] || 999
    const priorityB = BLOCK_PRIORITY[b.data.type] || 999
    return priorityA - priorityB
  })

  const edges: Edge[] = []
  const nodeTypes = nodes.map(n => n.data.type)

  // 为每个节点找到合适的连接目标
  sortedNodes.forEach((sourceNode, index) => {
    const sourceType = sourceNode.data.type
    const possibleTargets = CONNECTION_RULES[sourceType] || []

    // 在可能的目标中找到实际存在的节点
    const availableTargets = possibleTargets.filter(targetType =>
      nodeTypes.includes(targetType),
    ).map(targetType =>
      nodes.find(n => n.data.type === targetType)!,
    )

    // 连接到最高优先级的可用目标
    if (availableTargets.length > 0) {
      // 按优先级排序目标
      availableTargets.sort((a, b) => {
        const priorityA = BLOCK_PRIORITY[a.data.type] || 999
        const priorityB = BLOCK_PRIORITY[b.data.type] || 999
        return priorityA - priorityB
      })

      // 连接到第一个（优先级最高的）目标
      const targetNode = availableTargets[0]

      // 检查是否已存在连接
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

    // 如果没有预定义规则，连接到下一个优先级更高的节点
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

  // 确保没有孤立的节点（除了最后一个）
  const connectedSources = new Set(edges.map(e => e.source))
  const connectedTargets = new Set(edges.map(e => e.target))

  sortedNodes.forEach((node, index) => {
    const isConnected = connectedSources.has(node.id) || connectedTargets.has(node.id)
    const isLastNode = index === sortedNodes.length - 1

    if (!isConnected && !isLastNode && index < sortedNodes.length - 1) {
      // 连接到下一个节点
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
    const nodePosition = position || {
      x: Math.random() * 500,
      y: Math.random() * 500,
    }

    // 特殊的label映射
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

    // 自动生成连接
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

    // 删除节点
    const newNodes = state.nodes.filter(node => node.id !== nodeId)

    // 重新生成所有连接
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

    // 只有在节点内容实际发生变化时才更新预览
    // 仅移动节点位置不应该触发昂贵的操作
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
    // 过滤掉删除操作，因为连接线是自动生成的，用户删除后无法重新连接
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

    // 检查是否已存在相同的连接
    const isDuplicateConnection = state.edges.some(edge =>
      edge.source === connection.source && edge.target === connection.target,
    )

    // 防止重复连接
    if (isDuplicateConnection) {
      console.warn('Duplicate connection attempted - connection already exists')
      return
    }

    // 防止自环连接（节点连接到自己）
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

  updatePreview: () => {
    const state = get()
    const { nodes, edges } = state

    // 构建节点图 (将来可用于更复杂的流程分析)
    const _nodeMap = new Map(nodes.map(node => [node.id, node]))
    const edgeMap = new Map()

    // 构建边的映射关系
    edges.forEach((edge) => {
      if (!edgeMap.has(edge.source)) {
        edgeMap.set(edge.source, [])
      }
      edgeMap.get(edge.source).push(edge.target)
    })

    // 找到起始节点（没有入边的节点） - 保留用于将来的流程分析
    const _startNodes = nodes.filter(node =>
      !edges.some(edge => edge.target === node.id),
    )

    // 按类型分组节点内容
    const contentByType = {
      system: [] as string[],
      context: [] as string[],
      behavior: [] as string[],
      format: [] as string[],
      process: [] as string[],
      constraints: [] as string[],
    }

    // 处理所有节点
    nodes.forEach((node) => {
      if (!node.data.content)
        return

      const content = node.data.content.trim()
      if (!content)
        return

      switch (node.data.type) {
        // Core system instructions
        case 'role_definition':
          contentByType.system.push(`Role: ${content}`)
          break
        case 'context_setting':
          contentByType.context.push(`Context: ${content}`)
          break
        case 'output_format':
          contentByType.format.push(`Output Format: ${content}`)
          break

        // Educational and behavioral instructions
        case 'goal_setting':
          contentByType.system.push(`Goals: ${content}`)
          break
        case 'learning_style':
          contentByType.process.push(`Learning Style: ${content}`)
          break
        case 'subject_focus':
          contentByType.context.push(`Subject Focus: ${content}`)
          break
        case 'difficulty_level':
          contentByType.process.push(`Difficulty Level: ${content}`)
          break

        // Communication and feedback style
        case 'communication_style':
          contentByType.behavior.push(`Communication Style: ${content}`)
          break
        case 'feedback_style':
          contentByType.behavior.push(`Feedback Approach: ${content}`)
          break
        case 'personality_traits':
          contentByType.behavior.push(`Personality: ${content}`)
          break

        // Workflow and process instructions
        case 'step_by_step':
          contentByType.process.push(`Step by Step: ${content}`)
          break
        case 'time_management':
          contentByType.process.push(`Time Management: ${content}`)
          break
        case 'prioritization':
          contentByType.process.push(`Prioritization: ${content}`)
          break

        // Advanced features
        case 'conditional_logic':
          contentByType.constraints.push(`Conditional Logic: ${content}`)
          break
        case 'creative_thinking':
          contentByType.behavior.push(`Creative Approach: ${content}`)
          break
        case 'error_handling':
          contentByType.constraints.push(`Error Handling: ${content}`)
          break

        // Planning instructions
        case 'career_planning':
          contentByType.context.push(`Career Planning: ${content}`)
          break
        case 'skill_assessment':
          contentByType.process.push(`Skill Assessment: ${content}`)
          break

        default:
          contentByType.system.push(content)
      }
    })

    // 构建最终的提示词
    let systemPrompt = ''
    let humanPrompt = ''
    let assistantPrompt = ''

    // System prompt construction
    const systemSections = []

    if (contentByType.system.length > 0) {
      systemSections.push(`## Core Definition\n${contentByType.system.join('\n')}`)
    }

    if (contentByType.context.length > 0) {
      systemSections.push(`\n## Context\n${contentByType.context.join('\n')}`)
    }

    if (contentByType.behavior.length > 0) {
      systemSections.push(`\n## Behavior Guidelines\n${contentByType.behavior.join('\n')}`)
    }

    if (contentByType.process.length > 0) {
      systemSections.push(`\n## Process Instructions\n${contentByType.process.join('\n')}`)
    }

    if (contentByType.constraints.length > 0) {
      systemSections.push(`\n## Constraints & Rules\n${contentByType.constraints.join('\n')}`)
    }

    if (contentByType.format.length > 0) {
      systemSections.push(`\n## Output Format\n${contentByType.format.join('\n')}`)
    }

    systemPrompt = systemSections.join('\n').trim()

    // 如果有连接关系，构建流程路径
    if (edges.length > 0) {
      // 构建更复杂的流程路径，支持分支
      const getFlowDescription = () => {
        // 找到起始节点（通常是role_definition）
        const startNodes = nodes.filter(node =>
          !edges.some(edge => edge.target === node.id),
        )

        if (startNodes.length === 0)
          return ''

        const startNode = startNodes[0]
        const visited = new Set<string>()
        const paths: string[] = []

        // 递归构建所有路径
        const buildPaths = (nodeId: string, currentPath: string[] = []) => {
          if (visited.has(nodeId))
            return

          const node = nodes.find(n => n.id === nodeId)
          if (!node)
            return

          const newPath = [...currentPath, node.data.label]

          // 找到所有出边
          const outgoingEdges = edges.filter(edge => edge.source === nodeId)

          if (outgoingEdges.length === 0) {
            // 叶子节点，保存路径
            if (newPath.length > 1) {
              paths.push(newPath.join(' → '))
            }
          }
          else if (outgoingEdges.length === 1) {
            // 单个连接，继续构建
            visited.add(nodeId)
            buildPaths(outgoingEdges[0].target, newPath)
          }
          else {
            // 多个分支，为每个分支创建路径
            visited.add(nodeId)
            outgoingEdges.forEach((edge) => {
              buildPaths(edge.target, newPath)
            })
          }
        }

        buildPaths(startNode.id)

        if (paths.length === 1) {
          return `Logical flow: ${paths[0]}`
        }
        else if (paths.length > 1) {
          return `Logical flows:\n${paths.map(path => `• ${path}`).join('\n')}`
        }

        return ''
      }

      const flowDescription = getFlowDescription()
      if (flowDescription) {
        systemPrompt += `\n\n## Workflow\n${flowDescription}`
      }
    }

    // Human prompt - 主要包含用户交互指导
    const userGuidelines = []
    if (contentByType.context.some(c => c.includes('user') || c.includes('User'))) {
      userGuidelines.push('Please interact according to the defined context and guidelines above.')
    }
    humanPrompt = userGuidelines.join('\n')

    // Assistant prompt - 响应格式和行为提醒
    const responseGuidelines = []
    if (contentByType.format.length > 0) {
      responseGuidelines.push('Remember to follow the specified output format in your responses.')
    }
    if (contentByType.behavior.length > 0) {
      responseGuidelines.push('Maintain the specified communication style and personality throughout the conversation.')
    }
    assistantPrompt = responseGuidelines.join('\n')

    // 更新预览
    set({
      preview: {
        system: systemPrompt || 'No system instructions defined yet. Add blocks to build your prompt.',
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
    set({ nodes, edges })
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
}))
