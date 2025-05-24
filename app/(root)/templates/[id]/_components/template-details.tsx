'use client'

import type { Template } from '../../_components/template-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TemplateDetailsProps {
  template: Template
}

export function TemplateDetails({ template }: TemplateDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Overview</CardTitle>
          <CardDescription className="text-base text-gray-300">
            {template.overview || template.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {template.features && template.features.length > 0 && (
        <Card className="bg-zinc-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {template.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {template.examples && template.examples.length > 0 && (
        <Card className="bg-zinc-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">Examples</CardTitle>
            <CardDescription className="text-base text-gray-300">
              See how this template can be applied in real scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.examples.map((example, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-lg font-medium text-gray-200">{example.title}</h4>
                <p className="text-gray-400 text-sm bg-zinc-950/50 p-4 rounded-md border border-gray-800">
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
