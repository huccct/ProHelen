'use client'

import type { ExtractedBlock, SuggestedEnhancement } from '@/types/builder'
import { useAppSettings } from '@/components/common/app-settings-context'
import { FlowCanvas } from '@/components/flow-canvas'
import { HelpPanel } from '@/components/help-panel'
import { OnboardingTour } from '@/components/onboarding-tour'
import { STORAGE_KEYS } from '@/lib/constants'
import { useAutoSave } from '@/lib/hooks/use-auto-save'
import { useDataLoader } from '@/lib/hooks/use-data-loader'
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts'
import { usePreviewResize } from '@/lib/hooks/use-preview-resize'
import { useBuilderStore } from '@/store/builder'
import * as Sentry from '@sentry/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AnalyzeMode } from './analyze-mode'
import { BuilderHeader } from './builder-header'
import { PromptPreview } from './prompt-preview'
import { SaveDialog } from './save-dialog'

type InterfaceMode = 'advanced' | 'analyze'
type SaveDialogAction = 'back' | 'analyze'

export function BuilderContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { siteName } = useAppSettings()

  const {
    title,
    description,
    setTitle,
    setDescription,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDraft,
    hasPendingChanges,
    applyAnalysisResults,
  } = useBuilderStore()

  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('analyze')
  const [showHelpPanel, setShowHelpPanel] = useState(false)
  const [showOnboardingTour, setShowOnboardingTour] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveDialogAction, setSaveDialogAction] = useState<SaveDialogAction>('back')

  const { previewWidth, handleMouseDown } = usePreviewResize()
  const { isExistingContent } = useDataLoader()

  const hasPendingChangesValue = hasPendingChanges()
  useAutoSave(hasPendingChangesValue, isExistingContent, saveDraft)

  useEffect(() => {
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    if (hasTemplate || hasInstruction) {
      setInterfaceMode('advanced')
    }

    Sentry.addBreadcrumb({
      category: 'session',
      message: 'Builder session started',
      level: 'info',
      data: {
        mode: interfaceMode,
        hasTemplate: !!hasTemplate,
        hasInstruction: !!hasInstruction,
      },
    })
  }, [searchParams, interfaceMode])

  useEffect(() => {
    const tourCompleted = localStorage.getItem(STORAGE_KEYS.TOUR_COMPLETED)
    const hasTemplate = searchParams.get('template')
    const hasInstruction = searchParams.get('instruction')

    if (!tourCompleted && !hasTemplate && !hasInstruction) {
      const timer = setTimeout(() => setShowOnboardingTour(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  useKeyboardShortcuts({
    onShowHelp: () => setShowHelpPanel(true),
    onHideModals: () => {
      setShowHelpPanel(false)
      setShowOnboardingTour(false)
    },
    undo,
    redo,
    canUndo,
    canRedo,
  })

  const handleAnalysisComplete = useCallback((
    blocks: ExtractedBlock[],
    enhancements: SuggestedEnhancement[],
    userQuery?: string,
  ) => {
    const startTime = performance.now()

    applyAnalysisResults(blocks, enhancements, userQuery)

    const firstBlock = blocks.find(b => b.type === 'role_definition')
    setTitle(firstBlock?.content || t('builder.analyzer.defaults.defaultAssistantTitle'))
    setDescription(t('builder.analyzer.defaults.generatedByAnalysis'))
    setInterfaceMode('advanced')

    const endTime = performance.now()
    Sentry.captureMessage('Analysis Complete', {
      level: 'info',
      extra: {
        processingTime: endTime - startTime,
        blocksCount: blocks.length,
        enhancementsCount: enhancements.length,
        hasUserQuery: !!userQuery,
      },
    })
  }, [applyAnalysisResults, setTitle, setDescription, t])

  const handleSwitchToAdvanced = useCallback(() => {
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: 'Switched to advanced mode',
      level: 'info',
    })
    setInterfaceMode('advanced')
  }, [])

  const handleBackClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (hasPendingChangesValue && !isExistingContent) {
      setSaveDialogAction('back')
      setShowSaveDialog(true)
    }
    else {
      router.back()
    }
  }, [hasPendingChangesValue, isExistingContent, router])

  const handleSmartAnalysisClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (hasPendingChangesValue && !isExistingContent) {
      setSaveDialogAction('analyze')
      setShowSaveDialog(true)
    }
    else {
      setInterfaceMode('analyze')
    }
  }, [hasPendingChangesValue, isExistingContent])

  const handleSaveAndExit = useCallback(async () => {
    const startTime = performance.now()
    try {
      await saveDraft()
      const endTime = performance.now()

      Sentry.captureMessage('Draft Save Performance', {
        level: 'info',
        extra: {
          saveTime: endTime - startTime,
          action: saveDialogAction,
        },
      })

      toast.success(t('builder.draftTipDescription'))
      setShowSaveDialog(false)

      if (saveDialogAction === 'back') {
        router.back()
      }
      else {
        setInterfaceMode('analyze')
      }
    }
    catch (error) {
      Sentry.captureException(error, {
        extra: {
          action: 'save_draft',
          saveDialogAction,
        },
      })
    }
  }, [saveDraft, saveDialogAction, router, t])

  const handleDiscardAndExit = useCallback(() => {
    setShowSaveDialog(false)
    if (saveDialogAction === 'back') {
      router.back()
    }
    else {
      setInterfaceMode('analyze')
    }
  }, [saveDialogAction, router])

  if (interfaceMode === 'analyze') {
    return (
      <AnalyzeMode
        siteName={siteName}
        onBackClick={handleBackClick}
        onAnalysisComplete={handleAnalysisComplete}
        onSwitchToAdvanced={handleSwitchToAdvanced}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-background">
      <BuilderHeader
        title={title}
        description={description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onBackClick={handleBackClick}
        onSmartAnalysisClick={handleSmartAnalysisClick}
        onShowHelp={() => setShowHelpPanel(true)}
        siteName={siteName}
      />

      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas
          className="flex-1 h-full"
          onStartTour={() => setShowOnboardingTour(true)}
          onShowHelp={() => setShowHelpPanel(true)}
        />
        <div
          className="w-1 hover:w-2 bg-border cursor-col-resize transition-all hover:bg-border/80 active:bg-border/60"
          onMouseDown={handleMouseDown}
        />
        <PromptPreview
          className="overflow-y-hidden border-l border-border"
          style={{ width: previewWidth }}
          data-tour="preview-panel"
        />
      </div>

      <HelpPanel
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        onStartTour={() => {
          setShowHelpPanel(false)
          setShowOnboardingTour(true)
        }}
      />

      <OnboardingTour
        isOpen={showOnboardingTour}
        onClose={() => setShowOnboardingTour(false)}
        onComplete={() => {
          setShowOnboardingTour(false)
          localStorage.setItem(STORAGE_KEYS.TOUR_COMPLETED, 'true')
        }}
      />

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveAndExit}
        onDiscard={handleDiscardAndExit}
      />
    </div>
  )
}
