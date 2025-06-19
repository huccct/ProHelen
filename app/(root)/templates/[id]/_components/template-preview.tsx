'use client'

import type { Template } from '../../_components/template-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TemplatePreviewProps {
  template: Template
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Template Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-md border border-border font-mono text-sm text-foreground whitespace-pre-wrap overflow-auto max-h-[400px] scrollbar">
          {template.content || (
            <div className="text-muted-foreground">No template content available for preview.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
