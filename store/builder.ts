import type { CustomNodeData } from '@/app/(root)/builder/_components/custom-node'
import type { Connection, Edge, Node, OnEdgesChange, OnNodesChange } from '@xyflow/react'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { create } from 'zustand'

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
}

interface BuilderActions {
  setNodes: (nodes: Node<CustomNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (type: string, position?: { x: number, y: number }) => void
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

  // Actions
  setNodes: nodes => set({ nodes }),
  setEdges: edges => set({ edges }),

  addNode: (type, position) => {
    const nodes = get().nodes
    const nodePosition = position || {
      x: Math.random() * 500,
      y: Math.random() * 500,
    }

    const newNode: Node<CustomNodeData> = {
      id: `${type}-${nodes.length + 1}`,
      type: 'custom',
      position: nodePosition,
      data: {
        label: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        type,
      },
    }

    set({ nodes: [...nodes, newNode] })
    get().updatePreview()
  },

  onNodesChange: (changes) => {
    set(state => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node<CustomNodeData>[],
    }))
    get().updatePreview()
  },

  onEdgesChange: (changes) => {
    set(state => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
    get().updatePreview()
  },

  onConnect: (connection) => {
    set(state => ({
      edges: [...state.edges, { ...connection, id: `edge-${state.edges.length + 1}` }],
    }))
    get().updatePreview()
  },

  updateNodeData: (nodeId, data) => {
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
          contentByType.behavior.push(`Learning Style: ${content}`)
          break
        case 'subject_focus':
          contentByType.context.push(`Subject Focus: ${content}`)
          break
        case 'difficulty_level':
          contentByType.constraints.push(`Difficulty Level: ${content}`)
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
          contentByType.process.push(`Process: ${content}`)
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
      systemSections.push(contentByType.system.join('\n'))
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
      // 构建流程路径
      const getFlowPath = () => {
        // 找到起始节点（没有入边的节点）
        const startNodes = nodes.filter(node =>
          !edges.some(edge => edge.target === node.id),
        )

        if (startNodes.length === 0)
          return []

        // 从起始节点开始，构建线性路径
        const path: string[] = []
        const visited = new Set<string>()

        const buildPath = (nodeId: string) => {
          if (visited.has(nodeId))
            return
          visited.add(nodeId)

          const node = nodes.find(n => n.id === nodeId)
          if (node) {
            path.push(node.data.label)
          }

          // 找到下一个节点
          const nextEdge = edges.find(edge => edge.source === nodeId)
          if (nextEdge) {
            buildPath(nextEdge.target)
          }
        }

        // 从第一个起始节点开始构建路径
        buildPath(startNodes[0].id)

        return path
      }

      const flowPath = getFlowPath()
      if (flowPath.length > 1) {
        systemPrompt += `\n\n## Workflow\nLogical flow: ${flowPath.join(' → ')}`
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
    })
    get().updatePreview()
  },
}))
