'use client'

import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Book, Brain, Clock, Compass, MessageSquare, Target } from 'lucide-react'

interface BlockType {
  type: string
  label: string
  icon: ReactNode
  description: string
}

const blockTypes: BlockType[] = [
  {
    type: 'goal_setting',
    label: 'Goal Setting',
    icon: <Target className="h-6 w-6" />,
    description: 'Set SMART learning goals',
  },
  {
    type: 'time_management',
    label: 'Time Management',
    icon: <Clock className="h-6 w-6" />,
    description: 'Plan study schedule',
  },
  {
    type: 'subject_focus',
    label: 'Subject Focus',
    icon: <Book className="h-6 w-6" />,
    description: 'Subject specific instructions',
  },
  {
    type: 'learning_style',
    label: 'Learning Style',
    icon: <Brain className="h-6 w-6" />,
    description: 'Customize learning approach',
  },
  {
    type: 'feedback',
    label: 'Feedback Style',
    icon: <MessageSquare className="h-6 w-6" />,
    description: 'Set feedback preferences',
  },
  {
    type: 'career_planning',
    label: 'Career Planning',
    icon: <Compass className="h-6 w-6" />,
    description: 'Career development goals',
  },
]

interface BlockPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddNode: (type: string) => void
}

export function BlockPickerModal({ open, onOpenChange, onAddNode }: BlockPickerModalProps) {
  const handleDragStart = (event: React.DragEvent, type: string) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleClick = (type: string) => {
    onAddNode(type)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-gray-800 text-white sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-gray-200">Add Block</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          {blockTypes.map(block => (
            <div
              key={block.type}
              className="flex flex-col items-center gap-2 p-4 border border-gray-800 rounded-lg hover:bg-gray-900 hover:border-gray-700 cursor-pointer transition-all duration-200"
              draggable
              onDragStart={e => handleDragStart(e, block.type)}
              onClick={() => handleClick(block.type)}
            >
              <div className="text-gray-400 hover:text-white transition-colors">
                {block.icon}
              </div>
              <span className="text-sm font-medium text-gray-200">{block.label}</span>
              <span className="text-xs text-gray-400 text-center">{block.description}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
