'use client'

import type { TemplateCategory } from '../page'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// mock templates data
const templateData = [
  {
    id: '1',
    title: 'SMART Goal Setting',
    description: 'Template for creating specific, measurable, achievable, relevant, and time-bound goals for academic success.',
    category: 'Goal Setting',
    useCases: ['Course planning', 'Research projects', 'Personal development'],
  },
  {
    id: '2',
    title: 'Study Schedule Builder',
    description: 'Structured template for creating personalized study plans with time blocking and priority management.',
    category: 'Education',
    useCases: ['Exam preparation', 'Long-term learning', 'Balanced workload'],
  },
  {
    id: '3',
    title: 'Career Path Planning',
    description: 'Guide for mapping out career development steps with skill acquisition goals and milestones.',
    category: 'Career',
    useCases: ['Job applications', 'Skill development', 'Promotion preparation'],
  },
  {
    id: '4',
    title: 'Daily Task Manager',
    description: 'Framework for effective time allocation and task prioritization to maximize daily productivity.',
    category: 'Productivity',
    useCases: ['Daily planning', 'Work-life balance', 'Deadline management'],
  },
  {
    id: '5',
    title: 'Research Paper Assistant',
    description: 'Helps structure research, organize findings, and maintain academic writing standards.',
    category: 'Education',
    useCases: ['Literature reviews', 'Thesis writing', 'Citation management'],
  },
  {
    id: '6',
    title: 'Interview Preparation',
    description: 'Prepare for job interviews with customized question practice and response strategies.',
    category: 'Career',
    useCases: ['Technical interviews', 'Behavioral questions', 'Company research'],
  },
]

interface TemplateListProps {
  searchQuery: string
  category: TemplateCategory
}

export function TemplateList({ searchQuery, category }: TemplateListProps) {
  const router = useRouter()

  // filter templates
  const filteredTemplates = templateData.filter((template) => {
    const matchesSearch
      = template.title.toLowerCase().includes(searchQuery.toLowerCase())
        || template.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = category === 'All' || template.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.length > 0
        ? (
            filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-zinc-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader>
                    <div className="text-sm font-medium text-blue-400 mb-1">{template.category}</div>
                    <CardTitle className="text-xl font-bold text-white">{template.title}</CardTitle>
                    <CardDescription className="text-base text-gray-300 mt-2">
                      {template.description}
                    </CardDescription>

                    <div className="mt-4 space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-400">Use cases: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {template.useCases.map(useCase => (
                            <span
                              key={useCase}
                              className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded-md"
                            >
                              {useCase}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <Button
                          className="w-full cursor-pointer"
                          onClick={() => router.push(`/builder?template=${template.id}`)}
                        >
                          Use Template
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 cursor-pointer"
                          onClick={() => router.push(`/templates/${template.id}`)}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))
          )
        : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-400">No templates found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
            </div>
          )}
    </div>
  )
}
