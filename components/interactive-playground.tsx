'use client'

import type { CustomNodeData } from '@/app/(root)/builder/_components/custom-node'
import { CustomNode } from '@/app/(root)/builder/_components/custom-node'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { applyEdgeChanges, applyNodeChanges, Background, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import { motion } from 'framer-motion'
import { ArrowRight, Copy, Play, RefreshCw } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import '@xyflow/react/dist/style.css'

function getInitialNodes(t: any) {
  return [
    {
      id: '1',
      type: 'custom',
      position: { x: 225, y: 350 },
      data: {
        label: t('builder.components.blockPicker.blocks.roleDefinition.label'),
        type: 'role_definition',
        content: t('home.playground.demoBlocks.roleDefinition.content'),
      },
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 575, y: 350 },
      data: {
        label: t('builder.components.blockPicker.blocks.communicationStyle.label'),
        type: 'communication_style',
        content: t('home.playground.demoBlocks.communicationStyle.content'),
      },
    },
    {
      id: '3',
      type: 'custom',
      position: { x: 925, y: 350 },
      data: {
        label: t('builder.components.blockPicker.blocks.outputFormat.label'),
        type: 'output_format',
        content: 'Please provide your response in a clear, structured format with bullet points when listing multiple items.',
      },
    },
  ]
}

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
  },
]

export function InteractivePlayground() {
  const { t } = useTranslation()
  const [nodes, setNodes] = useState(() => getInitialNodes(t))
  const [edges, setEdges] = useState(initialEdges)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [showPrompt, setShowPrompt] = useState(false)

  const updateNodeData = useCallback((nodeId: string, data: Partial<CustomNodeData>) => {
    setNodes(currentNodes =>
      currentNodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node,
      ),
    )
  }, [])

  const deleteNodeLocal = useCallback((nodeId: string) => {
    setNodes(currentNodes => currentNodes.filter(node => node.id !== nodeId))
    setEdges(currentEdges => currentEdges.filter(edge =>
      edge.source !== nodeId && edge.target !== nodeId,
    ))
  }, [])

  const nodeTypes = useMemo(() => ({
    custom: (props: any) => (
      <CustomNode
        {...props}
        onUpdateNodeData={updateNodeData}
        onDeleteNode={deleteNodeLocal}
      />
    ),
  }), [updateNodeData, deleteNodeLocal])

  const onNodesChange = useCallback((changes: any) => {
    setNodes(nds => applyNodeChanges(changes, nds))
  }, [])

  const onEdgesChange = useCallback((changes: any) => {
    setEdges(eds => applyEdgeChanges(changes, eds))
  }, [])

  const generatePrompt = () => {
    const prompt = nodes
      .filter(node => node.data.content)
      .map(node => node.data.content)
      .join('\n\n')

    setGeneratedPrompt(prompt)
    setShowPrompt(true)
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      toast.success(t('builder.components.promptPreview.messages.copied'))
    }
    catch {
      toast.error(t('builder.components.promptPreview.messages.copyFailed'))
    }
  }

  const resetNodes = () => {
    setNodes(getInitialNodes(t))
    setEdges(initialEdges)
    setShowPrompt(false)
    setGeneratedPrompt('')
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[600px]">
      <div className="xl:col-span-2">
        <Card className="h-full overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="h-full relative">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes.map((node: any) => ({
                  ...node,
                  draggable: !node.data?.isEditing,
                }))}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                nodesConnectable={false}
                defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                fitView={false}
                proOptions={{ hideAttribution: true }}
                className="bg-background"
                nodeOrigin={[0.5, 0.5]}
              >
                <Background
                  gap={20}
                  size={1}
                  color="hsl(var(--border))"
                  className="opacity-50"
                />
              </ReactFlow>
            </ReactFlowProvider>

            <div className="absolute top-4 left-4 right-4 z-10">
              <motion.div
                className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{t('home.playground.canvas.title')}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('home.playground.canvas.subtitle')}
                </p>
              </motion.div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10">
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetNodes}
                  className="bg-background/90 backdrop-blur-sm border-border/60 hover:bg-background/95 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {t('common.reset', { defaultValue: 'Reset' })}
                </Button>
                <Button
                  size="sm"
                  onClick={generatePrompt}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  <Play className="h-3 w-3 mr-1" />
                  {t('home.playground.generatePrompt')}
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-4 border border-border/50 bg-background/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              {t('home.playground.preview.instructions', { defaultValue: 'Try This' })}
            </h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                •
                {t('home.playground.preview.dragInstruction', { defaultValue: 'Drag blocks to rearrange' })}
              </p>
              <p>
                •
                {t('home.playground.preview.doubleClickInstruction', { defaultValue: 'Double-click to edit content' })}
              </p>
              <p>
                •
                {t('home.playground.preview.generateInstruction', { defaultValue: 'Click "Generate" to see prompt' })}
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-4 border border-border/50 bg-background/50 backdrop-blur-sm flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                {t('home.playground.preview.generatedPrompt')}
              </h4>
              {showPrompt && generatedPrompt && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyPrompt}
                  className="h-6 w-6 p-0 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
            {showPrompt && generatedPrompt
              ? (
                  <motion.div
                    className="bg-muted/50 rounded-lg p-3 text-xs font-mono leading-relaxed max-h-48 overflow-y-auto border scrollbar"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {generatedPrompt}
                  </motion.div>
                )
              : (
                  <p className="text-xs text-muted-foreground">
                    {t('home.playground.preview.clickGenerate')}
                  </p>
                )}
          </Card>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-base rounded-xl transition-colors cursor-pointer"
            onClick={() => window.location.href = '/builder'}
          >
            {t('home.playground.tryFullBuilder')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {t('home.playground.fullBuilderDescription', {
              defaultValue: 'Access 15+ block types, templates, and advanced features',
            })}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
