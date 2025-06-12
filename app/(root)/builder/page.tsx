'use client'

import { FlowCanvas } from '@/components/flow-canvas'
import { useBuilderStore } from '@/store/builder'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { mockInstructions } from '../my-instructions/_components/instruction-grid'
import { PromptPreview } from './_components/prompt-preview'
import { Toolbar } from './_components/toolbar'

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
              title: `Copy of ${template.title}`,
              description: template.description,
              content: template.content || '',
              tags: [],
              isTemplate: false,
              sourceId: templateId,
            })

            // Update store with title and description
            setTitle(`Copy of ${template.title}`)
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
      const instruction = mockInstructions.find(i => i.id === instructionId)
      if (instruction) {
        setBuilderState({
          title: `Copy of ${instruction.title}`,
          description: instruction.description,
          content: instruction.content,
          tags: instruction.tags,
          isTemplate: false,
          sourceId: instructionId,
        })

        // Update store
        setTitle(`Copy of ${instruction.title}`)
        setDescription(instruction.description)
      }
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
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-black">
      <div className="flex-none px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="h-6 w-px bg-gray-800" />
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Untitled Instruction"
              value={builderState.title}
              onChange={e => setBuilderState(prev => ({ ...prev, title: e.target.value }))}
              className="bg-transparent text-lg font-medium text-white border-none focus:outline-none w-full truncate"
            />
            <input
              type="text"
              placeholder="Add a description..."
              value={builderState.description}
              onChange={e => setBuilderState(prev => ({ ...prev, description: e.target.value }))}
              className="bg-transparent text-sm text-gray-400 border-none focus:outline-none w-full mt-0.5 truncate"
            />
          </div>
        </div>
      </div>
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas className="flex-1 h-full" />
        <div
          className="w-1 hover:w-2 bg-gray-800 cursor-col-resize transition-all hover:bg-gray-700 active:bg-gray-600"
          onMouseDown={handleMouseDown}
        />
        <PromptPreview
          className="overflow-y-hidden border-l border-gray-800"
          style={{ width: previewWidth }}
        />
      </div>
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
