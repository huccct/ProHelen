'use client'

import type { Template } from '@/types/templates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

interface TemplatePreviewProps {
  template: Template
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  const { t } = useTranslation()

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">{t('templateDetail.templatePreview')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-md border border-border font-mono text-sm text-foreground whitespace-pre-wrap overflow-auto max-h-[400px] scrollbar">
          {template.content || (
            <div className="text-muted-foreground">{t('templateDetail.noPreviewContent')}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
