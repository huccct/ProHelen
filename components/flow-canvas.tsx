'use client'

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
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import '@xyflow/react/dist/style.css'

const nodeTypes = {
  custom: CustomNode,
}

function selector(state: any) {
  return {
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    addNode: state.addNode,
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
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
  } = useBuilderStore(useShallow(selector))

  // 缓存currentBlocks计算，只在节点类型真正变化时重新计算
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

  return (
    <ReactFlowProvider>
      <div className={className}>
        <div className="flex flex-col h-full">
          <Toolbar />
          <div className="flex-1 relative flex">
            <div className="flex-1 relative">
              <BlockPickerModal open={open} onOpenChange={setOpen} onAddNode={addNode} />
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={(_event, node) => {
                  setSelectedNode((node.data as any)?.type || null)
                  setShowRecommendations(true)
                }}
                nodeTypes={nodeTypes}
                // 禁用手动连接功能
                nodesConnectable={false}
                colorMode={theme === 'light' ? 'light' : 'dark'}
                fitView
                proOptions={{
                  hideAttribution: true,
                }}
                className="bg-background"
                nodeOrigin={[0.5, 0.5]}
                data-tour="canvas"
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
                  <div className="flex gap-2" data-tour="add-block">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setOpen(true)}
                          className="transition-colors cursor-pointer"
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
                          onClick={() => setShowRecommendations(!showRecommendations)}
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
                selectedBlock={selectedNode || undefined}
                currentBlocks={currentBlocks}
                onBlockSelect={(blockType) => {
                  addNode(blockType)
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
    </ReactFlowProvider>
  )
}
