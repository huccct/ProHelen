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
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Star,
  Target,
  Users,
  Workflow,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BlockType {
  type: string
  labelKey: string
  icon: ReactNode
  descriptionKey: string
  category: string
  color: string
}

const blockTypes: BlockType[] = [
  // 1. Role & Context - Define AI's identity, background, and working environment
  {
    type: 'role_definition',
    labelKey: 'builder.components.blockPicker.blocks.roleDefinition.label',
    icon: <Users className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.roleDefinition.description',
    category: 'role_context',
    color: 'from-blue-500 to-blue-600',
  },
  {
    type: 'context_setting',
    labelKey: 'builder.components.blockPicker.blocks.contextSetting.label',
    icon: <Globe className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.contextSetting.description',
    category: 'role_context',
    color: 'from-purple-500 to-purple-600',
  },
  {
    type: 'personality_traits',
    labelKey: 'builder.components.blockPicker.blocks.personalityTraits.label',
    icon: <Heart className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.personalityTraits.description',
    category: 'role_context',
    color: 'from-rose-500 to-rose-600',
  },
  {
    type: 'subject_focus',
    labelKey: 'builder.components.blockPicker.blocks.subjectFocus.label',
    icon: <Book className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.subjectFocus.description',
    category: 'role_context',
    color: 'from-indigo-500 to-indigo-600',
  },

  // 2. Interaction Style - Communication patterns and feedback approaches
  {
    type: 'communication_style',
    labelKey: 'builder.components.blockPicker.blocks.communicationStyle.label',
    icon: <MessageCircle className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.communicationStyle.description',
    category: 'interaction_style',
    color: 'from-teal-500 to-teal-600',
  },
  {
    type: 'feedback_style',
    labelKey: 'builder.components.blockPicker.blocks.feedbackStyle.label',
    icon: <MessageSquare className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.feedbackStyle.description',
    category: 'interaction_style',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    type: 'learning_style',
    labelKey: 'builder.components.blockPicker.blocks.learningStyle.label',
    icon: <Brain className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.learningStyle.description',
    category: 'interaction_style',
    color: 'from-pink-500 to-pink-600',
  },

  // 3. Task Control - Goal setting, output formatting, and task management
  {
    type: 'goal_setting',
    labelKey: 'builder.components.blockPicker.blocks.goalSetting.label',
    icon: <Target className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.goalSetting.description',
    category: 'task_control',
    color: 'from-orange-500 to-orange-600',
  },
  {
    type: 'output_format',
    labelKey: 'builder.components.blockPicker.blocks.outputFormat.label',
    icon: <FileText className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.outputFormat.description',
    category: 'task_control',
    color: 'from-green-500 to-green-600',
  },
  {
    type: 'difficulty_level',
    labelKey: 'builder.components.blockPicker.blocks.difficultyLevel.label',
    icon: <BarChart3 className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.difficultyLevel.description',
    category: 'task_control',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    type: 'time_management',
    labelKey: 'builder.components.blockPicker.blocks.timeManagement.label',
    icon: <Clock className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.timeManagement.description',
    category: 'task_control',
    color: 'from-amber-500 to-amber-600',
  },
  {
    type: 'prioritization',
    labelKey: 'builder.components.blockPicker.blocks.prioritization.label',
    icon: <Star className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.prioritization.description',
    category: 'task_control',
    color: 'from-emerald-500 to-emerald-600',
  },

  // 4. Thinking & Logic - Cognitive processes and reasoning patterns
  {
    type: 'creative_thinking',
    labelKey: 'builder.components.blockPicker.blocks.creativeThinking.label',
    icon: <Lightbulb className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.creativeThinking.description',
    category: 'thinking_logic',
    color: 'from-lime-500 to-lime-600',
  },
  {
    type: 'step_by_step',
    labelKey: 'builder.components.blockPicker.blocks.stepByStep.label',
    icon: <Workflow className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.stepByStep.description',
    category: 'thinking_logic',
    color: 'from-violet-500 to-violet-600',
  },
  {
    type: 'conditional_logic',
    labelKey: 'builder.components.blockPicker.blocks.conditionalLogic.label',
    icon: <Filter className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.conditionalLogic.description',
    category: 'thinking_logic',
    color: 'from-gray-500 to-gray-600',
  },
  {
    type: 'error_handling',
    labelKey: 'builder.components.blockPicker.blocks.errorHandling.label',
    icon: <AlertTriangle className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.errorHandling.description',
    category: 'thinking_logic',
    color: 'from-red-500 to-red-600',
  },

  // 5. Skills & Development - Professional growth and skill assessment
  {
    type: 'career_planning',
    labelKey: 'builder.components.blockPicker.blocks.careerPlanning.label',
    icon: <Compass className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.careerPlanning.description',
    category: 'skills_development',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    type: 'skill_assessment',
    labelKey: 'builder.components.blockPicker.blocks.skillAssessment.label',
    icon: <CheckCircle className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.skillAssessment.description',
    category: 'skills_development',
    color: 'from-green-600 to-teal-600',
  },
]

const categories = [
  { id: 'quick-start', labelKey: 'builder.components.blockPicker.categories.quickStart' },
  { id: 'all', labelKey: 'builder.components.blockPicker.categories.all' },
  { id: 'role_context', labelKey: 'builder.components.blockPicker.categories.roleContext' },
  { id: 'interaction_style', labelKey: 'builder.components.blockPicker.categories.interactionStyle' },
  { id: 'task_control', labelKey: 'builder.components.blockPicker.categories.taskControl' },
  { id: 'thinking_logic', labelKey: 'builder.components.blockPicker.categories.thinkingLogic' },
  { id: 'skills_development', labelKey: 'builder.components.blockPicker.categories.skillsDevelopment' },
]

