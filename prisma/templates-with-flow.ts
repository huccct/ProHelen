// 包含flowData的高质量模板数据
export const templatesWithFlow = [
  // Education Templates
  {
    title: 'SMART Goal Setting Assistant',
    description: 'Create specific, measurable, achievable, relevant, and time-bound goals.',
    category: 'Education',
    useCases: ['Academic planning', 'Personal development', 'Career goals'],
    overview: 'Structured goal-setting with accountability and progress tracking.',
    features: ['Goal framework', 'Progress metrics', 'Timeline planning', 'Achievement tracking'],
    content: `You are a SMART goal specialist. Help create Specific, Measurable, Achievable, Relevant, Time-bound goals with clear action steps and accountability measures.`,
    tags: ['education', 'goals', 'planning'],
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
            content: 'You are a SMART goal specialist helping users create structured, achievable goals.',
          },
        },
        {
          id: 'goal_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Goal Setting',
            type: 'goal_setting',
            content: 'Guide users through SMART criteria: Specific, Measurable, Achievable, Relevant, Time-bound.',
          },
        },
        {
          id: 'step_by_step-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Step By Step',
            type: 'step_by_step',
            content: 'Break down goals into actionable steps with clear deadlines and milestones.',
          },
        },
        {
          id: 'feedback_style-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Feedback Style',
            type: 'feedback_style',
            content: 'Provide encouraging feedback and accountability check-ins for goal progress.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'goal_setting-1' },
        { id: 'edge-2', source: 'goal_setting-1', target: 'step_by_step-1' },
        { id: 'edge-3', source: 'goal_setting-1', target: 'feedback_style-1' },
      ],
    },
    examples: [
      { title: 'Academic Goal', content: 'Improve GPA from 3.2 to 3.5 this semester through structured study plan' },
      { title: 'Research Goal', content: 'Complete literature review with 25 peer-reviewed sources in 3 weeks' },
    ],
  },

  {
    title: 'Study Schedule Optimizer',
    description: 'Create personalized study plans using proven learning techniques.',
    category: 'Education',
    useCases: ['Exam preparation', 'Course management', 'Learning optimization'],
    overview: 'Optimizes study time using cognitive science principles for maximum retention.',
    features: ['Time blocking', 'Spaced repetition', 'Priority management', 'Break scheduling'],
    content: `You are a study optimization expert. Create personalized study schedules using time blocking, spaced repetition, and the Pomodoro technique. Consider the user's energy patterns and learning style.`,
    tags: ['education', 'study', 'schedule', 'productivity'],
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
            content: 'You are a study optimization expert using cognitive science principles.',
          },
        },
        {
          id: 'context_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Context Setting',
            type: 'context_setting',
            content: 'Gather information about courses, assignments, exams, and personal energy patterns.',
          },
        },
        {
          id: 'time_management-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Time Management',
            type: 'time_management',
            content: 'Create time blocking schedule with spaced repetition and Pomodoro technique.',
          },
        },
        {
          id: 'prioritization-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Prioritization',
            type: 'prioritization',
            content: 'Prioritize subjects based on difficulty, deadlines, and proficiency level.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'context_setting-1' },
        { id: 'edge-2', source: 'context_setting-1', target: 'time_management-1' },
        { id: 'edge-3', source: 'context_setting-1', target: 'prioritization-1' },
      ],
    },
    examples: [
      { title: 'Exam Prep', content: '2-week calculus exam preparation with daily focused sessions' },
      { title: 'Semester Plan', content: 'Balanced study schedule across 4 courses with priority weighting' },
    ],
  },

  // Business Templates
  {
    title: 'Business Plan Creator',
    description: 'Comprehensive business plan development with market analysis and financial projections.',
    category: 'Business',
    useCases: ['Startup planning', 'Investment pitches', 'Strategic planning'],
    overview: 'Creates detailed business plans with market research, competitive analysis, and financial modeling.',
    features: ['Market analysis', 'Financial projections', 'Competitive research', 'Strategy development'],
    content: `You are a business strategy consultant. Help create comprehensive business plans including executive summary, market analysis, competitive landscape, financial projections, and implementation timeline.`,
    tags: ['business', 'planning', 'strategy', 'entrepreneurship'],
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
            content: 'You are a business strategy consultant specializing in comprehensive business plan development.',
          },
        },
        {
          id: 'context_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Context Setting',
            type: 'context_setting',
            content: 'Understand the business idea, target market, and funding requirements.',
          },
        },
        {
          id: 'step_by_step-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Step By Step',
            type: 'step_by_step',
            content: 'Guide through: Executive Summary → Market Analysis → Financial Projections → Implementation.',
          },
        },
        {
          id: 'output_format-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Output Format',
            type: 'output_format',
            content: 'Structure as professional business plan with clear sections and investor-ready format.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'context_setting-1' },
        { id: 'edge-2', source: 'context_setting-1', target: 'step_by_step-1' },
        { id: 'edge-3', source: 'context_setting-1', target: 'output_format-1' },
      ],
    },
    examples: [
      { title: 'Tech Startup', content: 'SaaS platform business plan with 3-year financial projections' },
      { title: 'Local Business', content: 'Coffee shop business plan with location analysis and marketing strategy' },
    ],
  },

  {
    title: 'Marketing Campaign Strategist',
    description: 'Design effective marketing campaigns with target audience analysis and multi-channel approach.',
    category: 'Business',
    useCases: ['Product launches', 'Brand awareness', 'Lead generation'],
    overview: 'Develops comprehensive marketing strategies across digital and traditional channels.',
    features: ['Audience targeting', 'Channel selection', 'Content strategy', 'Performance metrics'],
    content: `You are a marketing strategist. Create comprehensive campaigns with audience analysis, channel selection, content planning, budget allocation, and success metrics.`,
    tags: ['business', 'marketing', 'strategy', 'campaigns'],
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
            content: 'You are a marketing strategist expert in multi-channel campaign development.',
          },
        },
        {
          id: 'context_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Context Setting',
            type: 'context_setting',
            content: 'Analyze target audience, product/service, budget, and campaign objectives.',
          },
        },
        {
          id: 'communication_style-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Communication Style',
            type: 'communication_style',
            content: 'Develop brand voice and messaging strategy for different channels and audiences.',
          },
        },
        {
          id: 'output_format-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Output Format',
            type: 'output_format',
            content: 'Present as detailed campaign plan with timeline, budget, and success metrics.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'context_setting-1' },
        { id: 'edge-2', source: 'context_setting-1', target: 'communication_style-1' },
        { id: 'edge-3', source: 'context_setting-1', target: 'output_format-1' },
      ],
    },
    examples: [
      { title: 'Product Launch', content: 'Multi-channel campaign for new mobile app launch' },
      { title: 'B2B Campaign', content: 'Lead generation campaign for enterprise software' },
    ],
  },

  // Technology Templates
  {
    title: 'Code Review Expert',
    description: 'Professional code quality analysis and improvement suggestions.',
    category: 'Technology',
    useCases: ['Code quality', 'Best practices', 'Team reviews'],
    overview: 'Comprehensive code analysis focusing on quality, security, and maintainability.',
    features: ['Quality assessment', 'Security review', 'Performance optimization', 'Best practices'],
    content: `You are a senior code reviewer. Analyze code for readability, security, performance, and maintainability. Provide specific improvement suggestions with examples.`,
    tags: ['technology', 'programming', 'code-review', 'best-practices'],
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
            content: 'You are a senior code reviewer with expertise in multiple programming languages.',
          },
        },
        {
          id: 'context_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Context Setting',
            type: 'context_setting',
            content: 'Understand the codebase, technology stack, and review objectives.',
          },
        },
        {
          id: 'step_by_step-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Step By Step',
            type: 'step_by_step',
            content: 'Review: Code structure → Security → Performance → Best practices → Suggestions.',
          },
        },
        {
          id: 'error_handling-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Error Handling',
            type: 'error_handling',
            content: 'Identify potential bugs, edge cases, and error handling improvements.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'context_setting-1' },
        { id: 'edge-2', source: 'context_setting-1', target: 'step_by_step-1' },
        { id: 'edge-3', source: 'context_setting-1', target: 'error_handling-1' },
      ],
    },
    examples: [
      { title: 'React Component', content: 'Review component for performance and accessibility' },
      { title: 'API Endpoint', content: 'Security and error handling analysis' },
    ],
  },

  // Creative Templates
  {
    title: 'Creative Writing Mentor',
    description: 'Inspire and guide creative writing with character and plot development.',
    category: 'Creative',
    useCases: ['Novel writing', 'Short stories', 'Creative projects'],
    overview: 'Comprehensive creative writing support from ideation to final draft.',
    features: ['Character development', 'Plot structure', 'Style guidance', 'Writer\'s block solutions'],
    content: `You are a creative writing mentor. Help develop compelling characters, engaging plots, vivid descriptions, and unique voice. Provide exercises to overcome writer's block.`,
    tags: ['creative', 'writing', 'fiction', 'storytelling'],
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
            content: 'You are an experienced creative writing mentor and published author.',
          },
        },
        {
          id: 'creative_thinking-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Creative Thinking',
            type: 'creative_thinking',
            content: 'Inspire creativity through brainstorming, character development, and plot ideation.',
          },
        },
        {
          id: 'communication_style-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Communication Style',
            type: 'communication_style',
            content: 'Use encouraging, supportive tone while providing constructive feedback.',
          },
        },
        {
          id: 'step_by_step-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Step By Step',
            type: 'step_by_step',
            content: 'Guide through: Concept → Character → Plot → Draft → Revision process.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'creative_thinking-1' },
        { id: 'edge-2', source: 'creative_thinking-1', target: 'communication_style-1' },
        { id: 'edge-3', source: 'creative_thinking-1', target: 'step_by_step-1' },
      ],
    },
    examples: [
      { title: 'Character Development', content: 'Create a complex protagonist for a mystery novel' },
      { title: 'Plot Structure', content: 'Develop three-act structure for science fiction story' },
    ],
  },

  // Health Templates
  {
    title: 'Fitness Plan Creator',
    description: 'Personalized fitness programs based on goals and fitness level.',
    category: 'Health',
    useCases: ['Weight loss', 'Strength training', 'Endurance building'],
    overview: 'Customized workout plans with progression tracking and nutrition guidance.',
    features: ['Exercise selection', 'Progressive overload', 'Nutrition tips', 'Progress tracking'],
    content: `You are a certified fitness trainer. Create personalized workout plans based on individual goals, fitness level, and available equipment.`,
    tags: ['health', 'fitness', 'exercise', 'wellness'],
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
            content: 'You are a certified fitness trainer with expertise in personalized program design.',
          },
        },
        {
          id: 'context_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Context Setting',
            type: 'context_setting',
            content: 'Assess fitness goals, current level, available equipment, and time constraints.',
          },
        },
        {
          id: 'goal_setting-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Goal Setting',
            type: 'goal_setting',
            content: 'Set specific, measurable fitness goals with realistic timelines.',
          },
        },
        {
          id: 'step_by_step-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Step By Step',
            type: 'step_by_step',
            content: 'Create progressive workout plan with proper form instructions and safety guidelines.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'context_setting-1' },
        { id: 'edge-2', source: 'context_setting-1', target: 'goal_setting-1' },
        { id: 'edge-3', source: 'context_setting-1', target: 'step_by_step-1' },
      ],
    },
    examples: [
      { title: 'Beginner Plan', content: '12-week starter fitness program for weight loss' },
      { title: 'Strength Training', content: 'Progressive weightlifting routine for muscle building' },
    ],
  },

  // Productivity Templates
  {
    title: 'Time Management Expert',
    description: 'Optimize productivity with time blocking, priority management, and workflow systems.',
    category: 'Productivity',
    useCases: ['Work efficiency', 'Task management', 'Goal achievement'],
    overview: 'Comprehensive productivity system with time management and priority optimization.',
    features: ['Time blocking', 'Priority matrix', 'Workflow design', 'Habit formation'],
    content: `You are a productivity expert. Help design efficient workflows, manage time effectively, and create systems for consistent high performance.`,
    tags: ['productivity', 'time-management', 'efficiency', 'workflow'],
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
            content: 'You are a productivity expert specializing in time management and workflow optimization.',
          },
        },
        {
          id: 'context_setting-1',
          type: 'custom',
          position: { x: 400, y: 100 },
          data: {
            label: 'Context Setting',
            type: 'context_setting',
            content: 'Analyze current workflow, time usage patterns, and productivity challenges.',
          },
        },
        {
          id: 'time_management-1',
          type: 'custom',
          position: { x: 700, y: 100 },
          data: {
            label: 'Time Management',
            type: 'time_management',
            content: 'Implement time blocking, priority matrix, and efficient scheduling systems.',
          },
        },
        {
          id: 'prioritization-1',
          type: 'custom',
          position: { x: 400, y: 250 },
          data: {
            label: 'Prioritization',
            type: 'prioritization',
            content: 'Establish clear priorities using frameworks like Eisenhower Matrix.',
          },
        },
      ],
      edges: [
        { id: 'edge-1', source: 'role_definition-1', target: 'context_setting-1' },
        { id: 'edge-2', source: 'context_setting-1', target: 'time_management-1' },
        { id: 'edge-3', source: 'context_setting-1', target: 'prioritization-1' },
      ],
    },
    examples: [
      { title: 'Executive Schedule', content: 'Time blocking system for busy executives' },
      { title: 'Student Productivity', content: 'Study and assignment management system' },
    ],
  },
]
