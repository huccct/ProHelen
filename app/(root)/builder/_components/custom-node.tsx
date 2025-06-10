'use client'

import type { Node, NodeProps } from '@xyflow/react'
import { Button } from '@/components/ui/button'
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
  const updateNodeData = useBuilderStore(state => state.updateNodeData)

  const handleSave = () => {
    updateNodeData(id, { content: editContent })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditContent(data.content || '')
    setIsEditing(false)
  }

  const handleEdit = () => {
    setEditContent(data.content || '')
    setIsEditing(true)
  }

  const icon = getNodeIcon(data.type)
  const description = getNodeDescription(data.type)
  const colors = getNodeColors(data.type)

  return (
    <div className="group relative min-w-[240px] max-w-[320px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-600 !border-gray-500 !w-3 !h-3 hover:!bg-white hover:!border-gray-300 transition-colors !z-50"
        isConnectable={isConnectable}
      />

      <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
        isEditing
          ? 'border-white bg-zinc-800'
          : 'border-gray-700 bg-zinc-900/80 hover:border-gray-600 hover:bg-zinc-800/90'
      } backdrop-blur-sm`}
      >

        {/* Header */}
        <div className={`px-4 py-3 bg-gradient-to-r ${colors.gradient} bg-opacity-10 border-b border-gray-700 relative`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} bg-opacity-20 border border-gray-600 relative z-10 group-hover:bg-opacity-30 transition-all duration-300`}>
                <div className="text-white text-sm group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white text-sm">
                  {data.label}
                </h3>
                <p className="text-xs text-gray-400">
                  {description}
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10 ml-2 flex-shrink-0 rounded-md"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
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
                    className="w-full h-20 p-3 bg-black border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 resize-none focus:outline-none focus:border-gray-400 scrollbar"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="flex-1 bg-white text-black hover:bg-gray-200 h-7 text-xs font-medium"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 hover:bg-zinc-800/50 h-7 text-xs font-medium"
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
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {data.content}
                        </p>
                      )
                    : (
                        <p className="text-gray-500 text-sm italic">
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
        className="!bg-gray-600 !border-gray-500 !w-3 !h-3 hover:!bg-white hover:!border-gray-300 transition-colors !z-50"
        isConnectable={isConnectable}
      />
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
