'use client'

import { useBuilderStore } from '@/store/builder'
import { Background, Panel, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import { ArrowRight, Edit, Lightbulb, Move } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { CustomNode } from './custom-node'
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
  }
}

interface GuidedCanvasProps {
  step: 'arrange' | 'connect' | 'customize' | 'test'
  onStepComplete?: () => void
}

export function GuidedCanvas({ step, onStepComplete: _onStepComplete }: GuidedCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useBuilderStore(useShallow(selector))

  // 根据步骤决定可交互性
  const interactionConfig = useMemo(() => {
    switch (step) {
      case 'arrange':
        return {
          nodesDraggable: true,
          nodesConnectable: false,
          elementsSelectable: false,
          panOnDrag: false,
        }
      case 'connect':
        return {
          nodesDraggable: false,
          nodesConnectable: true,
          elementsSelectable: false,
          panOnDrag: false,
        }
      case 'customize':
        return {
          nodesDraggable: false,
          nodesConnectable: false,
          elementsSelectable: true,
          panOnDrag: false,
        }
      default:
        return {
          nodesDraggable: false,
          nodesConnectable: false,
          elementsSelectable: false,
          panOnDrag: true,
        }
    }
  }, [step])

  // 验证连接是否有效
  const isValidConnection = useCallback((connection: any) => {
    const isDuplicateConnection = edges.some((edge: any) =>
      edge.source === connection.source && edge.target === connection.target,
    )
    const isSelfConnection = connection.source === connection.target
    return !isDuplicateConnection && !isSelfConnection
  }, [edges])

  // 获取步骤指导配置
  const getGuidanceConfig = () => {
    switch (step) {
      case 'arrange':
        return {
          title: 'Arrange Your Cards',
          message: 'Drag the instruction cards to organize them visually. This helps you understand your workflow layout.',
          icon: Move,
          tip: 'Arrange cards in a clear visual layout for better readability - the logical connections are automatic.',
        }
      case 'connect':
        return {
          title: 'Connect Instructions',
          message: 'Draw lines between cards to set the execution order. The AI will follow these connections.',
          icon: ArrowRight,
          tip: 'Arrows show the flow direction. Connect from general instructions to specific ones.',
        }
      case 'customize':
        return {
          title: 'Customize Content',
          message: 'Click on any card to edit its content. Make it specific to get better AI responses.',
          icon: Edit,
          tip: 'The more detailed your instructions, the better your AI will perform.',
        }
      default:
        return {
          title: 'Ready to Try',
          message: 'Your instruction flow is complete! Time to see how it works.',
          icon: Lightbulb,
          tip: 'Try your AI early and often to refine your instructions.',
        }
    }
  }

  const guidance = getGuidanceConfig()
  const GuidanceIcon = guidance.icon

  return (
    <ReactFlowProvider>
      <div className="relative h-full bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          isValidConnection={isValidConnection}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          {...interactionConfig}
        >
          {/* 简化背景 */}
          <Background
            gap={20}
            size={1}
            color="hsl(var(--border))"
            className="opacity-50"
          />

          {/* 引导面板 */}
          <Panel position="top-center" className="max-w-md">
            <div className="bg-card border rounded-lg p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <GuidanceIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{guidance.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{guidance.message}</p>
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    <Lightbulb className="h-3 w-3" />
                    <span>{guidance.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* 步骤完成提示 */}
          {step === 'arrange' && nodes.length > 0 && (
            <Panel position="bottom-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  Great! Try moving the cards around to see how the layout affects readability.
                </p>
              </div>
            </Panel>
          )}

          {step === 'connect' && edges.length > 0 && (
            <Panel position="bottom-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  Perfect! You've connected
                  {' '}
                  {edges.length}
                  {' '}
                  instruction
                  {edges.length > 1 ? 's' : ''}
                  . The AI will follow this flow.
                </p>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
