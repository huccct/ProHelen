'use client'

import { useBuilderStore } from '@/store/builder'
import { Background, Panel, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import { ArrowDown, Edit, Hand, Lightbulb, MousePointer2, Move } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
  const [showHandAnimation, setShowHandAnimation] = useState(false)
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)

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

  // 动画和高亮效果
  useEffect(() => {
    if (step === 'arrange' && nodes.length > 0) {
      // 显示拖拽动画
      const timer = setTimeout(() => {
        setShowHandAnimation(true)
        setHighlightedNode(nodes[0]?.id)
      }, 1000)

      const hideTimer = setTimeout(() => {
        setShowHandAnimation(false)
        setHighlightedNode(null)
      }, 4000)

      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
    else if (step === 'customize' && nodes.length > 0) {
      // 高亮第一个空节点
      const emptyNode = nodes.find((node: any) => !node.data.content)
      if (emptyNode) {
        setHighlightedNode(emptyNode.id)
        const timer = setTimeout(() => {
          setHighlightedNode(null)
        }, 5000)
        return () => clearTimeout(timer)
      }
    }
  }, [step, nodes])

  // 获取步骤指导配置
  const getGuidanceConfig = () => {
    const hasEmptyNodes = nodes.some((node: any) => !node.data.content)
    const customizedCount = nodes.filter((node: any) => node.data.content).length

    switch (step) {
      case 'arrange':
        if (nodes.length === 0) {
          return {
            title: t('builder.guided.canvas.noBlocks'),
            message: t('builder.guided.canvas.noBlocksMessage'),
            action: t('builder.guided.canvas.noBlocksAction'),
            icon: Move,
            type: 'waiting' as const,
          }
        }
        return {
          title: t('builder.guided.canvas.dragToArrange'),
          message: t('builder.guided.canvas.dragMessage'),
          action: t('builder.guided.canvas.dragAction'),
          icon: Hand,
          type: 'action' as const,
        }
      case 'customize':
        if (hasEmptyNodes) {
          return {
            title: t('builder.guided.canvas.clickToEdit'),
            message: t('builder.guided.canvas.clickMessage'),
            action: t('builder.guided.canvas.clickAction'),
            icon: MousePointer2,
            type: 'action' as const,
          }
        }
        return {
          title: t('builder.guided.canvas.allCustomized'),
          message: t('builder.guided.canvas.allCustomizedMessage', { count: customizedCount }),
          action: t('builder.guided.canvas.allCustomizedAction'),
          icon: Edit,
          type: 'success' as const,
        }
      default:
        return {
          title: t('builder.guided.canvas.testReady'),
          message: t('builder.guided.canvas.testReadyMessage'),
          action: t('builder.guided.canvas.testReadyAction'),
          icon: Lightbulb,
          type: 'success' as const,
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
          nodes={nodes.map((node: any) => ({
            ...node,
            className: highlightedNode === node.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
            draggable: !node.data?.isEditing,
          }))}
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

          {/* 主要引导面板 */}
          <Panel position="top-center" className="max-w-lg">
            <div className={`border rounded-lg p-4 shadow-lg transition-colors ${
              guidance.type === 'action'
                ? 'bg-blue-50 border-blue-200'
                : guidance.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-card border-border'
            }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  guidance.type === 'action'
                    ? 'bg-blue-100'
                    : guidance.type === 'success'
                      ? 'bg-green-100'
                      : 'bg-primary/10'
                }`}
                >
                  <GuidanceIcon className={`h-5 w-5 ${
                    guidance.type === 'action'
                      ? 'text-blue-600'
                      : guidance.type === 'success'
                        ? 'text-green-600'
                        : 'text-primary'
                  }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm mb-1 ${
                    guidance.type === 'action'
                      ? 'text-blue-900'
                      : guidance.type === 'success'
                        ? 'text-green-900'
                        : 'text-foreground'
                  }`}
                  >
                    {guidance.title}
                  </h3>
                  <p className={`text-sm mb-2 ${
                    guidance.type === 'action'
                      ? 'text-blue-700'
                      : guidance.type === 'success'
                        ? 'text-green-700'
                        : 'text-muted-foreground'
                  }`}
                  >
                    {guidance.message}
                  </p>
                  <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${
                    guidance.type === 'action'
                      ? 'bg-blue-100 text-blue-800'
                      : guidance.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-50 text-amber-700'
                  }`}
                  >
                    {guidance.type === 'action' && <ArrowDown className="h-3 w-3 animate-bounce" />}
                    <span>{guidance.action}</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* 拖拽动画指示器 */}
          {showHandAnimation && step === 'arrange' && highlightedNode && (
            <>
              {nodes.filter((node: any) => node.id === highlightedNode).map((node: any) => (
                <div
                  key={`drag-hint-${node.id}`}
                  className="absolute pointer-events-none z-50"
                  style={{
                    left: `${node.position.x + 120}px`,
                    top: `${node.position.y - 60}px`,
                  }}
                >
                  <div className="animate-pulse">
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm">
                      <Hand className="h-4 w-4" />
                      {t('builder.guided.canvas.dragHint')}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* 点击提示动画 */}
          {step === 'customize' && highlightedNode && (
            <>
              {nodes.filter((node: any) => node.id === highlightedNode).map((node: any) => (
                <div
                  key={`click-hint-${node.id}`}
                  className="absolute pointer-events-none z-50"
                  style={{
                    left: `${node.position.x + 120}px`,
                    top: `${node.position.y - 60}px`,
                  }}
                >
                  <div className="animate-bounce">
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm">
                      <MousePointer2 className="h-4 w-4" />
                      {t('builder.guided.canvas.clickHint')}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* 进度指示器 - 只在还有未完成的模块时显示 */}
          {step === 'customize' && customizedCount < nodes.length && nodes.length > 0 && (
            <Panel position="bottom-center">
              <div className="bg-card border rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">
                      {t('builder.guided.canvas.progress')}
                      :
                      {customizedCount}
                      /
                      {nodes.length}
                    </div>
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${nodes.length > 0 ? (customizedCount / nodes.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {/* 测试步骤的特殊指示 */}
          {step === 'test' && (
            <Panel position="bottom-center">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {t('builder.guided.canvas.readyToTest')}
                    </p>
                    <p className="text-xs text-green-700">
                      {t('builder.guided.canvas.lookRight')}
                    </p>
                  </div>
                  <div className="animate-bounce">
                    <div className="text-2xl">👉</div>
                  </div>
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
