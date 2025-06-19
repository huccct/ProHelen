'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertTriangle,
  BarChart3,
  Book,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Filter,
  Globe,
  Heart,
  Layers,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Settings,
  Star,
  Target,
  Users,
  Workflow,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface BlockType {
  type: string
  label: string
  icon: ReactNode
  description: string
  category: string
  color: string
}

const blockTypes: BlockType[] = [
  // Core Instruction Blocks
  {
    type: 'role_definition',
    label: 'Role Definition',
    icon: <Users className="h-5 w-5" />,
    description: 'Define AI assistant role and expertise',
    category: 'core',
    color: 'from-blue-500 to-blue-600',
  },
  {
    type: 'context_setting',
    label: 'Context Setting',
    icon: <Globe className="h-5 w-5" />,
    description: 'Set conversation context and background',
    category: 'core',
    color: 'from-purple-500 to-purple-600',
  },
  {
    type: 'output_format',
    label: 'Output Format',
    icon: <FileText className="h-5 w-5" />,
    description: 'Specify response format and structure',
    category: 'core',
    color: 'from-green-500 to-green-600',
  },

  // Educational Blocks
  {
    type: 'goal_setting',
    label: 'Goal Setting',
    icon: <Target className="h-5 w-5" />,
    description: 'Set SMART learning goals',
    category: 'education',
    color: 'from-orange-500 to-orange-600',
  },
  {
    type: 'learning_style',
    label: 'Learning Style',
    icon: <Brain className="h-5 w-5" />,
    description: 'Customize learning approach',
    category: 'education',
    color: 'from-pink-500 to-pink-600',
  },
  {
    type: 'subject_focus',
    label: 'Subject Focus',
    icon: <Book className="h-5 w-5" />,
    description: 'Subject specific instructions',
    category: 'education',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    type: 'difficulty_level',
    label: 'Difficulty Level',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Set appropriate complexity level',
    category: 'education',
    color: 'from-yellow-500 to-yellow-600',
  },

  // Behavior & Style Blocks
  {
    type: 'communication_style',
    label: 'Communication Style',
    icon: <MessageCircle className="h-5 w-5" />,
    description: 'Set tone and communication approach',
    category: 'behavior',
    color: 'from-teal-500 to-teal-600',
  },
  {
    type: 'feedback_style',
    label: 'Feedback Style',
    icon: <MessageSquare className="h-5 w-5" />,
    description: 'Customize feedback approach',
    category: 'behavior',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    type: 'personality_traits',
    label: 'Personality',
    icon: <Heart className="h-5 w-5" />,
    description: 'Add personality characteristics',
    category: 'behavior',
    color: 'from-rose-500 to-rose-600',
  },

  // Workflow & Process Blocks
  {
    type: 'step_by_step',
    label: 'Step-by-Step',
    icon: <Workflow className="h-5 w-5" />,
    description: 'Break down into sequential steps',
    category: 'workflow',
    color: 'from-violet-500 to-violet-600',
  },
  {
    type: 'time_management',
    label: 'Time Management',
    icon: <Clock className="h-5 w-5" />,
    description: 'Plan study schedule and timing',
    category: 'workflow',
    color: 'from-amber-500 to-amber-600',
  },
  {
    type: 'prioritization',
    label: 'Prioritization',
    icon: <Star className="h-5 w-5" />,
    description: 'Set priorities and importance levels',
    category: 'workflow',
    color: 'from-emerald-500 to-emerald-600',
  },

  // Advanced Features
  {
    type: 'conditional_logic',
    label: 'Conditional Logic',
    icon: <Filter className="h-5 w-5" />,
    description: 'Add if-then conditional responses',
    category: 'advanced',
    color: 'from-gray-500 to-gray-600',
  },
  {
    type: 'creative_thinking',
    label: 'Creative Thinking',
    icon: <Lightbulb className="h-5 w-5" />,
    description: 'Encourage creative problem solving',
    category: 'advanced',
    color: 'from-lime-500 to-lime-600',
  },
  {
    type: 'error_handling',
    label: 'Error Handling',
    icon: <AlertTriangle className="h-5 w-5" />,
    description: 'Handle mistakes and corrections',
    category: 'advanced',
    color: 'from-red-500 to-red-600',
  },

  // Career & Life Planning
  {
    type: 'career_planning',
    label: 'Career Planning',
    icon: <Compass className="h-5 w-5" />,
    description: 'Career development guidance',
    category: 'planning',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    type: 'skill_assessment',
    label: 'Skill Assessment',
    icon: <CheckCircle className="h-5 w-5" />,
    description: 'Evaluate current skills and gaps',
    category: 'planning',
    color: 'from-green-600 to-teal-600',
  },
]

