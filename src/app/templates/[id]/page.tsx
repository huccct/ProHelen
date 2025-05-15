'use client'

import type { Template } from '../_components/template-list'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { notFound, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { templateData } from '../_components/template-list'
import { RelatedTemplates } from './_components/related-templates'
import { TemplateDetails } from './_components/template-details'
import { TemplatePreview } from './_components/template-preview'

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const unwrappedParams = React.use(params as any) as { id: string }
  const id = unwrappedParams.id

  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const foundTemplate = templateData.find(t => t.id === id)

    if (foundTemplate) {
      setTemplate(foundTemplate)
    }

    setLoading(false)
  }, [id])

  if (!loading && !template) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        {loading
          ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400">Loading template...</div>
              </div>
            )
          : template
            ? (
                <div className="flex flex-col space-y-8">
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                    <div>
                      <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-400 hover:text-white mb-3 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to templates
                      </button>
                      <h1 className="text-3xl font-bold">{template.title}</h1>
                      <p className="text-gray-400 mt-2">{template.category}</p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 cursor-pointer"
                        onClick={() => window.open(`mailto:?subject=Check out this template&body=I found this great template on ProHelen: ${template.title}`)}
                      >
                        Share
                      </Button>
                      <Button
                        className="cursor-pointer"
                        onClick={() => router.push(`/builder?template=${template.id}`)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <TemplateDetails template={template} />
                      <TemplatePreview template={template} />
                    </div>

                    <div className="space-y-6">
                      <RelatedTemplates
                        currentTemplateId={template.id}
                        category={template.category}
                      />
                    </div>
                  </div>
                </div>
              )
            : null}
      </main>
    </div>
  )
}
