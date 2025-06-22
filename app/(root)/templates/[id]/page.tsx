'use client'

import type { Template } from '../_components/template-list'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { notFound, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RelatedTemplates } from './_components/related-templates'
import { TemplateDetails } from './_components/template-details'
import { TemplatePreview } from './_components/template-preview'
import { TemplateRating } from './_components/template-rating'

export default function TemplateDetailPage({ params }: { params: any }) {
  const { t } = useTranslation()
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const unwrappedParams = React.use(params) as { id: string }
  const id = unwrappedParams.id

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/templates/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error('Failed to fetch template')
        }

        const templateData = await response.json()
        setTemplate(templateData)
      }
      catch (err) {
        setError(err instanceof Error ? err.message : t('templateDetail.error'))
      }
      finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  if (!loading && !template && !error) {
    notFound()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
          <NavBar />
        </div>
        <main className="container mx-auto px-4 py-8 pt-28">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t('templateDetail.tryAgain')}
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <NavBar />
      </div>

      <main className="container mx-auto px-4 py-8 pt-28">
        {loading
          ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">{t('templateDetail.loading')}</div>
              </div>
            )
          : template
            ? (
                <div className="flex flex-col space-y-8">
                  <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
                    <div>
                      <button
                        onClick={() => router.back()}
                        className="flex items-center text-muted-foreground hover:text-foreground mb-3 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        {t('templateDetail.backToTemplates')}
                      </button>
                      <h1 className="text-3xl font-bold">{template.title}</h1>
                      <p className="text-muted-foreground mt-2">{template.category}</p>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => window.open(`mailto:?subject=Check out this template&body=I found this great template on ProHelen: ${template.title}`)}
                      >
                        {t('templateDetail.share')}
                      </Button>
                      <Button
                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => router.push(`/builder?template=${template.id}`)}
                      >
                        {t('templateDetail.useTemplate')}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <TemplateDetails template={template} />
                      <TemplatePreview template={template} />
                      <TemplateRating
                        templateId={template.id}
                        currentRating={template.rating}
                        ratingCount={template.ratingCount}
                      />
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
