'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { templateData } from '../../_components/template-list'

interface RelatedTemplatesProps {
  currentTemplateId: string
  category: string
}

export function RelatedTemplates({ currentTemplateId, category }: RelatedTemplatesProps) {
  const router = useRouter()

  const relatedTemplates = templateData
    .filter(template => template.category === category && template.id !== currentTemplateId)
    .slice(0, 3)

  if (relatedTemplates.length === 0) {
    return null
  }

  return (
    <Card className="bg-zinc-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Related Templates</CardTitle>

        <div className="mt-4 space-y-4">
          {relatedTemplates.map(template => (
            <div
              key={template.id}
              className="p-3 bg-zinc-950/30 rounded-md border border-gray-800 hover:border-gray-700 cursor-pointer transition-colors"
              onClick={() => router.push(`/templates/${template.id}`)}
            >
              <h3 className="text-base font-medium text-gray-200">{template.title}</h3>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{template.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full mt-2 border-gray-800 text-gray-300 hover:border-gray-700 cursor-pointer"
            onClick={() => router.push('/templates')}
          >
            View All Templates
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
