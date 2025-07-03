'use client'

import type { Template } from '../_components/template-list'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { getCategoryDisplayName } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { RelatedTemplates } from './_components/related-templates'
import { TemplateDetails } from './_components/template-details'
import { TemplatePreview } from './_components/template-preview'
import { TemplateRating } from './_components/template-rating'
// 如果需要客户端动态修改头部，可以使用：
// import { useEffect } from 'react'

interface TemplateDetailClientProps {
  template: Template
}

export function TemplateDetailClient({ template }: TemplateDetailClientProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://prohelen.dev'
  const imageUrl = `${baseUrl}/assets/icons/logo.png`
  const pageUrl = `${baseUrl}/templates/${template.id}`
  const title = `${template.title} - ProHelen`

  // 客户端动态修改头部的例子（不推荐用于SEO关键的metadata）
  // useEffect(() => {
  //   document.title = `${template.title} - ProHelen`
  //
  //   // 动态添加meta标签
  //   const metaDescription = document.querySelector('meta[name="description"]')
  //   if (metaDescription) {
  //     metaDescription.setAttribute('content', template.description)
  //   }
  // }, [template])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={template.description} />

        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={template.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="ProHelen" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ProHelen" />
        <meta name="twitter:creator" content="@ProHelen" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={template.description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta property="twitter:domain" content="prohelen.dev" />
        <meta property="twitter:url" content={pageUrl} />

        <link rel="canonical" href={pageUrl} />
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
          <NavBar />
        </div>

        <main className="container mx-auto px-4 py-8 pt-28">
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
                <p className="text-muted-foreground mt-2">{getCategoryDisplayName(template.category, t)}</p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    const tweetText = `🚀 ${template.title}\n\n${template.description}\n\n#ProHelen #AI #PromptEngineering`
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(pageUrl)}&via=ProHelen`
                    window.open(twitterUrl, '_blank', 'width=550,height=420,scrollbars=yes,resizable=yes')
                  }}
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
        </main>
      </div>
    </>
  )
}
