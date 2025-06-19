'use client'

import type { Template } from '../../_components/template-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TemplateDetailsProps {
  template: Template
}

export function TemplateDetails({ template }: TemplateDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Overview</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {template.overview || template.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {template.features && template.features.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {template.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-muted-foreground mr-2">•</span>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {template.examples && template.examples.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">Examples</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              See how this template can be applied in real scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.examples.map((example, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-lg font-medium text-foreground">{example.title}</h4>
                <p className="text-muted-foreground text-sm bg-muted/50 p-4 rounded-md border border-border">
                  {example.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
