'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  Book,
  HelpCircle,
  Keyboard,
  MessageCircle,
  PlayCircle,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface HelpPanelProps {
  isOpen: boolean
  onClose: () => void
  onStartTour: () => void
}

export function HelpPanel({ isOpen, onClose, onStartTour }: HelpPanelProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'guide' | 'shortcuts' | 'faq'>('guide')

  const shortcuts = [
    { key: 'Ctrl + Z', description: t('builder.components.helpPanel.shortcuts.undo') },
    { key: 'Ctrl + Y', description: t('builder.components.helpPanel.shortcuts.redo') },
    { key: 'F1', description: t('builder.components.helpPanel.shortcuts.openHelp') },
    { key: 'Escape', description: t('builder.components.helpPanel.shortcuts.closeDialogs') },
    { key: 'Click + Drag', description: t('builder.components.helpPanel.shortcuts.moveBlocks') },
    { key: 'Click block', description: t('builder.components.helpPanel.shortcuts.getSuggestions') },
    { key: 'Double click', description: t('builder.components.helpPanel.shortcuts.editBlock') },
    { key: 'Enter', description: t('builder.components.helpPanel.shortcuts.confirmDialogs') },
    { key: 'Mouse wheel', description: t('builder.components.helpPanel.shortcuts.zoom') },
  ]

  const faqs = [
    {
      question: t('builder.components.helpPanel.faqs.connections.question'),
      answer: t('builder.components.helpPanel.faqs.connections.answer'),
    },
    {
      question: t('builder.components.helpPanel.faqs.autoConnect.question'),
      answer: t('builder.components.helpPanel.faqs.autoConnect.answer'),
    },
    {
      question: t('builder.components.helpPanel.faqs.whyAutomatic.question'),
      answer: t('builder.components.helpPanel.faqs.whyAutomatic.answer'),
    },
    {
      question: t('builder.components.helpPanel.faqs.deleteBlock.question'),
      answer: t('builder.components.helpPanel.faqs.deleteBlock.answer'),
    },
    {
      question: t('builder.components.helpPanel.faqs.reuseBlocks.question'),
      answer: t('builder.components.helpPanel.faqs.reuseBlocks.answer'),
    },
    {
      question: t('builder.components.helpPanel.faqs.improvePrompts.question'),
      answer: t('builder.components.helpPanel.faqs.improvePrompts.answer'),
    },
  ]

  const blockGuide = [
    {
      category: t('builder.components.helpPanel.blockGuide.roleContext.title'),
      description: t('builder.components.helpPanel.blockGuide.roleContext.description'),
      blocks: [
        { name: t('builder.components.helpPanel.blockGuide.roleContext.blocks.roleDefinition.name'), use: t('builder.components.helpPanel.blockGuide.roleContext.blocks.roleDefinition.use') },
        { name: t('builder.components.helpPanel.blockGuide.roleContext.blocks.contextSetting.name'), use: t('builder.components.helpPanel.blockGuide.roleContext.blocks.contextSetting.use') },
        { name: t('builder.components.helpPanel.blockGuide.roleContext.blocks.personalityTraits.name'), use: t('builder.components.helpPanel.blockGuide.roleContext.blocks.personalityTraits.use') },
        { name: t('builder.components.helpPanel.blockGuide.roleContext.blocks.subjectFocus.name'), use: t('builder.components.helpPanel.blockGuide.roleContext.blocks.subjectFocus.use') },
      ],
    },
    {
      category: t('builder.components.helpPanel.blockGuide.interactionStyle.title'),
      description: t('builder.components.helpPanel.blockGuide.interactionStyle.description'),
      blocks: [
        { name: t('builder.components.helpPanel.blockGuide.interactionStyle.blocks.communicationStyle.name'), use: t('builder.components.helpPanel.blockGuide.interactionStyle.blocks.communicationStyle.use') },
        { name: t('builder.components.helpPanel.blockGuide.interactionStyle.blocks.feedbackStyle.name'), use: t('builder.components.helpPanel.blockGuide.interactionStyle.blocks.feedbackStyle.use') },
        { name: t('builder.components.helpPanel.blockGuide.interactionStyle.blocks.learningStyle.name'), use: t('builder.components.helpPanel.blockGuide.interactionStyle.blocks.learningStyle.use') },
      ],
    },
    {
      category: t('builder.components.helpPanel.blockGuide.taskControl.title'),
      description: t('builder.components.helpPanel.blockGuide.taskControl.description'),
      blocks: [
        { name: t('builder.components.helpPanel.blockGuide.taskControl.blocks.goalSetting.name'), use: t('builder.components.helpPanel.blockGuide.taskControl.blocks.goalSetting.use') },
        { name: t('builder.components.helpPanel.blockGuide.taskControl.blocks.outputFormat.name'), use: t('builder.components.helpPanel.blockGuide.taskControl.blocks.outputFormat.use') },
        { name: t('builder.components.helpPanel.blockGuide.taskControl.blocks.difficultyLevel.name'), use: t('builder.components.helpPanel.blockGuide.taskControl.blocks.difficultyLevel.use') },
        { name: t('builder.components.helpPanel.blockGuide.taskControl.blocks.timeManagement.name'), use: t('builder.components.helpPanel.blockGuide.taskControl.blocks.timeManagement.use') },
        { name: t('builder.components.helpPanel.blockGuide.taskControl.blocks.prioritization.name'), use: t('builder.components.helpPanel.blockGuide.taskControl.blocks.prioritization.use') },
      ],
    },
    {
      category: t('builder.components.helpPanel.blockGuide.thinkingLogic.title'),
      description: t('builder.components.helpPanel.blockGuide.thinkingLogic.description'),
      blocks: [
        { name: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.stepByStep.name'), use: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.stepByStep.use') },
        { name: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.conditionalLogic.name'), use: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.conditionalLogic.use') },
        { name: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.creativeThinking.name'), use: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.creativeThinking.use') },
        { name: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.errorHandling.name'), use: t('builder.components.helpPanel.blockGuide.thinkingLogic.blocks.errorHandling.use') },
      ],
    },
    {
      category: t('builder.components.helpPanel.blockGuide.skillsDevelopment.title'),
      description: t('builder.components.helpPanel.blockGuide.skillsDevelopment.description'),
      blocks: [
        { name: t('builder.components.helpPanel.blockGuide.skillsDevelopment.blocks.careerPlanning.name'), use: t('builder.components.helpPanel.blockGuide.skillsDevelopment.blocks.careerPlanning.use') },
        { name: t('builder.components.helpPanel.blockGuide.skillsDevelopment.blocks.skillAssessment.name'), use: t('builder.components.helpPanel.blockGuide.skillsDevelopment.blocks.skillAssessment.use') },
      ],
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col bg-background border-border [&>button]:hidden">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-foreground" />
              {t('builder.components.helpPanel.title')}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4">
            <Button
              variant={activeTab === 'guide' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('guide')}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                activeTab === 'guide'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              <Book className="h-4 w-4" />
              {t('builder.components.helpPanel.tabs.guide')}
            </Button>
            <Button
              variant={activeTab === 'shortcuts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('shortcuts')}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                activeTab === 'shortcuts'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              <Keyboard className="h-4 w-4" />
              {t('builder.components.helpPanel.tabs.shortcuts')}
            </Button>
            <Button
              variant={activeTab === 'faq' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('faq')}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                activeTab === 'faq'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              <MessageCircle className="h-4 w-4" />
              {t('builder.components.helpPanel.tabs.faq')}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 min-h-0 scrollbar">
          {/* Take Tour CTA */}
          <div className="mb-6 p-4 bg-muted border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground mb-1">{t('builder.components.helpPanel.tourCta.title')}</h4>
                <p className="text-sm text-muted-foreground">{t('builder.components.helpPanel.tourCta.description')}</p>
              </div>
              <Button
                onClick={onStartTour}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <PlayCircle className="h-4 w-4" />
                {t('builder.components.helpPanel.tourCta.button')}
              </Button>
            </div>
          </div>

          {/* Block Guide Tab */}
          {activeTab === 'guide' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('builder.components.helpPanel.guide.understandingBlocks.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('builder.components.helpPanel.guide.understandingBlocks.description')}
                </p>

                <div className="space-y-6">
                  {blockGuide.map(category => (
                    <div key={category.category} className="border border-border rounded-lg p-4 bg-muted/50">
                      <h4 className="font-medium text-foreground mb-2">{category.category}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="space-y-3">
                        {category.blocks.map(block => (
                          <div key={block.name} className="flex gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-foreground">
                                {block.name}
                                :
                              </span>
                              <span className="text-muted-foreground ml-2">{block.use}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('builder.components.helpPanel.guide.bestPractices.title')}</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{t('builder.components.helpPanel.guide.bestPractices.tips.startWithRole')}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{t('builder.components.helpPanel.guide.bestPractices.tips.useContext')}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{t('builder.components.helpPanel.guide.bestPractices.tips.addOutputFormat')}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{t('builder.components.helpPanel.guide.bestPractices.tips.testFrequently')}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">{t('builder.components.helpPanel.guide.bestPractices.tips.useSmartSuggestions')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('builder.components.helpPanel.shortcuts.title')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('builder.components.helpPanel.shortcuts.description')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shortcuts.map(shortcut => (
                    <div key={shortcut.key} className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                      <span className="text-muted-foreground">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-card border border-border rounded text-sm font-mono text-foreground">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('builder.components.helpPanel.mouseActions.title')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">{t('builder.components.helpPanel.mouseActions.panCanvas')}</span>
                    <span className="text-sm text-muted-foreground/80">{t('builder.components.helpPanel.mouseActions.panCanvasHow')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">{t('builder.components.helpPanel.mouseActions.connectBlocks')}</span>
                    <span className="text-sm text-muted-foreground/80">{t('builder.components.helpPanel.mouseActions.connectBlocksHow')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">{t('builder.components.helpPanel.mouseActions.selectMultiple')}</span>
                    <span className="text-sm text-muted-foreground/80">{t('builder.components.helpPanel.mouseActions.selectMultipleHow')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">{t('builder.components.helpPanel.mouseActions.zoom')}</span>
                    <span className="text-sm text-muted-foreground/80">{t('builder.components.helpPanel.mouseActions.zoomHow')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">{t('builder.components.helpPanel.faq.title')}</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-border bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">{t('builder.components.helpPanel.support.title')}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('builder.components.helpPanel.support.description')}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                    {t('builder.components.helpPanel.support.contactButton')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onStartTour}
                    className="cursor-pointer"
                  >
                    {t('builder.components.helpPanel.support.tourAgainButton')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
