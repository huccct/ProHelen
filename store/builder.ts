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

    // 构建节点图
    const nodeMap = new Map(nodes.map(node => [node.id, node]))
    const edgeMap = new Map(edges.map(edge => [edge.source, edge.target]))

    // 找到起始节点（没有入边的节点）
    const startNodes = nodes.filter(node =>
      !edges.some(edge => edge.target === node.id),
    )

    // 使用 DFS 遍历节点图生成指令
    const visited = new Set<string>()
    let systemPrompt = ''
    let humanPrompt = ''
    let assistantPrompt = ''

    function dfs(nodeId: string) {
      if (visited.has(nodeId))
        return
      visited.add(nodeId)

      const node = nodeMap.get(nodeId)
      if (!node)
        return

      // 根据节点类型添加相应的提示词
      switch (node.data.type) {
        case 'goal_setting':
          systemPrompt += `Set the following learning goals: ${node.data.content || ''}\n`
          break
        case 'time_management':
          systemPrompt += `Manage time as follows: ${node.data.content || ''}\n`
          break
        case 'subject_focus':
          humanPrompt += `Focus on: ${node.data.content || ''}\n`
          break
        case 'learning_style':
          systemPrompt += `Adapt to learning style: ${node.data.content || ''}\n`
          break
        case 'feedback':
          assistantPrompt += `Provide feedback: ${node.data.content || ''}\n`
          break
        case 'career_planning':
          humanPrompt += `Career goals: ${node.data.content || ''}\n`
          break
      }

      // 遍历子节点
      const nextNodeId = edgeMap.get(nodeId)
      if (nextNodeId) {
        dfs(nextNodeId)
      }
    }

    // 从每个起始节点开始遍历
    startNodes.forEach(node => dfs(node.id))

    // 更新预览
    set({
      preview: {
        system: systemPrompt.trim(),
        human: humanPrompt.trim(),
        assistant: assistantPrompt.trim(),
      },
    })
  },
}))
