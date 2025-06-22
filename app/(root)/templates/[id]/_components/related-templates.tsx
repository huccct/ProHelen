'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Template {
  id: string
  title: string
  description: string
  category: string
}

interface RelatedTemplatesProps {
  currentTemplateId: string
  category: string
}

export function RelatedTemplates({ currentTemplateId, category }: RelatedTemplatesProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [relatedTemplates, setRelatedTemplates] = useState<Template[]>([])

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then((data) => {
        const templates = data.templates || []
        const filtered = templates
          .filter((template: Template) => template.category === category && template.id !== currentTemplateId)
          .slice(0, 3)
        setRelatedTemplates(filtered)
      })
      .catch(console.error)
  }, [currentTemplateId, category])

  if (relatedTemplates.length === 0) {
    return null
  }

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">{t('templateDetail.relatedTemplates')}</CardTitle>

        <div className="mt-4 space-y-4">
          {relatedTemplates.map(template => (
            <div
              key={template.id}
              className="p-3 bg-muted/30 rounded-md border border-border hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => router.push(`/templates/${template.id}`)}
            >
              <h3 className="text-base font-medium text-foreground">{template.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full mt-2 cursor-pointer"
            onClick={() => router.push('/templates')}
          >
            {t('templateDetail.viewAllTemplates')}
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