const quickStartTemplates = [
  {
    id: 'tutor',
    labelKey: 'builder.components.blockPicker.quickStart.tutor.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.tutor.description',
    icon: <Brain className="h-5 w-5" />,
    blocks: ['role_definition', 'context_setting', 'learning_style', 'goal_setting', 'step_by_step'],
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'business_consultant',
    labelKey: 'builder.components.blockPicker.quickStart.businessConsultant.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.businessConsultant.description',
    icon: <Target className="h-5 w-5" />,
    blocks: ['role_definition', 'context_setting', 'communication_style', 'output_format', 'prioritization'],
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'creative_assistant',
    labelKey: 'builder.components.blockPicker.quickStart.creativeAssistant.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.creativeAssistant.description',
    icon: <Lightbulb className="h-5 w-5" />,
    blocks: ['role_definition', 'personality_traits', 'creative_thinking', 'output_format', 'feedback_style'],
    color: 'from-orange-500 to-pink-500',
  },
  {
    id: 'step_by_step_guide',
    labelKey: 'builder.components.blockPicker.quickStart.stepByStepGuide.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.stepByStepGuide.description',
    icon: <Workflow className="h-5 w-5" />,
    blocks: ['role_definition', 'context_setting', 'step_by_step', 'output_format', 'error_handling'],
    color: 'from-purple-500 to-indigo-500',
  },
]

interface BlockPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddNode: (type: string) => void
  onAddQuickStartTemplate?: (templateId: string) => void
}

export function BlockPickerModal({ open, onOpenChange, onAddNode, onAddQuickStartTemplate }: BlockPickerModalProps) {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('quick-start')
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const filteredBlocks = selectedCategory === 'all'
    ? blockTypes
    : blockTypes.filter(block => block.category === selectedCategory)

  const handleQuickStartTemplate = (template: typeof quickStartTemplates[0]) => {
    if (onAddQuickStartTemplate) {
      onAddQuickStartTemplate(template.id)
    }
    else {
      template.blocks.forEach((blockType, index) => {
        setTimeout(() => {
          onAddNode(blockType)
        }, index * 200)
      })
    }
    onOpenChange(false)
  }

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
    const scrollAmount = Math.min(containerWidth * 0.8, 280)
    const newScrollLeft = direction === 'left'
      ? Math.max(0, container.scrollLeft - scrollAmount)
      : Math.min(container.scrollWidth - containerWidth, container.scrollLeft + scrollAmount)

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    })

    setTimeout(checkScrollButtons, 350)
  }

  useEffect(() => {
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
          <DialogTitle className="text-foreground text-xl">{t('builder.components.blockPicker.title')}</DialogTitle>
          <p className="text-muted-foreground text-sm">{t('builder.components.blockPicker.description')}</p>
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
                variant={selectedCategory === category.id
                  ? 'default'
                  : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {t(category.labelKey)}
              </Button>
            ))}
          </div>

          {/* Scroll buttons */}
          {(showScrollButtons || true) && (
            <>
              <button
                onClick={() => scroll('left')}
                className={`cursor-pointer absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background via-background/80 to-transparent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-out z-10 rounded-l transform hover:scale-110 active:scale-95 active:bg-muted/70 ${
                  !canScrollLeft
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-80 hover:opacity-100 hover:shadow-lg hover:shadow-foreground/10'
                }`}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-200 hover:translate-x-[-1px]" />
              </button>
              <button
                onClick={() => scroll('right')}
                className={`cursor-pointer absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-out z-10 rounded-r transform hover:scale-110 active:scale-95 active:bg-muted/70 ${
                  !canScrollRight
                    ? 'opacity-30 cursor-not-allowed'
                    : 'opacity-80 hover:opacity-100 hover:shadow-lg hover:shadow-foreground/10'
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

        {/* Content Area */}
        <div className="overflow-y-auto scrollbar">
          {selectedCategory === 'quick-start'
            ? (
          /* Quick Start Templates */
                <div className="p-4 space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t('builder.components.blockPicker.quickStart.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('builder.components.blockPicker.quickStart.subtitle')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickStartTemplates.map(template => (
                      <div
                        key={template.id}
                        className="group relative overflow-hidden flex flex-col gap-4 p-6 border border-border rounded-xl hover:bg-muted/50 hover:border-primary/50 cursor-pointer transition-all duration-300 transform hover:scale-105"
                        onClick={() => handleQuickStartTemplate(template)}
                      >
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} bg-opacity-10 border border-border group-hover:border-primary/20 transition-all duration-300`}>
                            <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              {template.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                              {t(template.labelKey)}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-tight">
                              {t(template.descriptionKey)}
                            </p>
                          </div>
                        </div>

                        {/* Block Preview */}
                        <div className="flex flex-wrap gap-2">
                          {template.blocks.map((blockType, _index) => {
                            const block = blockTypes.find(b => b.type === blockType)
                            if (!block)
                              return null
                            return (
                              <div
                                key={blockType}
                                className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  {block.icon}
                                </div>
                                <span>{t(block.labelKey)}</span>
                              </div>
                            )
                          })}
                        </div>

                        {/* Quick Start Badge */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                            {t('builder.components.blockPicker.quickStart.addAll')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            : (
          /* Regular Blocks Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
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
                          {t(block.labelKey)}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {t(block.descriptionKey)}
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
              )}
        </div>

        {/* Help Text */}
        <div className="px-4 py-3 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground text-center">
            💡
            {' '}
            {t('builder.components.blockPicker.helpText')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
