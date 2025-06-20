'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

interface GuidedWelcomeProps {
  onNext: () => void
  onBackToSimple: () => void
  onSkipToAdvanced: () => void
}

export function GuidedWelcome({ onNext, onBackToSimple, onSkipToAdvanced }: GuidedWelcomeProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-2xl text-center space-y-8 p-8">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">🎉 Great! Your AI instruction is ready</h1>
          <p className="text-lg text-muted-foreground">
            Now let me show you how to fine-tune these settings to make your AI work even better for you
          </p>
        </div>

        <Card className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
          <CardHeader className="p-0">
            <CardTitle className="text-left">You'll learn how to:</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Adjust AI's communication style</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Organize instruction flow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Test and optimize results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Save and share instructions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={onBackToSimple}
            className="hover:bg-muted/50 cursor-pointer"
          >
            Back to Simple Mode
          </Button>
          <Button
            onClick={onNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-sm cursor-pointer"
          >
            Start Learning
            {' '}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">Advanced user?</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkipToAdvanced}
            className="text-muted-foreground hover:text-foreground"
          >
            Go to Full Editor
          </Button>
        </div>
      </div>
    </div>
  )
}
