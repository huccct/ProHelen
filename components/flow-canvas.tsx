'use client'

import { BlockPickerModal } from '@/app/(root)/builder/_components/block-picker-modal'
import { CustomNode } from '@/app/(root)/builder/_components/custom-node'
import { Toolbar } from '@/app/(root)/builder/_components/toolbar'
import { useBuilderStore } from '@/store/builder'
import { Background, MiniMap, Panel, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import { Plus, Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { RecommendationPanel } from './recommendation-panel'
import { Button } from './ui/button'
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
    onConnect: state.onConnect,
    addNode: state.addNode,
  }
}

interface FlowCanvasProps {
  className?: string
}

export function FlowCanvas({ className }: FlowCanvasProps) {
  const [open, setOpen] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useBuilderStore(useShallow(selector))

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
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={(_event, node) => {
                  setSelectedNode((node.data as any)?.type || null)
                  setShowRecommendations(true)
                }}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{
                  hideAttribution: true,
                }}
                className="bg-black"
                nodeOrigin={[0.5, 0.5]}
                defaultEdgeOptions={{
                  style: { stroke: '#6b7280', strokeWidth: 2 },
                  animated: true,
                }}
              >
                <Panel position="top-left" className="left-4 top-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(true)}
                      className="border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Block
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRecommendations(!showRecommendations)}
                      className="border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Smart Suggestions
                    </Button>
                  </div>
                </Panel>

                <MiniMap
                  className="border border-gray-800 rounded-lg bg-black"
                  nodeColor="#1f2937"
                  maskColor="rgba(0, 0, 0, 0.8)"
                />
                <Background
                  gap={12}
                  size={1}
                  color="#1f2937"
                  className="bg-black"
                />
              </ReactFlow>
            </div>

            {showRecommendations && (
              <RecommendationPanel
                selectedBlock={selectedNode || undefined}
                currentBlocks={nodes.map((node: any) => (node.data as any)?.type).filter(Boolean)}
                onBlockSelect={(blockType) => {
                  addNode(blockType)
                  setShowRecommendations(false)
                }}
                onClose={() => setShowRecommendations(false)}
              />
            )}
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}
