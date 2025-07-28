import type { BuilderActions, BuilderState, CustomNodeData, ExtractedBlock, SuggestedEnhancement } from '@/types/builder'
import type { Node } from '@xyflow/react'
import { QUICK_START_CONTENT, QUICK_START_CONTENT_ZH, STORE_CONFIG, TEMPLATE_BLOCKS } from '@/lib/constants'
import i18n from '@/lib/i18n'
import { calculateNodePosition, createNodeId, detectLanguage, generateNodeLabel, getInterfaceLanguage } from '@/lib/utils'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { AutoConnector } from './algorithms/auto-connector'
import { EnhancementContentGenerator } from './algorithms/enhancement-generator'
import { PreviewGenerator } from './algorithms/preview-generator'
import { HistoryManager } from './managers/history-manager'

export const useBuilderStore = create<BuilderState & BuilderActions>()(
  subscribeWithSelector(
    immer((set, get) => {
      const historyManager = new HistoryManager()

      return {
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

        // Basic setters
        setNodes: nodes => set((state) => {
          state.nodes = nodes
        }),
        setEdges: edges => set((state) => {
          state.edges = edges
        }),
        setTitle: title => set((state) => {
          state.title = title
        }),
        setDescription: description => set((state) => {
          state.description = description
        }),
        setContent: content => set((state) => {
          state.content = content
        }),
        setTags: tags => set((state) => {
          state.tags = tags
        }),
        setIsTemplate: isTemplate => set((state) => {
          state.isTemplate = isTemplate
        }),
        setSourceId: sourceId => set((state) => {
          state.sourceId = sourceId
        }),
        setOriginalUserQuery: query => set((state) => {
          state.originalUserQuery = query
        }),
        setSelectedNode: nodeType => set((state) => {
          state.selectedNode = nodeType
        }),
        setShowRecommendations: show => set((state) => {
          state.showRecommendations = show
        }),
        setPreview: preview => set((state) => {
          state.preview = preview
        }),

        // Node operations
        addNode: (type, position) => {
          const { nodes } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, get().edges)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex

            const nodePosition = position || calculateNodePosition(state.nodes.length)
            const label = generateNodeLabel(type)

            const newNode: Node<CustomNodeData> = {
              id: createNodeId(type, state.nodes),
              type: 'custom',
              position: nodePosition,
              data: { label, type },
            }

            state.nodes.push(newNode)

            const autoConnector = new AutoConnector(state.nodes, state.edges)
            state.edges = autoConnector.connect()
          })

          get().updatePreview()
        },

        addNodeWithContent: (type, content, position, skipHistorySave) => {
          if (!skipHistorySave) {
            const { nodes, edges } = get()
            const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

            set((state) => {
              state.history = newHistory
              state.historyIndex = newIndex
            })
          }

          set((state) => {
            const nodePosition = position || calculateNodePosition(state.nodes.length)
            const label = generateNodeLabel(type)

            const newNode: Node<CustomNodeData> = {
              id: createNodeId(type, state.nodes),
              type: 'custom',
              position: nodePosition,
              data: { label, type, content },
            }

            state.nodes.push(newNode)

            const autoConnector = new AutoConnector(state.nodes, state.edges)
            state.edges = autoConnector.connect()
          })

          get().updatePreview()
        },

        deleteNode: (nodeId) => {
          const { nodes, edges } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex

            state.nodes = state.nodes.filter(node => node.id !== nodeId)

            const autoConnector = new AutoConnector(state.nodes, state.edges)
            state.edges = autoConnector.connect()
          })

          get().updatePreview()
        },

        updateNodeData: (nodeId, data) => {
          const { nodes, edges } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex

            const nodeIndex = state.nodes.findIndex(node => node.id === nodeId)
            if (nodeIndex !== -1) {
              state.nodes[nodeIndex].data = { ...state.nodes[nodeIndex].data, ...data }
            }
          })

          get().updatePreview()
        },

        // Flow operations
        onNodesChange: (changes) => {
          const hasNonSelectionChanges = changes.some(change => change.type !== 'select')

          if (hasNonSelectionChanges) {
            const { nodes, edges } = get()
            const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

            set((state) => {
              state.history = newHistory
              state.historyIndex = newIndex
            })
          }

          const prevNodes = get().nodes

          set((state) => {
            state.nodes = applyNodeChanges(changes, state.nodes) as Node<CustomNodeData>[]
          })

          const hasContentChange = changes.some(change =>
            change.type === 'add'
            || change.type === 'remove'
            || (change.type === 'replace'
              && ((change as any).item?.data?.content
                !== prevNodes.find(n => n.id === change.id)?.data?.content)),
          )

          if (hasContentChange) {
            get().updatePreview()
          }
        },

        onEdgesChange: (changes) => {
          const filteredChanges = changes.filter(change => change.type !== 'remove')
          const hasNonSelectionChanges = filteredChanges.some(change => change.type !== 'select')

          if (hasNonSelectionChanges) {
            const { nodes, edges } = get()
            const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

            set((state) => {
              state.history = newHistory
              state.historyIndex = newIndex
              state.edges = applyEdgeChanges(filteredChanges, state.edges)
            })

            get().updatePreview()
          }
          else {
            set((state) => {
              state.edges = applyEdgeChanges(filteredChanges, state.edges)
            })
          }
        },

        onConnect: (connection) => {
          const { edges } = get()

          // Validation
          const isDuplicateConnection = edges.some(edge =>
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

          const { nodes } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex
            state.edges.push({
              ...connection,
              id: `edge-${state.edges.length + 1}`,
            })
          })

          get().updatePreview()
        },

        // Preview operations
        updatePreview: () => {
          const { nodes, edges, originalUserQuery } = get()
          const generator = new PreviewGenerator(nodes, edges, originalUserQuery)
          const preview = generator.generate()

          set((state) => {
            state.preview = preview
          })
        },

        // Data operations
        exportFlowData: () => {
          const { nodes, edges } = get()
          return { nodes, edges }
        },

        importFlowData: (flowData) => {
          const { nodes, edges } = flowData

          const adjustedNodes = nodes.map((node: Node<CustomNodeData>, index: number) => ({
            ...node,
            position: calculateNodePosition(index, STORE_CONFIG.BASE_Y - 50),
          }))

          set((state) => {
            state.nodes = adjustedNodes
            state.edges = edges
            state.originalUserQuery = ''
          })

          get().updatePreview()
        },

        resetFlow: () => {
          historyManager.updateState([], -1)

          set((state) => {
            state.nodes = []
            state.edges = []
            state.title = ''
            state.description = ''
            state.content = ''
            state.tags = []
            state.isTemplate = false
            state.sourceId = null
            state.originalUserQuery = ''
            state.selectedNode = null
            state.showRecommendations = false
            state.history = []
            state.historyIndex = -1
          })

          get().updatePreview()
        },

        // History operations
        saveToHistory: () => {
          const { nodes, edges } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex
          })
        },

        undo: () => {
          const { state, historyIndex: newIndex } = historyManager.undo()

          if (state) {
            set((draft) => {
              draft.nodes = state.nodes
              draft.edges = state.edges
              draft.historyIndex = newIndex
            })
            get().updatePreview()
          }
        },

        redo: () => {
          const { state, historyIndex: newIndex } = historyManager.redo()

          if (state) {
            set((draft) => {
              draft.nodes = state.nodes
              draft.edges = state.edges
              draft.historyIndex = newIndex
            })
            get().updatePreview()
          }
        },

        canUndo: () => historyManager.canUndo(),
        canRedo: () => historyManager.canRedo(),

        // Analysis operations
        // Analysis operations
        applyAnalysisResults: (blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => {
          if (userQuery) {
            set((state) => {
              state.originalUserQuery = userQuery
            })
          }

          const { nodes, edges } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex

            blocks.forEach((block, index) => {
              const position = calculateNodePosition(index)
              const label = generateNodeLabel(block.type)

              const newNode: Node<CustomNodeData> = {
                id: createNodeId(block.type, state.nodes),
                type: 'custom',
                position,
                data: { label, type: block.type, content: block.content },
              }

              state.nodes.push(newNode)
            })

            if (enhancements.length > 0) {
              const startX = STORE_CONFIG.START_X + (state.nodes.length * STORE_CONFIG.NODE_SPACING)
              const contentLanguage = userQuery
                ? detectLanguage(userQuery)
                : (typeof window !== 'undefined'
                    ? (window.navigator.language.startsWith('zh') ? 'zh' : 'en')
                    : 'en')

              const contentGenerator = new EnhancementContentGenerator(contentLanguage)

              enhancements.forEach((enhancement, index) => {
                const position = {
                  x: startX + index * STORE_CONFIG.NODE_SPACING,
                  y: STORE_CONFIG.ENHANCEMENT_BASE_Y,
                }
                const label = generateNodeLabel(enhancement.type)
                const defaultContent = contentGenerator.generate(enhancement.type)

                const newNode: Node<CustomNodeData> = {
                  id: createNodeId(enhancement.type, state.nodes),
                  type: 'custom',
                  position,
                  data: { label, type: enhancement.type, content: defaultContent },
                }

                state.nodes.push(newNode)
              })
            }

            const autoConnector = new AutoConnector(state.nodes, state.edges)
            state.edges = autoConnector.connect()
          })

          get().updatePreview()
        },

        createEnhancementBlocks: (enhancements: SuggestedEnhancement[]) => {
          const { nodes, edges, originalUserQuery } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(nodes, edges)

          const contentLanguage = originalUserQuery
            ? detectLanguage(originalUserQuery)
            : (typeof window !== 'undefined'
                ? (window.navigator.language.startsWith('zh') ? 'zh' : 'en')
                : 'en')

          const contentGenerator = new EnhancementContentGenerator(contentLanguage)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex

            const startX = STORE_CONFIG.START_X + (state.nodes.length * STORE_CONFIG.NODE_SPACING)

            enhancements.forEach((enhancement, index) => {
              const position = {
                x: startX + index * STORE_CONFIG.NODE_SPACING,
                y: STORE_CONFIG.ENHANCEMENT_BASE_Y,
              }
              const label = generateNodeLabel(enhancement.type)
              const defaultContent = contentGenerator.generate(enhancement.type)

              const newNode: Node<CustomNodeData> = {
                id: createNodeId(enhancement.type, state.nodes),
                type: 'custom',
                position,
                data: { label, type: enhancement.type, content: defaultContent },
              }

              state.nodes.push(newNode)
            })

            const autoConnector = new AutoConnector(state.nodes, state.edges)
            state.edges = autoConnector.connect()
          })

          get().updatePreview()
        },

        // Template operations
        addQuickStartTemplate: (templateId: string) => {
          const { nodes } = get()

          if (nodes.length > 0) {
            get().resetFlow()
          }

          const { nodes: currentNodes, edges } = get()
          const { history: newHistory, historyIndex: newIndex } = historyManager.save(currentNodes, edges)

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex
          })

          const currentLanguage = getInterfaceLanguage()
          const templateContent = currentLanguage === 'zh'
            ? QUICK_START_CONTENT_ZH[templateId] || QUICK_START_CONTENT[templateId]
            : QUICK_START_CONTENT[templateId]

          if (!templateContent) {
            console.warn(`Template ${templateId} not found`)
            return
          }

          const blocks = TEMPLATE_BLOCKS[templateId as keyof typeof TEMPLATE_BLOCKS]
          if (!blocks) {
            console.warn(`Template blocks for ${templateId} not found`)
            return
          }

          set((state) => {
            state.history = newHistory
            state.historyIndex = newIndex

            blocks.forEach((blockType, index) => {
              const content = templateContent[blockType] || ''
              const position = calculateNodePosition(index)
              const label = generateNodeLabel(blockType)

              const newNode: Node<CustomNodeData> = {
                id: createNodeId(blockType, state.nodes),
                type: 'custom',
                position,
                data: { label, type: blockType, content },
              }

              state.nodes.push(newNode)
            })

            const autoConnector = new AutoConnector(state.nodes, state.edges)
            state.edges = autoConnector.connect()
          })
          get().updatePreview()
        },

        // Draft operations
        saveDraft: async () => {
          const state = get()
          const flowData = state.exportFlowData()

          // Update preview to get the latest prompt
          state.updatePreview()

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
          return (
            state.nodes.length > 0
            || state.edges.length > 0
            || state.title !== ''
            || state.description !== ''
          )
        },
      }
    }),
  ),
)

// Update history manager instance when history state changes
useBuilderStore.subscribe(
  state => ({ history: state.history, historyIndex: state.historyIndex }),
  (current, previous) => {
    if (current.history !== previous.history || current.historyIndex !== previous.historyIndex) {
      // This could be used for additional history management if needed
    }
  },
)
