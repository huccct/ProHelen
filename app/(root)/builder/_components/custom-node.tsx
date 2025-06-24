'use client'

import type { Node, NodeProps } from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBuilderStore } from '@/store/builder'

import { Handle, Position } from '@xyflow/react'
import { AlertTriangle, BarChart3, Book, Brain, CheckCircle, Clock, Compass, Edit3, FileText, Filter, Globe, Heart, Lightbulb, MessageCircle, MessageSquare, Save, Star, Target, Trash2, Users, Workflow, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface CustomNodeData extends Record<string, unknown> {
  label: string
  type: string
  content?: string
  isEditing?: boolean
}

type CustomNodeType = Node<CustomNodeData>

export function CustomNode({ data, id }: NodeProps<CustomNodeType>) {
  const { t } = useTranslation()
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

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation() // 阻止事件冒泡
    setEditContent(data.content || '')
    setIsEditing(true)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    if (!isEditing) {
      handleEdit()
    }
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
      {/* Target Handle - 用于接收连接，但不可交互 */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted !border-border !w-3 !h-3 !opacity-60 !pointer-events-none !z-10"
        isConnectable={false}
      />

      <div
        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
          isEditing
            ? 'border-foreground bg-card'
            : 'border-border bg-card/80 hover:border-border/80 hover:bg-card/90'
        } backdrop-blur-sm`}
        onDoubleClick={handleDoubleClick}
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
                <p className="text-xs text-foreground/70">
                  {description}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-6 w-6 p-0 hover:bg-white/20 cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 hover:bg-red-500/20 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          {isEditing
            ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    placeholder={t('builder.components.customNode.enterInstructions', { label: data.label.toLowerCase() })}
                    className="w-full min-h-[80px] max-h-[200px] p-2 text-sm bg-background border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 scrollbar overflow-y-auto"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    >
                      <X className="h-3 w-3 mr-1" />
                      {t('common.cancel')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className="text-foreground border-border hover:bg-muted cursor-pointer"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {t('common.save')}
                    </Button>
                  </div>
                </div>
              )
            : (
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {data.content || (
                    <span className="italic text-muted-foreground/70">
                      {t('builder.components.customNode.clickToAdd')}
                    </span>
                  )}
                </div>
              )}
        </div>

        {data.content && !isEditing && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-green-500 rounded-full opacity-60" />
          </div>
        )}
      </div>

      {/* Source Handle - 用于发出连接，但不可交互 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted !border-border !w-3 !h-3 !opacity-60 !pointer-events-none !z-10"
        isConnectable={false}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-card border-border [&>button]:text-muted-foreground [&>button]:hover:text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t('builder.components.customNode.confirmDelete.title')}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t('builder.components.customNode.confirmDelete.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={handleCancelDelete}
              className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              {t('builder.components.customNode.confirmDelete.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {t('builder.components.customNode.confirmDelete.confirm')}
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
