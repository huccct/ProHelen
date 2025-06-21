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

interface HelpPanelProps {
  isOpen: boolean
  onClose: () => void
  onStartTour: () => void
}

const shortcuts = [
  { key: 'Ctrl + Z', description: 'Undo last action' },
  { key: 'Ctrl + Y', description: 'Redo last action' },
  { key: 'F1', description: 'Open help panel' },
  { key: 'Escape', description: 'Close dialogs and panels' },
  { key: 'Click + Drag', description: 'Move blocks on canvas' },
  { key: 'Click block', description: 'Get smart suggestions' },
  { key: 'Double click', description: 'Edit block content' },
  { key: 'Enter', description: 'Confirm in dialogs' },
  { key: 'Mouse wheel', description: 'Zoom in/out on canvas' },
]

const faqs = [
  {
    question: 'How do blocks connect automatically?',
    answer: 'Blocks are connected automatically based on logical flow and best practices. The system analyzes block types and creates the most appropriate connections for effective prompt building.',
  },
  {
    question: 'Why are connections automatic?',
    answer: 'Automatic connections make the tool easier to use, especially for non-technical users. The system ensures proper flow and sequence based on proven prompt engineering patterns.',
  },
  {
    question: 'What happens when I delete a block?',
    answer: 'When you delete a block, the remaining blocks are automatically reconnected to maintain a logical flow. The generated prompt updates automatically.',
  },
  {
    question: 'Can I reuse blocks I\'ve created?',
    answer: 'Yes! Save your instruction as a template or copy content from one block to another. You can also duplicate existing blocks by copying them.',
  },
  {
    question: 'How do I improve my prompts?',
    answer: 'Add specific content to each block, test your prompts regularly, and use the Smart Suggestions feature to discover relevant blocks you might have missed.',
  },
]

const blockGuide = [
  {
    category: 'Core Blocks',
    description: 'Essential building blocks for any instruction',
    blocks: [
      { name: 'Role Definition', use: 'Define what role the AI should take (teacher, assistant, expert, etc.)' },
      { name: 'Context Setting', use: 'Provide background information and situational context' },
      { name: 'Output Format', use: 'Specify how you want the AI to structure its responses' },
    ],
  },
  {
    category: 'Educational Blocks',
    description: 'Specialized for learning and teaching scenarios',
    blocks: [
      { name: 'Goal Setting', use: 'Define specific learning objectives and outcomes' },
      { name: 'Learning Style', use: 'Customize approach based on learning preferences' },
      { name: 'Subject Focus', use: 'Specify the subject area and level of detail needed' },
    ],
  },
  {
    category: 'Behavior Blocks',
    description: 'Control AI personality and communication style',
    blocks: [
      { name: 'Communication Style', use: 'Set tone, formality, and conversation approach' },
      { name: 'Feedback Style', use: 'Define how the AI should provide corrections and guidance' },
      { name: 'Personality', use: 'Add character traits and behavioral patterns' },
    ],
  },
]

export function HelpPanel({ isOpen, onClose, onStartTour }: HelpPanelProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'shortcuts' | 'faq'>('guide')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col bg-background border-border [&>button]:hidden">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-foreground" />
              ProHelen Help Center
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
              Block Guide
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
              Shortcuts
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
              FAQ
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 min-h-0 scrollbar">
          {/* Take Tour CTA */}
          <div className="mb-6 p-4 bg-muted border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground mb-1">New to ProHelen?</h4>
                <p className="text-sm text-muted-foreground">Take a guided tour to learn the basics in 2 minutes!</p>
              </div>
              <Button
                onClick={onStartTour}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <PlayCircle className="h-4 w-4" />
                Start Tour
              </Button>
            </div>
          </div>

          {/* Block Guide Tab */}
          {activeTab === 'guide' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Understanding Blocks</h3>
                <p className="text-muted-foreground mb-6">
                  Blocks are the building pieces of your AI instructions. Each block serves a specific purpose and can be combined to create powerful, customized prompts.
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
                <h3 className="text-lg font-semibold text-foreground mb-4">Best Practices</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">Start with a Role Definition block to establish the AI's perspective</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">Use Context Setting early to provide necessary background information</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">Add Output Format blocks to ensure consistent response structure</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">Test your instructions frequently using the Preview panel</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">Use Smart Suggestions to discover complementary blocks</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Keyboard Shortcuts</h3>
                <p className="text-muted-foreground mb-6">
                  Speed up your workflow with these keyboard shortcuts.
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
                <h3 className="text-lg font-semibold text-foreground mb-4">Mouse Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">Pan canvas</span>
                    <span className="text-sm text-muted-foreground/80">Click and drag on empty space</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">Connect blocks</span>
                    <span className="text-sm text-muted-foreground/80">Drag from output to input handle</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">Select multiple blocks</span>
                    <span className="text-sm text-muted-foreground/80">Ctrl + click</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                    <span className="text-muted-foreground">Zoom</span>
                    <span className="text-sm text-muted-foreground/80">Mouse wheel or zoom controls</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
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
                <h4 className="font-medium text-foreground mb-2">Still need help?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Can't find what you're looking for? We're here to help!
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                    Contact Support
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onStartTour}
                    className="cursor-pointer"
                  >
                    Take Tour Again
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
