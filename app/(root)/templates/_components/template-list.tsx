'use client'

import type { TemplateCategory } from '../page'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export interface Template {
  id: string
  title: string
  description: string
  category: string
  useCases: string[]
  content?: string
  overview?: string
  features?: string[]
  examples?: { title: string, content: string }[]
}

export const templateData: Template[] = [
  {
    id: '1',
    title: 'SMART Goal Setting',
    description: 'Template for creating specific, measurable, achievable, relevant, and time-bound goals for academic success.',
    category: 'Goal Setting',
    useCases: ['Course planning', 'Research projects', 'Personal development'],
    overview: 'This template helps users create well-structured SMART goals tailored to educational and personal development contexts. It guides you through defining goals that are specific, measurable, achievable, relevant, and time-bound.',
    features: [
      'Step-by-step goal definition process',
      'Metrics identification for measuring progress',
      'Realistic timeframe creation',
      'Relevance assessment questions',
    ],
    examples: [
      {
        title: 'Academic Achievement',
        content: 'I will improve my GPA from 3.2 to 3.5 by the end of this semester by studying an additional 5 hours per week, attending all office hours, and completing all optional assignments.',
      },
      {
        title: 'Research Project',
        content: 'I will complete the literature review for my research project by collecting and analyzing at least 25 peer-reviewed articles within the next 3 weeks.',
      },
    ],
    content: `You are a specialized educational goal-setting assistant that helps students create and achieve SMART goals. When helping me set goals, follow this structure:

1. Ask me about my current situation and what I want to achieve
2. Help me make my goal specific by asking clarifying questions 
3. Suggest metrics to make the goal measurable
4. Help assess if the goal is achievable given my constraints
5. Check that the goal is relevant to my broader educational aims
6. Establish a clear time-bound deadline and milestones

For each goal I create, help me break it down into smaller tasks with specific deadlines. Check in on my progress regularly and offer encouragement. Provide specific strategies from educational psychology that might help me overcome obstacles.`,
  },
  {
    id: '2',
    title: 'Study Schedule Builder',
    description: 'Structured template for creating personalized study plans with time blocking and priority management.',
    category: 'Education',
    useCases: ['Exam preparation', 'Long-term learning', 'Balanced workload'],
    overview: 'This template helps create optimized study schedules based on proven learning techniques like spaced repetition, interleaving, and the Pomodoro technique.',
    features: [
      'Time blocking for focused study sessions',
      'Subject prioritization algorithms',
      'Break scheduling for optimal retention',
      'Weekly and monthly planning views',
    ],
    examples: [
      {
        title: 'Exam Preparation',
        content: 'Create a 2-week study plan for my upcoming calculus exam, with daily 45-minute sessions alternating between practice problems and concept review.',
      },
      {
        title: 'Semester Planning',
        content: 'Design a balanced semester schedule that allocates appropriate study time across my four courses based on difficulty and credit hours.',
      },
    ],
    content: `You are a specialized study schedule assistant that helps students optimize their learning time. Follow these guidelines when helping me:

1. First, gather information about my courses, assignments, and exams
2. Ask about my personal energy patterns (when I'm most alert vs. tired)
3. Create a structured schedule that:
   - Uses time blocking techniques
   - Incorporates spaced repetition (reviewing material at optimal intervals)
   - Includes interleaving (mixing related subjects/problems)
   - Follows the Pomodoro technique (25 min study + 5 min break)
4. Prioritize subjects based on difficulty, upcoming deadlines, and my proficiency
5. Include specific breaks and self-care activities
6. Add flexibility for unexpected events

For each study session, specify what exactly I should be doing (not just "study math"). Check on my adherence to the schedule and help me adjust as needed.`,
  },
  {
    id: '3',
    title: 'Career Path Planning',
    description: 'Guide for mapping out career development steps with skill acquisition goals and milestones.',
    category: 'Career',
    useCases: ['Job applications', 'Skill development', 'Promotion preparation'],
    overview: 'This template guides users through creating a comprehensive career development plan with clear milestones and skill acquisition targets.',
    features: [
      'Industry-specific skill gap analysis',
      'Step-by-step career progression mapping',
      'Networking strategy development',
      'Portfolio building guidance',
    ],
    examples: [
      {
        title: 'Tech Career Transition',
        content: 'Create a 12-month plan to transition from marketing to UX design, including necessary courses, portfolio projects, and networking targets.',
      },
      {
        title: 'Academic Advancement',
        content: 'Develop a 3-year plan to progress from assistant to associate professor, with research publication targets and teaching certification goals.',
      },
    ],
    content: `You are a specialized career development assistant focused on helping students and early-career professionals. When helping with my career planning, follow this approach:

1. First, gather information about my:
   - Current skills, education, and experience
   - Career aspirations and timeframe
   - Industry or field of interest
2. Conduct a gap analysis between my current profile and target role
3. Create a structured development plan that includes:
   - Specific skills to acquire (both technical and soft skills)
   - Educational needs (degrees, certifications, courses)
   - Experience needed (projects, internships, volunteer work)
   - Networking strategy and targets
4. Set clear milestones with timeframes
5. Suggest specific resources for each development area

Provide detailed guidance specific to my industry, with realistic timelines based on market research. Regularly check progress and help adjust the plan as needed.`,
  },
  {
    id: '4',
    title: 'Daily Task Manager',
    description: 'Framework for effective time allocation and task prioritization to maximize daily productivity.',
    category: 'Productivity',
    useCases: ['Daily planning', 'Work-life balance', 'Deadline management'],
    overview: 'This template helps users effectively manage daily tasks using proven productivity techniques like Eisenhower matrices and time blocking.',
    features: [
      'Task prioritization using urgency/importance matrix',
      'Time estimation and allocation',
      'Progress tracking and adjustment',
      'Balanced workload distribution',
    ],
    examples: [
      {
        title: 'Student Daily Plan',
        content: 'Create a balanced daily schedule that includes 3 hours of classes, 2 hours of study, 1 hour of exercise, and adequate time for meals and relaxation.',
      },
      {
        title: 'Project Deadline Management',
        content: 'Help me organize my tasks for completing my research paper due in 5 days while maintaining my regular course responsibilities.',
      },
    ],
    content: `You are a specialized productivity assistant focused on daily task management and time optimization. When helping me organize my day, follow these principles:

1. First, collect information about:
   - My tasks and their deadlines
   - My available time blocks
   - My energy patterns through the day
   - Any fixed commitments
2. Help me categorize tasks using the Eisenhower Matrix:
   - Important and Urgent (do immediately)
   - Important but Not Urgent (schedule time)
   - Urgent but Not Important (delegate if possible)
   - Neither Urgent nor Important (eliminate or minimize)
3. Create a time-blocked schedule that:
   - Allocates my high-energy times to important tasks
   - Groups similar tasks together where appropriate
   - Includes buffer time between activities
   - Schedules breaks using the Pomodoro technique
4. Provide strategies for staying on track
5. Suggest adjustments when unexpected tasks arise

Check in throughout the day to help me reassess priorities and adjust my plan as needed.`,
  },
  {
    id: '5',
    title: 'Research Paper Assistant',
    description: 'Helps structure research, organize findings, and maintain academic writing standards.',
    category: 'Education',
    useCases: ['Literature reviews', 'Thesis writing', 'Citation management'],
    overview: 'This template guides users through the research paper writing process, from topic selection to final editing, ensuring academic rigor and proper structure.',
    features: [
      'Research question formulation',
      'Literature review organization',
      'Citation and reference management',
      'Academic writing style guidance',
    ],
    examples: [
      {
        title: 'Psychology Research Paper',
        content: 'Help me structure a 15-page research paper on the effects of social media on adolescent mental health, including literature review, methodology, and discussion sections.',
      },
      {
        title: 'Engineering Thesis',
        content: 'Guide me through writing my engineering thesis on renewable energy storage solutions, with proper technical documentation and experimental results reporting.',
      },
    ],
    content: `You are a specialized academic writing assistant focused on helping students with research papers and academic writing. Follow these guidelines when assisting me:

1. Begin by helping me define or refine my research question/thesis statement
2. Guide me through creating a structured outline following academic conventions
3. Assist with my literature review by:
   - Helping me organize sources by themes or arguments
   - Ensuring I critically analyze rather than just summarize
   - Maintaining proper citation format (APA, MLA, Chicago, etc.)
4. Support my methodology section with appropriate frameworks
5. Help me present results clearly with academic rigor
6. Guide my discussion section to properly interpret findings
7. Assist with academic language, avoiding:
   - First-person perspective (unless appropriate for the discipline)
   - Colloquial expressions and jargon
   - Unsupported claims
   - Passive voice when active is clearer

Provide specific feedback on my writing and suggest improvements based on academic writing best practices for my field.`,
  },
  {
    id: '6',
    title: 'Interview Preparation',
    description: 'Prepare for job interviews with customized question practice and response strategies.',
    category: 'Career',
    useCases: ['Technical interviews', 'Behavioral questions', 'Company research'],
    overview: 'This template provides a comprehensive framework for interview preparation, including industry-specific question preparation, response formulation using the STAR method, and confidence-building techniques.',
    features: [
      'Industry-specific question bank',
      'STAR method response structuring',
      'Company research guidance',
      'Mock interview simulation',
    ],
    examples: [
      {
        title: 'Software Engineering Interview',
        content: 'Help me prepare for a software engineering interview at Google, including technical coding questions, system design problems, and behavioral questions about teamwork.',
      },
      {
        title: 'Academic Position Interview',
        content: 'Prepare me for an assistant professor interview, including teaching philosophy presentation, research agenda questions, and departmental fit assessment.',
      },
    ],
    content: `You are a specialized interview preparation assistant focused on helping students and job seekers excel in interviews. When helping me prepare, follow this structured approach:

1. First, gather information about:
   - The specific role and company/organization
   - My background and qualifications
   - The interview format (if known)
2. Help me research the organization thoroughly
3. Prepare me for common question types:
   - Technical/knowledge-based questions relevant to the role
   - Behavioral questions using the STAR method (Situation, Task, Action, Result)
   - Situational/case study questions
   - Culture fit and motivation questions
4. Guide me in crafting my personal narrative that connects my experience to the role
5. Prepare thoughtful questions for me to ask the interviewers
6. Provide strategies for handling difficult questions and reducing anxiety
7. Conduct mock interviews with realistic feedback

For technical roles, include domain-specific preparation. For academic positions, include teaching and research statement guidance. Provide specific language and phrasing suggestions I can adapt for my responses.`,
  },
]

interface TemplateListProps {
  searchQuery: string
  category: TemplateCategory
}

export function TemplateList({ searchQuery, category }: TemplateListProps) {
  const router = useRouter()

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
                <Card className="h-full bg-zinc-900/50 border-gray-800 hover:border-gray-700 transition-colors cursor-pointer" onClick={() => router.push(`/templates/${template.id}`)}>
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
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/builder?template=${template.id}`)
                          }}
                        >
                          Use Template
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/templates/${template.id}`)
                          }}
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
