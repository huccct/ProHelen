'use client'

import { useCallback } from 'react'

interface NodeSidebarProps {
  className?: string
}

export function NodeSidebar({ className }: NodeSidebarProps) {
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  return (
    <aside className={className}>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Blocks</h3>
        <div
          className="border border-gray-800 hover:border-gray-600 transition-all duration-200 rounded-lg p-4 mb-3 cursor-move"
          onDragStart={event => onDragStart(event, 'input')}
          draggable
        >
          <div className="text-white">Input Node</div>
          <div className="text-xs text-gray-400 mt-1">Start your flow with input data</div>
        </div>
        <div
          className="border border-gray-800 hover:border-gray-600 transition-all duration-200 rounded-lg p-4 mb-3 cursor-move"
          onDragStart={event => onDragStart(event, 'default')}
          draggable
        >
          <div className="text-white">Process Node</div>
          <div className="text-xs text-gray-400 mt-1">Transform or modify data</div>
        </div>
        <div
          className="border border-gray-800 hover:border-gray-600 transition-all duration-200 rounded-lg p-4 cursor-move"
          onDragStart={event => onDragStart(event, 'output')}
          draggable
        >
          <div className="text-white">Output Node</div>
          <div className="text-xs text-gray-400 mt-1">Generate final output</div>
        </div>
      </div>
    </aside>
  )
}
