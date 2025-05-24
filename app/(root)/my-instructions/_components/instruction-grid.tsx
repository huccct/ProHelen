'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Clock, Edit, MoreVertical, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock data for user instructions
export const mockInstructions = [
  {
    id: '1',
    title: 'Essay Writing Guide',
    description: 'Custom instruction for writing academic essays with proper structure and citations',
    createdAt: '2023-10-15',
    usageCount: 24,
    tags: ['academic', 'writing'],
    content: 'You are an essay writing assistant. Help me write clear, well-structured academic essays with proper citations and formatting according to academic standards.',
  },
  {
    id: '2',
    title: 'Code Documentation Helper',
    description: 'Guides AI to help write clear and comprehensive code documentation',
    createdAt: '2023-11-02',
    usageCount: 18,
    tags: ['programming', 'documentation'],
    content: 'You are a code documentation specialist. Help me write clear, concise, and comprehensive documentation for my code that follows best practices.',
  },
  {
    id: '3',
    title: 'Data Analysis Framework',
    description: 'Step-by-step guide for analyzing research data and drawing conclusions',
    createdAt: '2023-11-08',
    usageCount: 12,
    tags: ['research', 'analysis'],
    content: 'You are a data analysis expert. Guide me through analyzing research data step-by-step, from initial exploration to drawing meaningful conclusions.',
  },
  {
    id: '4',
    title: 'Creative Writing Prompt',
    description: 'Instruction set for generating creative writing prompts and storylines',
    createdAt: '2023-11-15',
    usageCount: 8,
    tags: ['creative', 'writing'],
    content: 'You are a creative writing assistant. Help me develop unique and inspiring writing prompts, storylines, and character backgrounds.',
  },
  {
    id: '5',
    title: 'Meeting Notes Template',
    description: 'Framework for organizing and summarizing meeting notes effectively',
    createdAt: '2023-11-20',
    usageCount: 6,
    tags: ['productivity', 'organization'],
    content: 'You are a meeting notes assistant. Help me organize, structure, and summarize meeting notes in a clear and actionable format.',
  },
  {
    id: '6',
    title: 'Research Question Generator',
    description: 'System for developing specific and impactful research questions',
    createdAt: '2023-11-28',
    usageCount: 4,
    tags: ['research', 'academic'],
    content: 'You are a research methodology expert. Help me develop specific, meaningful, and impactful research questions that can guide effective academic investigations.',
  },
]

interface InstructionGridProps {
  searchQuery: string
}

export function InstructionGrid({ searchQuery }: InstructionGridProps) {
  const router = useRouter()

  // Filter instructions based on search query
  const filteredInstructions = mockInstructions.filter(instruction =>
    instruction.title.toLowerCase().includes(searchQuery.toLowerCase())
    || instruction.description.toLowerCase().includes(searchQuery.toLowerCase())
    || instruction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredInstructions.length > 0
        ? (
            filteredInstructions.map(instruction => (
              <Card key={instruction.id} className="bg-zinc-900 border-gray-800 hover:border-gray-300 hover:shadow-md hover:shadow-gray-900/20 transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white cursor-pointer hover:text-gray-200 transition-colors" onClick={() => router.push(`/builder?instruction=${instruction.id}`)}>
                      {instruction.title}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-800 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
                        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700" onClick={() => router.push(`/builder?instruction=${instruction.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700" onClick={() => {}}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700 text-red-400 hover:text-red-300" onClick={() => {}}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-300 text-sm min-h-[60px]">{instruction.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {instruction.tags.map(tag => (
                      <span key={tag} className="bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded-full hover:bg-zinc-700 hover:text-white transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t border-gray-800 pt-3 text-xs text-gray-400 flex justify-between">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {instruction.createdAt}
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Used
                    {' '}
                    {instruction.usageCount}
                    {' '}
                    times
                  </div>
                </CardFooter>
              </Card>
            ))
          )
        : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">No instructions found matching your search.</div>
              <Button
                onClick={() => router.push('/builder')}
                className="cursor-pointer"
              >
                Create New Instruction
              </Button>
            </div>
          )}
    </div>
  )
}