const categories = [
  { id: 'all', label: 'All Blocks', icon: <Layers className="h-4 w-4" /> },
  { id: 'core', label: 'Core', icon: <Settings className="h-4 w-4" /> },
  { id: 'education', label: 'Education', icon: <Book className="h-4 w-4" /> },
  { id: 'behavior', label: 'Behavior', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'workflow', label: 'Workflow', icon: <Workflow className="h-4 w-4" /> },
  { id: 'advanced', label: 'Advanced', icon: <Zap className="h-4 w-4" /> },
  { id: 'planning', label: 'Planning', icon: <Target className="h-4 w-4" /> },
]

interface BlockPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddNode: (type: string) => void
}

export function BlockPickerModal({ open, onOpenChange, onAddNode }: BlockPickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const filteredBlocks = selectedCategory === 'all'
    ? blockTypes
    : blockTypes.filter(block => block.category === selectedCategory)

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container)
      return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    setShowScrollButtons(scrollWidth > clientWidth)
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container)
      return

    const containerWidth = container.clientWidth
    const scrollAmount = Math.min(containerWidth * 0.8, 280) // 滚动80%的可见宽度，最多280px
    const newScrollLeft = direction === 'left'
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : Math.min(container.scrollWidth - containerWidth, container.scrollLeft + scrollAmount)

    // 使用更丝滑的滚动动画
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })

    // 滚动完成后更新按钮状态
    setTimeout(checkScrollButtons, 350)
  }

  useEffect(() => {
    // 延迟检查，确保DOM完全渲染
    const timer = setTimeout(() => {
      checkScrollButtons()
    }, 100)

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        clearTimeout(timer)
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }

    return () => clearTimeout(timer)
  }, [open])

  // 当选中的分类改变时也重新检查
  useEffect(() => {
    const timer = setTimeout(checkScrollButtons, 50)
    return () => clearTimeout(timer)
  }, [selectedCategory])

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
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Add Instruction Block</DialogTitle>
          <p className="text-muted-foreground text-sm">Choose a block type to add to your prompt</p>
        </DialogHeader>

        {/* Category Filter */}
        <div className="relative border-b border-border pb-2">
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scroll-smooth custom-scroll"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
            }}
          >
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>

          {/* Scroll buttons */}
          {(showScrollButtons || true) && (
            <>
              <button
                onClick={() => scroll('left')}
                className={`cursor-pointer absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background via-background/80 to-transparent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-out z-10 rounded-l transform hover:scale-110 active:scale-95 active:bg-muted/70 ${
                  !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:shadow-lg hover:shadow-foreground/10'
                }`}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-200 hover:translate-x-[-1px]" />
              </button>
              <button
                onClick={() => scroll('right')}
                className={`cursor-pointer absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-out z-10 rounded-r transform hover:scale-110 active:scale-95 active:bg-muted/70 ${
                  !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:shadow-lg hover:shadow-foreground/10'
                }`}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-4 w-4 transition-transform duration-200 hover:translate-x-[1px]" />
              </button>
            </>
          )}
        </div>

        {/* Enhanced scrolling styles */}
        <style jsx>
          {`
          .custom-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
            scroll-behavior: smooth;
            scroll-snap-type: x proximity;
          }
          .custom-scroll::-webkit-scrollbar {
            display: none;
          }
          .custom-scroll button {
            scroll-snap-align: start;
          }
          
          /* Smooth button animations */
          button:active {
            transform: scale(0.95);
            transition: transform 0.1s ease-out;
          }
        `}
        </style>

        {/* Blocks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 overflow-y-auto scrollbar">
          {filteredBlocks.map(block => (
            <div
              key={block.type}
              className="group relative overflow-hidden flex flex-col items-center gap-3 p-4 border border-border rounded-xl hover:bg-muted/50 hover:border-border/80 cursor-pointer transition-all duration-300 transform hover:scale-105"
              draggable
              onDragStart={e => handleDragStart(e, block.type)}
              onClick={() => handleClick(block.type)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${block.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${block.color} bg-opacity-10 border border-border group-hover:border-border/80 transition-all duration-300`}>
                <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {block.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-1">
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {block.label}
                </h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  {block.description}
                </p>
              </div>

              {/* Drag Indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                <div className="grid grid-cols-2 gap-0.5">
                  {[...Array.from({ length: 4 })].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-muted-foreground rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="px-4 py-3 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground text-center">
            💡 Click to add instantly or drag to position on canvas
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
