'use client'

import type {
  Connection,
  Edge,
  Node,
} from '@xyflow/react'
import { addEdge, Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import { useCallback } from 'react'
import '@xyflow/react/dist/style.css'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface FlowCanvasProps {
  className?: string
}

export function FlowCanvas({ className }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  )

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

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
        className: 'border border-gray-800 hover:border-gray-600 rounded-lg text-white shadow-lg bg-black',
      }

      setNodes(nds => nds.concat(newNode))
    },
    [nodes, setNodes],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        className="bg-black"
        nodeOrigin={[0.5, 0.5]}
        defaultEdgeOptions={{
          style: { stroke: '#1f2937' },
          type: 'smoothstep',
        }}
      >
        <Controls className="border border-gray-800 rounded-lg fill-gray-400 hover:fill-white bg-black" />
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
  )
}
