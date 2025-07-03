import type { Metadata } from 'next'
import type { Template } from '../_components/template-list'
import process from 'node:process'
import { notFound } from 'next/navigation'
import { TemplateDetailClient } from './template-detail-client'

async function getTemplate(id: string): Promise<Template | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/templates/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch template')
    }

    return await response.json()
  }
  catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const unwrappedParams = await params
  const id = unwrappedParams.id

  const template = await getTemplate(id)

  if (!template) {
    return {
      title: 'Template Not Found - ProHelen',
      description: 'The requested template could not be found.',
    }
  }

  const title = `${template.title} - ProHelen`
  const description = template.description

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://prohelen.dev'),
    openGraph: {
      title,
      description,
      url: `/templates/${id}`,
      type: 'article',
      siteName: 'ProHelen',
      images: [
        {
          url: 'https://cdn.jsdelivr.net/gh/huccct/picx-images-hosting@master/image.4g4rsmo6u6.webp',
          width: 1200,
          height: 630,
          alt: template.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://cdn.jsdelivr.net/gh/huccct/picx-images-hosting@master/image.4g4rsmo6u6.webp'],
    },
    alternates: {
      canonical: `/templates/${id}`,
    },
  }
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const unwrappedParams = await params
  const id = unwrappedParams.id

  const template = await getTemplate(id)

  if (!template) {
    notFound()
  }

  return <TemplateDetailClient template={template} />
}
