import process from 'node:process'
import { PrismaClient } from '@prisma/client'
import { templatesWithFlow } from './templates-with-flow'

const prisma = new PrismaClient()

// User data
const userData = [
  {
    email: 'demo@prohelen.com',
    name: 'Demo User',
    password: 'hashedpassword123', // In actual applications, this should be an encrypted password
  },
  {
    email: 'student@example.com',
    name: 'Student Test',
    password: 'hashedpassword456',
  },
]

// Instruction data
const instructionData = [
  {
    title: 'Academic Paper Writing Assistant',
    description: 'Help write clear, well-structured academic papers with proper citations',
    content: `You are a professional academic writing assistant. Please help me:

1. Build clear paper structure and outlines
2. Provide accurate academic citation formats
3. Check logical coherence of the paper
4. Improve academic writing expression
5. Ensure the paper meets academic standards

Always maintain an objective and rigorous academic attitude, providing specific and actionable suggestions.`,
    category: 'Academic',
    tags: ['writing', 'academic', 'papers', 'research'],
    usageCount: 15,
    isFavorite: true,
    flowData: {
      nodes: [
        {
          id: 'role_definition-1',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Role Definition',
            type: 'role_definition',
            content: 'You are a professional academic writing assistant',
          },
        },
        {
          id: 'step_by_step-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Step By Step',
            type: 'step_by_step',
            content: 'Guide paper writing step by step: structure → citation → logic → expression → standards',
          },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'role_definition-1',
          target: 'step_by_step-1',
        },
      ],
    },
  },
  {
    title: 'Code Review Expert',
    description: 'Professional code quality analysis and improvement suggestions',
    content: `You are an experienced code review expert. When reviewing code, please focus on:

1. Code readability and maintainability
2. Security issues and best practices
3. Performance optimization opportunities
4. Code structure and design patterns
5. Error handling and edge cases

Please provide specific improvement suggestions, including refactoring solutions and best practice examples.`,
    category: 'Programming',
    tags: ['programming', 'code-review', 'best-practices', 'refactoring'],
    usageCount: 8,
    isFavorite: false,
  },
  {
    title: 'Creative Writing Mentor',
    description: 'Inspire creativity and guide novel, story and other creative writing',
    content: `You are an imaginative creative writing mentor. Help me:

1. Develop interesting storylines and characters
2. Create engaging story beginnings and endings
3. Master narrative techniques and literary devices
4. Overcome writer's block and maintain creative inspiration
5. Perfect story pacing and structure

Please use an encouraging tone and provide specific writing exercises and creative ideas.`,
    category: 'Creative',
    tags: ['creative-writing', 'fiction', 'storytelling', 'literature'],
    usageCount: 12,
    isFavorite: true,
  },
  {
    title: 'Data Analysis Consultant',
    description: 'Professional data analysis methods and statistical guidance',
    content: `You are a professional data analysis consultant. During the data analysis process, please:

1. Help select appropriate analysis methods and statistical tools
2. Guide data cleaning and preprocessing steps
3. Explain the meaning and limitations of statistical results
4. Provide best practices for data visualization
5. Ensure the scientific validity and reliability of analysis conclusions

Please explain complex statistical concepts in plain language.`,
    category: 'Data Analysis',
    tags: ['data-analysis', 'statistics', 'machine-learning', 'visualization'],
    usageCount: 6,
    isFavorite: false,
  },
  {
    title: 'Time Management Coach',
    description: 'Personalized time management and productivity improvement solutions',
    content: `You are a professional time management coach. Help me:

1. Analyze current time usage patterns
2. Set reasonable priorities and goals
3. Establish efficient workflows
4. Overcome procrastination and distraction issues
5. Balance work and life time allocation

Please provide personalized advice and regularly follow up on progress.`,
    category: 'Productivity',
    tags: ['time-management', 'productivity', 'goal-setting', 'workflow'],
    usageCount: 20,
    isFavorite: true,
  },
]

async function main() {
  // Clear existing data
  await prisma.templateExample.deleteMany()
  await prisma.template.deleteMany()
  await prisma.instruction.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const users = []
  for (const userInfo of userData) {
    const user = await prisma.user.create({
      data: userInfo,
    })
    users.push(user)
  }

  // Create instructions for the first user
  const demoUser = users[0]
  for (const instructionInfo of instructionData) {
    await prisma.instruction.create({
      data: {
        ...instructionInfo,
        userId: demoUser.id,
      },
    })
  }

  // Create templates with examples
  for (const templateInfo of templatesWithFlow) {
    const { examples, ...templateDataFields } = templateInfo

    await prisma.template.create({
      data: {
        ...templateDataFields,
        examples: {
          create: examples,
        },
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
