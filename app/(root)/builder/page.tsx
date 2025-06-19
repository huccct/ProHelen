'use client'

import { FlowCanvas } from '@/components/flow-canvas'
import { HelpPanel } from '@/components/help-panel'
import { OnboardingTour } from '@/components/onboarding-tour'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBuilderStore } from '@/store/builder'
import { ArrowLeft, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'

import { PromptPreview } from './_components/prompt-preview'

interface BuilderState {
  title: string
  description: string
  content: string
  tags: string[]
  isTemplate: boolean
  sourceId: string | null
}

function BuilderContent() {
  const searchParams = useSearchParams()
  const importFlowData = useBuilderStore(state => state.importFlowData)
  const setTitle = useBuilderStore(state => state.setTitle)
  const setDescription = useBuilderStore(state => state.setDescription)
  const resetFlow = useBuilderStore(state => state.resetFlow)
  const undo = useBuilderStore(state => state.undo)
  const redo = useBuilderStore(state => state.redo)
  const canUndo = useBuilderStore(state => state.canUndo)
  const canRedo = useBuilderStore(state => state.canRedo)
  const [builderState, setBuilderState] = useState<BuilderState>({
    title: '',
    description: '',
    content: '',
    tags: [],
    isTemplate: false,
    sourceId: null,
  })
  const [previewWidth, setPreviewWidth] = useState(320)
  const [isDragging, setIsDragging] = useState(false)
  const [showHelpPanel, setShowHelpPanel] = useState(false)
  const [showOnboardingTour, setShowOnboardingTour] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newWidth = window.innerWidth - e.clientX
      setPreviewWidth(Math.max(280, Math.min(600, newWidth)))
    }
  }, [isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Check if user is new and should see onboarding
  useEffect(() => {
    const tourCompleted = localStorage.getItem('prohelen-tour-completed')
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    // Show tour for new users who aren't importing something
    if (!tourCompleted && !hasTemplate && !hasInstruction) {
      setTimeout(() => setShowOnboardingTour(true), 1000)
    }
  }, [searchParams])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 for help
      if (e.key === 'F1') {
        e.preventDefault()
        setShowHelpPanel(true)
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        setShowHelpPanel(false)
        setShowOnboardingTour(false)
      }

      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) {
          undo()
        }
      }

      // Ctrl+Y for redo (or Ctrl+Shift+Z)
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        if (canRedo()) {
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  useEffect(() => {
    const templateId = searchParams.get('template')
    const instructionId = searchParams.get('instruction')

    if (templateId) {
      // Fetch template from API
      fetch(`/api/templates/${templateId}`)
        .then(res => res.json())
        .then((template) => {
          if (template) {
            // Update builder state
            setBuilderState({
              title: template.title,
              description: template.description,
              content: template.content || '',
              tags: [],
              isTemplate: false,
              sourceId: templateId,
            })

            // Update store with title and description
            setTitle(template.title)
            setDescription(template.description)

            // Import flow data if available
            if (template.flowData) {
              importFlowData(template.flowData)
            }
          }
        })
        .catch(console.error)
    }
    else if (instructionId) {
      // Fetch instruction from API
      fetch(`/api/instructions/${instructionId}`)
        .then(res => res.json())
        .then((data) => {
          if (data.instruction) {
            const instruction = data.instruction
            setBuilderState({
              title: `Copy of ${instruction.title}`,
              description: instruction.description || '',
              content: instruction.content || '',
              tags: instruction.tags || [],
              isTemplate: false,
              sourceId: instructionId,
            })

            // Update store
            setTitle(`Copy of ${instruction.title}`)
            setDescription(instruction.description || '')

            // Import flow data if available
            if (instruction.flowData) {
              importFlowData(instruction.flowData)
            }
          }
        })
        .catch(console.error)
    }
    else {
      // No query parameters, reset to fresh state
      setBuilderState({
        title: '',
        description: '',
        content: '',
        tags: [],
        isTemplate: false,
        sourceId: null,
      })

      // Reset store and flow data
      resetFlow()
    }
  }, [searchParams, importFlowData, setTitle, setDescription, resetFlow])

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-background">
      <div className="flex-none px-4 py-3 border-b border-border">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex-1 min-w-0" data-tour="title-input">
            <input
              type="text"
              placeholder="Untitled Instruction"
              value={builderState.title}
              onChange={e => setBuilderState(prev => ({ ...prev, title: e.target.value }))}
              className="bg-transparent text-lg font-medium text-foreground border-none focus:outline-none w-full truncate"
            />
            <input
              type="text"
              placeholder="Add a description..."
              value={builderState.description}
              onChange={e => setBuilderState(prev => ({ ...prev, description: e.target.value }))}
              className="bg-transparent text-sm text-muted-foreground border-none focus:outline-none w-full mt-0.5 truncate"
            />
          </div>

          {/* Help Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpPanel(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get help and shortcuts</p>
              <p className="text-xs text-muted-foreground mt-1">Press F1 or click for help</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas
          className="flex-1 h-full"
          onStartTour={() => setShowOnboardingTour(true)}
          onShowHelp={() => setShowHelpPanel(true)}
        />
        <div
          className="w-1 hover:w-2 bg-border cursor-col-resize transition-all hover:bg-border/80 active:bg-border/60"
          onMouseDown={handleMouseDown}
        />
        <PromptPreview
          className="overflow-y-hidden border-l border-border"
          style={{ width: previewWidth }}
          data-tour="preview-panel"
        />
      </div>

      {/* Help Panel */}
      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        onStartTour={() => {
          setShowHelpPanel(false)
          setShowOnboardingTour(true)
        }}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboardingTour}
        onClose={() => setShowOnboardingTour(false)}
        onComplete={() => {
          setShowOnboardingTour(false)
          // Could save completion status to localStorage
          localStorage.setItem('prohelen-tour-completed', 'true')
        }}
      />
    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense>
      <BuilderContent />
    </Suspense>
  )
}
