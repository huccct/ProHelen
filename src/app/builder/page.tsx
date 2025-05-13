'use client'

import { FlowCanvas } from '@/components/flow-canvas'
import { NavBar } from '@/components/nav-bar'
import { NodeSidebar } from './_components/node-sidebar'
import { PromptPreview } from './_components/prompt-preview'

export default function BuilderPage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <NavBar />
      <div className="flex flex-1">
        <NodeSidebar className="w-64 border-r border-gray-800" />
        <FlowCanvas className="flex-1 h-full" />
        <PromptPreview className="w-80 border-l border-gray-800" />
      </div>
    </div>
  )
}
