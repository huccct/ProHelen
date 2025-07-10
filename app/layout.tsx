import type { Metadata } from 'next'
import Providers from '@/app/providers'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ProHelen',
  description: 'A Web-Based Tool for Customising LLM Behaviour Using Visual Instruction Generation',
  metadataBase: new URL('https://prohelen.dev'),
  openGraph: {
    title: 'ProHelen - Visual Instruction Generation for LLMs',
    description: 'Create, customize and share AI prompts with our visual instruction builder. Transform your ideas into powerful AI assistants.',
    url: 'https://prohelen.dev',
    siteName: 'ProHelen',
    type: 'website',
    images: [
      {
        url: '/assets/icons/logo.png',
        width: 1200,
        height: 630,
        alt: 'ProHelen - Visual Instruction Generation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProHelen - Visual Instruction Generation for LLMs',
    description: 'Create, customize and share AI prompts with our visual instruction builder.',
    images: ['/assets/icons/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
