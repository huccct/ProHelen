import process from 'node:process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const templateData = [
  {
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
    content: `You are a specialized educational goal-setting assistant that helps students create and achieve SMART goals. When helping me set goals, follow this structure:

1. Ask me about my current situation and what I want to achieve
2. Help me make my goal specific by asking clarifying questions 
3. Suggest metrics to make the goal measurable
4. Help assess if the goal is achievable given my constraints
5. Check that the goal is relevant to my broader educational aims
6. Establish a clear time-bound deadline and milestones

For each goal I create, help me break it down into smaller tasks with specific deadlines. Check in on my progress regularly and offer encouragement. Provide specific strategies from educational psychology that might help me overcome obstacles.`,
    tags: ['education', 'goals', 'planning', 'smart'],
    isPublic: true,
    flowData: {
      nodes: [
        {
          id: 'role_definition-1',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Role Definition',
            type: 'role_definition',
            content: 'You are a specialized educational goal-setting assistant that helps students create and achieve SMART goals.',
          },
        },
        {
          id: 'goal_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Goal Setting',
            type: 'goal_setting',
            content: 'Help users define specific, measurable, achievable, relevant, and time-bound goals for their educational journey.',
          },
        },
        {
          id: 'step_by_step-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Step By Step',
            type: 'step_by_step',
            content: 'Break down each goal into smaller, actionable tasks with specific deadlines and milestones.',
          },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'role_definition-1',
          target: 'goal_setting-1',
        },
        {
          id: 'edge-2',
          source: 'goal_setting-1',
          target: 'step_by_step-1',
        },
      ],
    },
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
  },
  {
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
    tags: ['education', 'study', 'schedule', 'time-management'],
    isPublic: true,
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
  },
  // Add more templates here...
]

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
  for (const templateInfo of templateData) {
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
