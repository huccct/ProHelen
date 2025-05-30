'use client'

import type { Node, NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'

export interface CustomNodeData extends Record<string, unknown> {
  label: string
  type: string
}

type CustomNodeType = Node<CustomNodeData>

export function CustomNode({ data, isConnectable }: NodeProps<CustomNodeType>) {
  return (
    <div className="group relative px-4 py-2 rounded-lg bg-zinc-900/50 border border-gray-800 backdrop-blur-sm hover:bg-zinc-900/70 hover:border-gray-700 transition-all duration-200 min-w-[180px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-700 !border-gray-600 !w-3 !h-3 hover:!bg-gray-200 hover:!border-gray-100"
        isConnectable={isConnectable}
      />

      <div className="flex items-center gap-3">
        {/* Icon container */}
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800/50 text-gray-400 group-hover:text-white transition-colors">
          <span className="text-xl">{getNodeIcon(data.type)}</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="font-medium text-gray-200 group-hover:text-white transition-colors">
            {data.label}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {getNodeDescription(data.type)}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-700 !border-gray-600 !w-3 !h-3 hover:!bg-gray-200 hover:!border-gray-100"
        isConnectable={isConnectable}
      />
    </div>
  )
}

function getNodeIcon(type: string) {
  switch (type) {
    case 'goal_setting':
      return '🎯'
    case 'time_management':
      return '⏰'
    case 'subject_focus':
      return '📚'
    case 'learning_style':
      return '🧠'
    case 'feedback':
      return '💬'
    case 'career_planning':
      return '🧭'
    default:
      return '📋'
  }
}

function getNodeDescription(type: string) {
  switch (type) {
    case 'goal_setting':
      return 'Define learning objectives'
    case 'time_management':
      return 'Organize study schedule'
    case 'subject_focus':
      return 'Subject-specific guidance'
    case 'learning_style':
      return 'Learning approach preferences'
    case 'feedback':
      return 'Feedback preferences'
    case 'career_planning':
      return 'Career development path'
    default:
      return 'Custom instruction block'
  }
}
