'use client'

import type { Template } from '../../_components/template-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TemplatePreviewProps {
  template: Template
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <Card className="bg-zinc-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Template Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-zinc-950/50 p-4 rounded-md border border-gray-800 font-mono text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-[400px] scrollbar">
          {template.content || (
            <div className="text-gray-500">No template content available for preview.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
