'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, BookOpen, MessageSquare, Settings, Target, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface WizardStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  type: 'select' | 'input' | 'textarea'
  options?: Array<{
    value: string
    label: string
    description: string
    blocks: string[]
  }>
}

interface SimpleWizardProps {
  onComplete: (config: any) => void
  onSwitchToAdvanced: () => void
}

export function SimpleWizard({ onComplete, onSwitchToAdvanced }: SimpleWizardProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [textInput, setTextInput] = useState('')

  // 动态生成步骤配置
  const wizardSteps: WizardStep[] = [
    {
      id: 'purpose',
      title: t('builder.quickSetup.purpose.title'),
      description: t('builder.quickSetup.purpose.description'),
      icon: Target,
      type: 'select',
      options: [
        {
          value: 'learning',
          label: t('builder.quickSetup.purpose.learning.label'),
          description: t('builder.quickSetup.purpose.learning.description'),
          blocks: ['Role Definition', 'Learning Style', 'Subject Focus'],
        },
        {
          value: 'writing',
          label: t('builder.quickSetup.purpose.writing.label'),
          description: t('builder.quickSetup.purpose.writing.description'),
          blocks: ['Role Definition', 'Communication Style', 'Output Format'],
        },
        {
          value: 'work',
          label: t('builder.quickSetup.purpose.work.label'),
          description: t('builder.quickSetup.purpose.work.description'),
          blocks: ['Role Definition', 'Context Setting', 'Output Format'],
        },
        {
          value: 'personal',
          label: t('builder.quickSetup.purpose.personal.label'),
          description: t('builder.quickSetup.purpose.personal.description'),
          blocks: ['Role Definition', 'Communication Style', 'Personality'],
        },
      ],
    },
    {
      id: 'tone',
      title: t('builder.quickSetup.tone.title'),
      description: t('builder.quickSetup.tone.description'),
      icon: MessageSquare,
      type: 'select',
      options: [
        {
          value: 'professional',
          label: t('builder.quickSetup.tone.professional.label'),
          description: t('builder.quickSetup.tone.professional.description'),
          blocks: [],
        },
        {
          value: 'friendly',
          label: t('builder.quickSetup.tone.friendly.label'),
          description: t('builder.quickSetup.tone.friendly.description'),
          blocks: [],
        },
        {
          value: 'encouraging',
          label: t('builder.quickSetup.tone.encouraging.label'),
          description: t('builder.quickSetup.tone.encouraging.description'),
          blocks: [],
        },
        {
          value: 'direct',
          label: t('builder.quickSetup.tone.direct.label'),
          description: t('builder.quickSetup.tone.direct.description'),
          blocks: [],
        },
      ],
    },
    {
      id: 'expertise',
      title: t('builder.quickSetup.expertise.title'),
      description: t('builder.quickSetup.expertise.description'),
      icon: User,
      type: 'select',
      options: [
        {
          value: 'beginner',
          label: t('builder.quickSetup.expertise.beginner.label'),
          description: t('builder.quickSetup.expertise.beginner.description'),
          blocks: [],
        },
        {
          value: 'intermediate',
          label: t('builder.quickSetup.expertise.intermediate.label'),
          description: t('builder.quickSetup.expertise.intermediate.description'),
          blocks: [],
        },
        {
          value: 'advanced',
          label: t('builder.quickSetup.expertise.advanced.label'),
          description: t('builder.quickSetup.expertise.advanced.description'),
          blocks: [],
        },
      ],
    },
    {
      id: 'goal',
      title: t('builder.quickSetup.goal.title'),
      description: t('builder.quickSetup.goal.description'),
      icon: BookOpen,
      type: 'textarea',
    },
  ]

  const step = wizardSteps[currentStep]
  const isLastStep = currentStep === wizardSteps.length - 1

  const handleOptionSelect = (value: string, option: any) => {
    setAnswers(prev => ({
      ...prev,
      [step.id]: { value, ...option },
    }))
  }

  const handleNext = () => {
    if (step.type === 'textarea') {
      const updatedAnswers = {
        ...answers,
        [step.id]: { value: textInput },
      }
      setAnswers(updatedAnswers)

      if (isLastStep) {
        onComplete(updatedAnswers)
        return
      }
    }

    if (isLastStep) {
      onComplete(answers)
    }
    else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    if (step.type === 'select') {
      return !!answers[step.id]
    }
    if (step.type === 'textarea') {
      return textInput.trim().length > 0
    }
    return true
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('builder.quickSetup.title')}</h2>
            <p className="text-muted-foreground mt-1">{t('builder.quickSetup.subtitle')}</p>
          </div>
          <Button
            variant="outline"
            onClick={onSwitchToAdvanced}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            {t('builder.quickSetup.advancedMode')}
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t('builder.quickSetup.steps.stepOf', { current: currentStep + 1, total: wizardSteps.length })}
            </span>
            <span>
              {Math.round(((currentStep + 1) / wizardSteps.length) * 100)}
              % complete
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Step */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <step.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <CardDescription className="mt-1">{step.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step.type === 'select' && step.options && (
            <div className="grid gap-3">
              {step.options.map(option => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    answers[step.id]?.value === option.value
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleOptionSelect(option.value, option)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{option.label.split(' ')[0]}</div>
                      <div className="flex-1">
                        <div className="font-medium">{option.label.substring(option.label.indexOf(' ') + 1)}</div>
                        <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step.type === 'textarea' && (
            <div className="space-y-3">
              <Label htmlFor="goal-input">{step.title}</Label>
              <Textarea
                id="goal-input"
                placeholder={t('builder.quickSetup.goal.placeholder')}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {Object.keys(answers).length > 0 && (
        <Card className="mb-6 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm">Live Preview: Your AI assistant will be like this</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              {answers.purpose && (
                <p>
                  •
                  <strong>Purpose:</strong>
                  {' '}
                  {answers.purpose.description}
                </p>
              )}
              {answers.tone && (
                <p>
                  •
                  <strong>Style:</strong>
                  {' '}
                  {answers.tone.description}
                </p>
              )}
              {answers.expertise && (
                <p>
                  •
                  <strong>Level:</strong>
                  {' '}
                  {answers.expertise.description}
                </p>
              )}
              {answers.goal && (
                <p>
                  •
                  <strong>Goal:</strong>
                  {' '}
                  {answers.goal.value}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="cursor-pointer"
        >
          {t('builder.quickSetup.steps.previous')}
        </Button>

        <div className="flex items-center gap-2">
          {wizardSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-all ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          {isLastStep ? t('builder.quickSetup.steps.createInstructions') : t('builder.quickSetup.steps.next')}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
