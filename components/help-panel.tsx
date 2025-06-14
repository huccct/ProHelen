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
  { key: 'Ctrl + S', description: 'Save instruction' },
  { key: 'Ctrl + C', description: 'Copy selected content' },
  { key: 'Ctrl + V', description: 'Paste content' },
  { key: 'Delete', description: 'Delete selected block' },
  { key: 'Space', description: 'Fit canvas to view' },
  { key: 'Ctrl + +', description: 'Zoom in' },
  { key: 'Ctrl + -', description: 'Zoom out' },
  { key: 'Escape', description: 'Close dialogs/panels' },
]

const faqs = [
  {
    question: 'How do I connect blocks together?',
    answer: 'Click and drag from the bottom handle of one block to the top handle of another block. Connected blocks work together to create more complex instructions.',
  },
  {
    question: 'What happens when I delete a block?',
    answer: 'When you delete a block, its connections are also removed. The generated prompt will update automatically to reflect the remaining blocks.',
  },
  {
    question: 'Can I reuse blocks I\'ve created?',
    answer: 'Yes! Save your instruction as a template or copy content from one block to another. You can also duplicate existing blocks by copying them.',
  },
  {
    question: 'How do Smart Suggestions work?',
    answer: 'Our AI analyzes your current blocks and suggests complementary blocks based on successful prompt patterns from other users and prompt engineering best practices.',
  },
  {
    question: 'What\'s the difference between formats?',
    answer: 'Custom Instructions format is optimized for ChatGPT\'s custom instructions feature. System Prompt format works with most AI APIs. Raw Text shows all content as plain text.',
  },
  {
    question: 'Can I import existing prompts?',
    answer: 'Currently, you can create new instructions from templates or copy existing ones. We\'re working on direct text import functionality.',
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
      <DialogContent className="max-w-4xl max-h-[80vh] bg-zinc-900 border-gray-700 text-white flex flex-col [&>button]:hidden">
        <DialogHeader className="pb-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-white" />
              ProHelen Help Center
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
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
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800',
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
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800',
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
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800',
              )}
            >
              <MessageCircle className="h-4 w-4" />
              FAQ
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 min-h-0 scrollbar">
          {/* Take Tour CTA */}
          <div className="mb-6 p-4 bg-zinc-800 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white mb-1">New to ProHelen?</h4>
                <p className="text-sm text-gray-300">Take a guided tour to learn the basics in 2 minutes!</p>
              </div>
              <Button
                onClick={onStartTour}
                className="bg-white hover:bg-gray-100 text-black flex items-center gap-2 cursor-pointer whitespace-nowrap"
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
                <h3 className="text-lg font-semibold text-white mb-4">Understanding Blocks</h3>
                <p className="text-gray-300 mb-6">
                  Blocks are the building pieces of your AI instructions. Each block serves a specific purpose and can be combined to create powerful, customized prompts.
                </p>

                <div className="space-y-6">
                  {blockGuide.map(category => (
                    <div key={category.category} className="border border-gray-700 rounded-lg p-4 bg-zinc-800/50">
                      <h4 className="font-medium text-white mb-2">{category.category}</h4>
                      <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                      <div className="space-y-3">
                        {category.blocks.map(block => (
                          <div key={block.name} className="flex gap-3">
                            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-white">
                                {block.name}
                                :
                              </span>
                              <span className="text-gray-300 ml-2">{block.use}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Best Practices</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300">Start with a Role Definition block to establish the AI's perspective</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300">Use Context Setting early to provide necessary background information</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300">Add Output Format blocks to ensure consistent response structure</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300">Test your instructions frequently using the Preview panel</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300">Use Smart Suggestions to discover complementary blocks</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
                <p className="text-gray-300 mb-6">
                  Speed up your workflow with these keyboard shortcuts.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shortcuts.map(shortcut => (
                    <div key={shortcut.key} className="flex items-center justify-between p-3 bg-zinc-800 border border-gray-700 rounded-lg">
                      <span className="text-gray-300">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-zinc-700 border border-gray-600 rounded text-sm font-mono text-gray-200">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Mouse Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-800 border border-gray-700 rounded-lg">
                    <span className="text-gray-300">Pan canvas</span>
                    <span className="text-sm text-gray-400">Click and drag on empty space</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800 border border-gray-700 rounded-lg">
                    <span className="text-gray-300">Connect blocks</span>
                    <span className="text-sm text-gray-400">Drag from output to input handle</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800 border border-gray-700 rounded-lg">
                    <span className="text-gray-300">Select multiple blocks</span>
                    <span className="text-sm text-gray-400">Ctrl + click</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-800 border border-gray-700 rounded-lg">
                    <span className="text-gray-300">Zoom</span>
                    <span className="text-sm text-gray-400">Mouse wheel or zoom controls</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-700 bg-zinc-800/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800 border border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Still need help?</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Can't find what you're looking for? We're here to help!
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-white hover:bg-gray-100 text-black cursor-pointer">
                    Contact Support
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onStartTour}
                    className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-zinc-800 cursor-pointer"
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
