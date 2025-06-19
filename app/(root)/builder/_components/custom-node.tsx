'use client'

import type { Node, NodeProps } from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBuilderStore } from '@/store/builder'
import { Handle, Position } from '@xyflow/react'
import {
  AlertTriangle,
  BarChart3,
  Book,
  Brain,
  CheckCircle,
  Clock,
  Compass,
  Edit3,
  FileText,
  Filter,
  Globe,
  Heart,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Save,
  Star,
  Target,
  Trash2,
  Users,
  Workflow,
  X,
} from 'lucide-react'
import { useState } from 'react'

export interface CustomNodeData extends Record<string, unknown> {
  label: string
  type: string
  content?: string
  isEditing?: boolean
}

type CustomNodeType = Node<CustomNodeData>

export function CustomNode({ data, isConnectable, id }: NodeProps<CustomNodeType>) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(data.content || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const updateNodeData = useBuilderStore(state => state.updateNodeData)
  const deleteNode = useBuilderStore(state => state.deleteNode)

  const handleSave = () => {
    updateNodeData(id, { content: editContent })
    setIsEditing(false)
    // Save时允许弹出Smart Suggestions，所以不阻止事件冒泡
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡，避免弹出Smart Suggestions
    setEditContent(data.content || '')
    setIsEditing(false)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    setEditContent(data.content || '')
    setIsEditing(true)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    setShowDeleteConfirm(true)
  }

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    deleteNode(id)
    setShowDeleteConfirm(false)
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    setShowDeleteConfirm(false)
  }

  const icon = getNodeIcon(data.type)
  const description = getNodeDescription(data.type)
  const colors = getNodeColors(data.type)

  return (
    <div className="group relative min-w-[240px] max-w-[320px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted !border-border !w-3 !h-3 hover:!bg-foreground hover:!border-foreground transition-colors !z-50"
        isConnectable={isConnectable}
      />

      <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
        isEditing
          ? 'border-foreground bg-card'
          : 'border-border bg-card/80 hover:border-border/80 hover:bg-card/90'
      } backdrop-blur-sm`}
      >

        {/* Header */}
        <div className={`px-4 py-3 bg-gradient-to-r ${colors.gradient} bg-opacity-10 border-b border-border relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} bg-opacity-20 border border-border relative z-10 group-hover:bg-opacity-30 transition-all duration-300`}>
                <div className="text-foreground text-sm group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground text-sm">
                  {data.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            {!isEditing && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/10 flex-shrink-0 rounded-md cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 flex-shrink-0 rounded-md cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isEditing
            ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder={getNodePlaceholder(data.type)}
                    className="w-full h-20 p-3 bg-background border border-border rounded-lg text-foreground text-sm placeholder-muted-foreground resize-none focus:outline-none focus:border-border/80 scrollbar"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-7 text-xs font-medium"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="flex-1 h-7 text-xs font-medium"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )
            : (
                <div className="min-h-[60px] flex items-center">
                  {data.content
                    ? (
                        <p className="text-foreground text-sm leading-relaxed">
                          {data.content}
                        </p>
                      )
                    : (
                        <p className="text-muted-foreground text-sm italic">
                          Click edit to add content...
                        </p>
                      )}
                </div>
              )}
        </div>

        {/* Status indicator */}
        {data.content && !isEditing && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-green-500 rounded-full opacity-60" />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted !border-border !w-3 !h-3 hover:!bg-foreground hover:!border-foreground transition-colors !z-50"
        isConnectable={isConnectable}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-card border-border [&>button]:text-muted-foreground [&>button]:hover:text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Block</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete "
              {data.label}
              "? This action cannot be undone and will also remove all connections to this block.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getNodeIcon(type: string) {
  const iconMap: Record<string, React.ReactElement> = {
    // Core blocks
    role_definition: <Users className="h-4 w-4" />,
    context_setting: <Globe className="h-4 w-4" />,
    output_format: <FileText className="h-4 w-4" />,

    // Educational blocks
    goal_setting: <Target className="h-4 w-4" />,
    learning_style: <Brain className="h-4 w-4" />,
    subject_focus: <Book className="h-4 w-4" />,
    difficulty_level: <BarChart3 className="h-4 w-4" />,

    // Behavior blocks
    communication_style: <MessageCircle className="h-4 w-4" />,
    feedback_style: <MessageSquare className="h-4 w-4" />,
    personality_traits: <Heart className="h-4 w-4" />,

    // Workflow blocks
    step_by_step: <Workflow className="h-4 w-4" />,
    time_management: <Clock className="h-4 w-4" />,
    prioritization: <Star className="h-4 w-4" />,

    // Advanced blocks
    conditional_logic: <Filter className="h-4 w-4" />,
    creative_thinking: <Lightbulb className="h-4 w-4" />,
    error_handling: <AlertTriangle className="h-4 w-4" />,

    // Planning blocks
    career_planning: <Compass className="h-4 w-4" />,
    skill_assessment: <CheckCircle className="h-4 w-4" />,
  }

  return iconMap[type] || <FileText className="h-4 w-4" />
}

function getNodeDescription(type: string) {
  const descriptions: Record<string, string> = {
    // Core blocks
    role_definition: 'Define assistant role',
    context_setting: 'Set conversation context',
    output_format: 'Specify response format',

    // Educational blocks
    goal_setting: 'Learning objectives',
    learning_style: 'Learning preferences',
    subject_focus: 'Subject guidance',
    difficulty_level: 'Complexity setting',

    // Behavior blocks
    communication_style: 'Tone and approach',
    feedback_style: 'Feedback preferences',
    personality_traits: 'Assistant personality',

    // Workflow blocks
    step_by_step: 'Sequential process',
    time_management: 'Time planning',
    prioritization: 'Priority setting',

    // Advanced blocks
    conditional_logic: 'If-then logic',
    creative_thinking: 'Creative solutions',
    error_handling: 'Error management',

    // Planning blocks
    career_planning: 'Career development',
    skill_assessment: 'Skills evaluation',
  }

  return descriptions[type] || 'Custom instruction'
}

function getNodeColors(type: string) {
  const colorMap: Record<string, { gradient: string, border: string }> = {
    // Core blocks - Blue theme
    role_definition: { gradient: 'from-blue-500 to-blue-600', border: 'border-blue-500/30' },
    context_setting: { gradient: 'from-purple-500 to-purple-600', border: 'border-purple-500/30' },
    output_format: { gradient: 'from-green-500 to-green-600', border: 'border-green-500/30' },

    // Educational blocks - Warm theme
    goal_setting: { gradient: 'from-orange-500 to-orange-600', border: 'border-orange-500/30' },
    learning_style: { gradient: 'from-pink-500 to-pink-600', border: 'border-pink-500/30' },
    subject_focus: { gradient: 'from-indigo-500 to-indigo-600', border: 'border-indigo-500/30' },
    difficulty_level: { gradient: 'from-yellow-500 to-yellow-600', border: 'border-yellow-500/30' },

    // Behavior blocks - Cool theme
    communication_style: { gradient: 'from-teal-500 to-teal-600', border: 'border-teal-500/30' },
    feedback_style: { gradient: 'from-cyan-500 to-cyan-600', border: 'border-cyan-500/30' },
    personality_traits: { gradient: 'from-rose-500 to-rose-600', border: 'border-rose-500/30' },

    // Workflow blocks - Purple theme
    step_by_step: { gradient: 'from-violet-500 to-violet-600', border: 'border-violet-500/30' },
    time_management: { gradient: 'from-amber-500 to-amber-600', border: 'border-amber-500/30' },
    prioritization: { gradient: 'from-emerald-500 to-emerald-600', border: 'border-emerald-500/30' },

    // Advanced blocks - Gray theme
    conditional_logic: { gradient: 'from-gray-500 to-gray-600', border: 'border-gray-500/30' },
    creative_thinking: { gradient: 'from-lime-500 to-lime-600', border: 'border-lime-500/30' },
    error_handling: { gradient: 'from-red-500 to-red-600', border: 'border-red-500/30' },

    // Planning blocks - Blue-indigo theme
    career_planning: { gradient: 'from-blue-600 to-indigo-600', border: 'border-blue-600/30' },
    skill_assessment: { gradient: 'from-green-600 to-teal-600', border: 'border-green-600/30' },
  }

  return colorMap[type] || { gradient: 'from-gray-500 to-gray-600', border: 'border-gray-500/30' }
}

function getNodePlaceholder(type: string) {
  const placeholders: Record<string, string> = {
    // Core blocks
    role_definition: 'You are a helpful AI assistant specialized in...',
    context_setting: 'The conversation is about... The user is...',
    output_format: 'Format your response as: 1. Summary 2. Details 3. Next steps',

    // Educational blocks
    goal_setting: 'Help me set SMART goals for learning programming...',
    learning_style: 'I learn best through visual examples and hands-on practice...',
    subject_focus: 'Focus on web development, specifically React and JavaScript...',
    difficulty_level: 'Explain concepts at intermediate level with practical examples...',

    // Behavior blocks
    communication_style: 'Use a friendly, encouraging tone. Be patient and supportive...',
    feedback_style: 'Provide constructive feedback with specific suggestions...',
    personality_traits: 'Be enthusiastic, patient, and encouraging...',

    // Workflow blocks
    step_by_step: 'Break down complex tasks into manageable steps...',
    time_management: 'Help me create a study schedule for 2 hours daily...',
    prioritization: 'Focus on the most important concepts first...',

    // Advanced blocks
    conditional_logic: 'If the user asks about basics, provide fundamentals. If advanced...',
    creative_thinking: 'Encourage out-of-the-box thinking and multiple solutions...',
    error_handling: 'When I make mistakes, explain what went wrong and how to fix it...',

    // Planning blocks
    career_planning: 'Help me plan a career path in software development...',
    skill_assessment: 'Assess my current skills and identify areas for improvement...',
  }

  return placeholders[type] || 'Enter your instruction content here...'
}
