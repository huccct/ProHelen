'use client'

import type { ExtractedBlock, SuggestedEnhancement } from '@/types/builder'
import { ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'
import { PromptAnalyzer } from './prompt-analyzer'

export function AnalyzeMode({
  siteName,
  onBackClick,
  onAnalysisComplete,
  onSwitchToAdvanced,
}: {
  siteName: string
  onBackClick: (e: React.MouseEvent) => void
  onAnalysisComplete: (blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => void
  onSwitchToAdvanced: () => void
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted cursor-pointer"
            onClick={onBackClick}
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold">{siteName}</span>
          </div>
          <div />
        </div>
      </div>
      <div className="pt-20">
        <PromptAnalyzer
          onAnalysisComplete={onAnalysisComplete}
          onSwitchToAdvanced={onSwitchToAdvanced}
        />
      </div>
    </div>
  )
}
