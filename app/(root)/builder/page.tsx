'use client'

import { FlowCanvas } from '@/components/flow-canvas'
import { NavBar } from '@/components/nav-bar'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { mockInstructions } from '../my-instructions/_components/instruction-grid'
import { templateData } from '../templates/_components/template-list'
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
  const [builderState, setBuilderState] = useState<BuilderState>({
    title: '',
    description: '',
    content: '',
    tags: [],
    isTemplate: false,
    sourceId: null,
  })

  useEffect(() => {
    const templateId = searchParams.get('template')
    const instructionId = searchParams.get('instruction')

    if (templateId) {
      const template = templateData.find(t => t.id === templateId)
      if (template) {
        setBuilderState({
          title: `Copy of ${template.title}`,
          description: template.description,
          content: template.content || '',
          tags: [],
          isTemplate: false,
          sourceId: templateId,
        })
      }
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
      }
    }
  }, [searchParams])

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-black">
      <NavBar />
      <div className="flex-none px-4 py-3 border-b border-gray-800">
        <input
          type="text"
          placeholder="Untitled Instruction"
          value={builderState.title}
          onChange={e => setBuilderState(prev => ({ ...prev, title: e.target.value }))}
          className="bg-transparent text-xl font-semibold text-white border-none focus:outline-none w-full"
        />
        <input
          type="text"
          placeholder="Add a description..."
          value={builderState.description}
          onChange={e => setBuilderState(prev => ({ ...prev, description: e.target.value }))}
          className="bg-transparent text-sm text-gray-400 border-none focus:outline-none w-full mt-1"
        />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas className="flex-1 h-full" />
        <PromptPreview
          className="w-80 border-l border-gray-800 overflow-y-auto"
          content={builderState.content}
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
