'use client'

import type { Node, NodeMouseHandler } from '@xyflow/react'
import { BlockPickerModal } from '@/app/(root)/builder/_components/block-picker-modal'
import { CustomNode } from '@/app/(root)/builder/_components/custom-node'
import { Toolbar } from '@/app/(root)/builder/_components/toolbar'
import { ValueDemonstration } from '@/app/(root)/builder/_components/value-demonstration'
import { useTheme } from '@/lib/theme-context'
import { useBuilderStore } from '@/store/builder'
import { Background, Panel, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import { Plus, Sparkles } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/shallow'
import { EmptyStateGuide } from './empty-state-guide'
import { RecommendationPanel } from './recommendation-panel'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import '@xyflow/react/dist/style.css'

function selector(state: any) {
  return {
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    addNode: state.addNode,
    addQuickStartTemplate: state.addQuickStartTemplate,
    deleteNode: state.deleteNode,
  }
}

interface FlowCanvasProps {
  className?: string
  onStartTour?: () => void
  onShowHelp?: () => void
}

export function FlowCanvas({ className, onStartTour, onShowHelp }: FlowCanvasProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null)

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    addQuickStartTemplate,
    deleteNode,
    showRecommendations,
    setShowRecommendations,
  } = useBuilderStore(useShallow(state => ({
    ...selector(state),
    showRecommendations: state.showRecommendations,
    setShowRecommendations: state.setShowRecommendations,
  })))

  // Define nodeTypes inside the component to access the handlers
  const nodeTypes = useMemo(() => ({
    custom: (props: any) => (
      <CustomNode
        {...props}
        onShowDeleteConfirm={(nodeId) => {
          setNodeToDelete(nodeId)
          setShowDeleteConfirm(true)
        }}
      />
    ),
  }), [])

  // cache the current blocks calculation, only recalculate when the node types actually change
  const currentBlocks = useMemo(() => {
    return nodes
      .map((node: any) => (node.data as any)?.type)
      .filter(Boolean)
      .sort()
  }, [nodes.map((node: any) => (node.data as any)?.type).join(',')])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type)
        return

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      }

      addNode(type, position)
    },
    [addNode],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && nodes.length > 0) {
      const selectedNodes = nodes.filter((node: any) => node.selected)
      if (selectedNodes.length === 1) {
        event.preventDefault()
        event.stopPropagation()
        setNodeToDelete(selectedNodes[0].id)
        setShowDeleteConfirm(true)
      }
    }
  }, [nodes])

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setNodeToDelete(null)
  }

  const confirmDelete = () => {
    if (nodeToDelete) {
      deleteNode(nodeToDelete)
      setShowDeleteConfirm(false)
      setNodeToDelete(null)
    }
  }

  const onNodeClick: NodeMouseHandler = useCallback((event: React.MouseEvent, _node: Node) => {
    // Prevent showing recommendations on node click
    event.stopPropagation()
  }, [])

  return (
    <ReactFlowProvider>
      <div className={className}>
        <div className="flex flex-col h-full">
          <Toolbar />
          <div className="flex-1 relative flex">
            <div className="flex-1 relative">
              <BlockPickerModal
                open={open}
                onOpenChange={setOpen}
                onAddNode={addNode}
                onAddQuickStartTemplate={addQuickStartTemplate}
              />
              <ReactFlow
                nodes={nodes.map((node: any) => ({
                  ...node,
                  draggable: !node.data?.isEditing,
                }))}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                nodesConnectable={false}
                colorMode={theme === 'light' ? 'light' : 'dark'}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                fitView={false}
                proOptions={{
                  hideAttribution: true,
                }}
                className="bg-background"
                nodeOrigin={[0.5, 0.5]}
                data-tour="canvas"
                onKeyDown={handleKeyDown}
                deleteKeyCode={null}
                multiSelectionKeyCode={null}
              >
                {/* Empty State Guide */}
                {nodes.length === 0 && (
                  <EmptyStateGuide
                    onAddBlock={() => setOpen(true)}
                    onStartTour={onStartTour || (() => {})}
                    onShowHelp={onShowHelp || (() => {})}
                  />
                )}

                <Panel position="top-left" className="left-4 top-4">
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setOpen(true)}
                          className="transition-colors cursor-pointer"
                          data-tour="add-block"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t('builder.components.flowCanvas.addBlock')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('builder.components.flowCanvas.addBlockTooltip')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('builder.components.flowCanvas.addBlockTooltipSub')}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setShowRecommendations(true)}
                          className="transition-colors cursor-pointer"
                          data-tour="smart-suggestions"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {t('builder.components.flowCanvas.smartSuggestions')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('builder.components.flowCanvas.smartSuggestionsTooltip')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('builder.components.flowCanvas.smartSuggestionsTooltipSub')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </Panel>

                <Background
                  gap={12}
                  size={1}
                  color="hsl(var(--border))"
                  className="bg-background"
                />
              </ReactFlow>
            </div>

            {showRecommendations && (
              <RecommendationPanel
                currentBlocks={currentBlocks}
                onBlockSelect={(blockType, suggestedContent) => {
                  if (suggestedContent) {
                    const { addNodeWithContent } = useBuilderStore.getState()
                    addNodeWithContent(blockType, suggestedContent)
                  }
                  else {
                    addNode(blockType)
                  }
                  setShowRecommendations(false)
                }}
                onClose={() => setShowRecommendations(false)}
              />
            )}

            {/* Value Demonstration */}
            <ValueDemonstration
              currentBlocks={currentBlocks}
              onMotivateUser={() => setOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-card border-border [&>button]:text-muted-foreground [&>button]:hover:text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t('builder.components.customNode.confirmDelete.title')}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t('builder.components.customNode.confirmDelete.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCancelDelete}
              className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              {t('builder.components.customNode.confirmDelete.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {t('builder.components.customNode.confirmDelete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ReactFlowProvider>
  )
}
