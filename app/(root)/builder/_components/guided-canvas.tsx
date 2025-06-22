'use client'

import { useBuilderStore } from '@/store/builder'
import { Background, Panel, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import { Edit, Lightbulb, Move } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  step: 'arrange' | 'customize' | 'test'
  onStepComplete?: () => void
}

export function GuidedCanvas({ step, onStepComplete: _onStepComplete }: GuidedCanvasProps) {
  const { t } = useTranslation()
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
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

  // 获取步骤指导配置
  const getGuidanceConfig = () => {
    switch (step) {
      case 'arrange':
        return {
          title: t('builder.guided.canvas.arrangeCards'),
          message: t('builder.guided.canvas.arrangeMessage'),
          icon: Move,
          tip: t('builder.guided.canvas.arrangeTip'),
        }
      case 'customize':
        return {
          title: t('builder.guided.canvas.customizeContent'),
          message: t('builder.guided.canvas.customizeMessage'),
          icon: Edit,
          tip: t('builder.guided.canvas.customizeTip'),
        }
      default:
        return {
          title: t('builder.guided.canvas.readyToTest'),
          message: t('builder.guided.canvas.readyMessage'),
          icon: Lightbulb,
          tip: t('builder.guided.canvas.readyTip'),
        }
    }
  }

  const guidance = getGuidanceConfig()
  const GuidanceIcon = guidance.icon

  const customizedCount = nodes.filter((node: any) => node.data.content).length

  return (
    <ReactFlowProvider>
      <div className="relative h-full bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
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
                  {t('builder.guided.canvas.arrangeComplete')}
                </p>
              </div>
            </Panel>
          )}

          {step === 'customize' && customizedCount > 0 && (
            <Panel position="bottom-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  {t('builder.guided.canvas.customizeComplete', {
                    count: customizedCount,
                    s: customizedCount > 1 ? 's' : '',
                  })}
                </p>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
