import type { BlockType, NodeMetadata } from '@/types/builder'
import { AlertTriangle, BarChart3, Book, Brain, CheckCircle, Clock, Compass, FileText, Filter, Globe, Heart, Lightbulb, MessageCircle, MessageSquare, Star, Target, Users, Workflow } from 'lucide-react'

export const STORAGE_KEYS = {
  TOUR_COMPLETED: 'prohelen-tour-completed',
} as const

export const PREVIEW_CONSTRAINTS = {
  MIN_WIDTH: 280,
  MAX_WIDTH: 600,
  DEFAULT_WIDTH: 320,
} as const

export const KEYBOARD_SHORTCUTS = {
  HELP: 'F1',
  ESCAPE: 'Escape',
  UNDO: 'z',
  REDO: 'y',
} as const

export const BLOCK_TYPES: BlockType[] = [
  // 1. Role & Context - Define AI's identity, background, and working environment
  {
    type: 'role_definition',
    labelKey: 'builder.components.blockPicker.blocks.roleDefinition.label',
    icon: <Users className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.roleDefinition.description',
    category: 'role_context',
    color: 'from-blue-500 to-blue-600',
  },
  {
    type: 'context_setting',
    labelKey: 'builder.components.blockPicker.blocks.contextSetting.label',
    icon: <Globe className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.contextSetting.description',
    category: 'role_context',
    color: 'from-purple-500 to-purple-600',
  },
  {
    type: 'personality_traits',
    labelKey: 'builder.components.blockPicker.blocks.personalityTraits.label',
    icon: <Heart className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.personalityTraits.description',
    category: 'role_context',
    color: 'from-rose-500 to-rose-600',
  },
  {
    type: 'subject_focus',
    labelKey: 'builder.components.blockPicker.blocks.subjectFocus.label',
    icon: <Book className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.subjectFocus.description',
    category: 'role_context',
    color: 'from-indigo-500 to-indigo-600',
  },

  // 2. Interaction Style - Communication patterns and feedback approaches
  {
    type: 'communication_style',
    labelKey: 'builder.components.blockPicker.blocks.communicationStyle.label',
    icon: <MessageCircle className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.communicationStyle.description',
    category: 'interaction_style',
    color: 'from-teal-500 to-teal-600',
  },
  {
    type: 'feedback_style',
    labelKey: 'builder.components.blockPicker.blocks.feedbackStyle.label',
    icon: <MessageSquare className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.feedbackStyle.description',
    category: 'interaction_style',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    type: 'learning_style',
    labelKey: 'builder.components.blockPicker.blocks.learningStyle.label',
    icon: <Brain className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.learningStyle.description',
    category: 'interaction_style',
    color: 'from-pink-500 to-pink-600',
  },

  // 3. Task Control - Goal setting, output formatting, and task management
  {
    type: 'goal_setting',
    labelKey: 'builder.components.blockPicker.blocks.goalSetting.label',
    icon: <Target className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.goalSetting.description',
    category: 'task_control',
    color: 'from-orange-500 to-orange-600',
  },
  {
    type: 'output_format',
    labelKey: 'builder.components.blockPicker.blocks.outputFormat.label',
    icon: <FileText className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.outputFormat.description',
    category: 'task_control',
    color: 'from-green-500 to-green-600',
  },
  {
    type: 'difficulty_level',
    labelKey: 'builder.components.blockPicker.blocks.difficultyLevel.label',
    icon: <BarChart3 className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.difficultyLevel.description',
    category: 'task_control',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    type: 'time_management',
    labelKey: 'builder.components.blockPicker.blocks.timeManagement.label',
    icon: <Clock className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.timeManagement.description',
    category: 'task_control',
    color: 'from-amber-500 to-amber-600',
  },
  {
    type: 'prioritization',
    labelKey: 'builder.components.blockPicker.blocks.prioritization.label',
    icon: <Star className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.prioritization.description',
    category: 'task_control',
    color: 'from-emerald-500 to-emerald-600',
  },

  // 4. Thinking & Logic - Cognitive processes and reasoning patterns
  {
    type: 'creative_thinking',
    labelKey: 'builder.components.blockPicker.blocks.creativeThinking.label',
    icon: <Lightbulb className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.creativeThinking.description',
    category: 'thinking_logic',
    color: 'from-lime-500 to-lime-600',
  },
  {
    type: 'step_by_step',
    labelKey: 'builder.components.blockPicker.blocks.stepByStep.label',
    icon: <Workflow className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.stepByStep.description',
    category: 'thinking_logic',
    color: 'from-violet-500 to-violet-600',
  },
  {
    type: 'conditional_logic',
    labelKey: 'builder.components.blockPicker.blocks.conditionalLogic.label',
    icon: <Filter className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.conditionalLogic.description',
    category: 'thinking_logic',
    color: 'from-gray-500 to-gray-600',
  },
  {
    type: 'error_handling',
    labelKey: 'builder.components.blockPicker.blocks.errorHandling.label',
    icon: <AlertTriangle className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.errorHandling.description',
    category: 'thinking_logic',
    color: 'from-red-500 to-red-600',
  },

  // 5. Skills & Development - Professional growth and skill assessment
  {
    type: 'career_planning',
    labelKey: 'builder.components.blockPicker.blocks.careerPlanning.label',
    icon: <Compass className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.careerPlanning.description',
    category: 'skills_development',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    type: 'skill_assessment',
    labelKey: 'builder.components.blockPicker.blocks.skillAssessment.label',
    icon: <CheckCircle className="h-5 w-5" />,
    descriptionKey: 'builder.components.blockPicker.blocks.skillAssessment.description',
    category: 'skills_development',
    color: 'from-green-600 to-teal-600',
  },
]

export const CATEGORIES = [
  { id: 'quick-start', labelKey: 'builder.components.blockPicker.categories.quickStart' },
  { id: 'all', labelKey: 'builder.components.blockPicker.categories.all' },
  { id: 'role_context', labelKey: 'builder.components.blockPicker.categories.roleContext' },
  { id: 'interaction_style', labelKey: 'builder.components.blockPicker.categories.interactionStyle' },
  { id: 'task_control', labelKey: 'builder.components.blockPicker.categories.taskControl' },
  { id: 'thinking_logic', labelKey: 'builder.components.blockPicker.categories.thinkingLogic' },
  { id: 'skills_development', labelKey: 'builder.components.blockPicker.categories.skillsDevelopment' },
]

export const QUICK_START_TEMPLATES = [
  {
    id: 'tutor',
    labelKey: 'builder.components.blockPicker.quickStart.tutor.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.tutor.description',
    icon: <Brain className="h-5 w-5" />,
    blocks: ['role_definition', 'context_setting', 'learning_style', 'goal_setting', 'step_by_step'],
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'business_consultant',
    labelKey: 'builder.components.blockPicker.quickStart.businessConsultant.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.businessConsultant.description',
    icon: <Target className="h-5 w-5" />,
    blocks: ['role_definition', 'context_setting', 'communication_style', 'output_format', 'prioritization'],
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'creative_assistant',
    labelKey: 'builder.components.blockPicker.quickStart.creativeAssistant.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.creativeAssistant.description',
    icon: <Lightbulb className="h-5 w-5" />,
    blocks: ['role_definition', 'personality_traits', 'creative_thinking', 'output_format', 'feedback_style'],
    color: 'from-orange-500 to-pink-500',
  },
  {
    id: 'step_by_step_guide',
    labelKey: 'builder.components.blockPicker.quickStart.stepByStepGuide.label',
    descriptionKey: 'builder.components.blockPicker.quickStart.stepByStepGuide.description',
    icon: <Workflow className="h-5 w-5" />,
    blocks: ['role_definition', 'context_setting', 'step_by_step', 'output_format', 'error_handling'],
    color: 'from-purple-500 to-indigo-500',
  },
]

export const SCROLL_CONFIG = {
  PERCENTAGE: 0.8,
  MAX_AMOUNT: 280,
  ANIMATION_DURATION: 350,
  CHECK_DELAY: 50,
  INITIAL_CHECK_DELAY: 100,
} as const

export const TEMPLATE_ANIMATION = {
  DELAY_PER_BLOCK: 200,
} as const

export const CSS_CLASSES_BLOCK_PICKER = {
  scrollContainer: 'flex gap-2 overflow-x-auto scroll-smooth custom-scroll',
  scrollButton: 'cursor-pointer absolute top-0 h-full w-10 bg-gradient-to flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-out z-10 transform hover:scale-110 active:scale-95 active:bg-muted/70',
  scrollButtonDisabled: 'opacity-30 cursor-not-allowed',
  scrollButtonEnabled: 'opacity-80 hover:opacity-100 hover:shadow-lg hover:shadow-foreground/10',
  categoryButton: 'flex items-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer',
  templateCard: 'group relative overflow-hidden flex flex-col gap-4 p-6 border border-border rounded-xl hover:bg-muted/50 hover:border-primary/50 cursor-pointer transition-all duration-300 transform hover:scale-105',
  blockCard: 'group relative overflow-hidden flex flex-col items-center gap-3 p-4 border border-border rounded-xl hover:bg-muted/50 hover:border-border/80 cursor-pointer transition-all duration-300 transform hover:scale-105',
} as const

export const SCORING_CONFIG = {
  CORE_BLOCKS: {
    ROLE_DEFINITION: 20,
    CONTEXT_SETTING: 20,
    OUTPUT_FORMAT: 20,
  },
  SUPPLEMENTARY: {
    TASK_CLARITY: 15,
    COMMUNICATION_STYLE: 10,
    CONTENT_QUALITY: 15,
    EXAMPLES: 10,
    DIVERSITY: 10,
  },
  BONUS: {
    HIGH_CONTENT_QUALITY: 5,
    HIGH_DIVERSITY: 5,
  },
  THRESHOLDS: {
    CONTENT_COMPLETENESS: 75,
    HIGH_CONTENT_QUALITY: 90,
    HIGH_DIVERSITY: 3,
    MIN_CONTENT_LENGTH: 20,
  },
} as const

export const STATUS_CONFIG = {
  EXCELLENT: { threshold: 80, status: 'excellent', color: 'text-green-600', bgColor: 'bg-green-100' },
  GOOD: { threshold: 60, status: 'good', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  FAIR: { threshold: 30, status: 'fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  STARTING: { threshold: 0, status: 'starting', color: 'text-gray-600', bgColor: 'bg-gray-100' },
} as const

export const TASK_KEYWORDS = {
  ZH: ['任务', '目标', '需要', '帮助'],
  EN: ['task', 'goal', 'need', 'help'],
} as const

export const EXAMPLE_KEYWORDS = {
  ZH: ['例如', '示例', '比如'],
  EN: ['example', 'for example', 'such as'],
} as const

export const NODE_CATEGORIES = {
  CORE: ['role_definition', 'context_setting', 'output_format'],
  EDUCATION: ['goal_setting', 'learning_style', 'subject_focus', 'difficulty_level'],
  BEHAVIOR: ['communication_style', 'feedback_style', 'personality_traits'],
  WORKFLOW: ['step_by_step', 'time_management', 'prioritization'],
  ADVANCED: ['conditional_logic', 'creative_thinking', 'error_handling'],
  PLANNING: ['career_planning', 'skill_assessment'],
} as const

export const ANIMATION_CONFIG = {
  PROGRESS_BAR: { duration: 1, ease: 'easeOut' },
  CHECKLIST_ITEM: { delay: 0.1 },

} as const

export const ANALYSIS_CONFIG = {
  PROGRESS_STEPS: [
    { progress: 15, delay: 200 },
    { progress: 35, delay: 500 },
    { progress: 60, delay: 800 },
    { progress: 85, delay: 1200 },
    { progress: 99, delay: 1500 },
  ],
  FINAL_PROGRESS_DELAY: 300,
  CAROUSEL_INTERVAL: 4000,
  TEXTAREA_MIN_HEIGHT: 120,
  TEXTAREA_MAX_HEIGHT: 300,
} as const

export const CAROUSEL_CONFIG = {
  ITEMS_TO_SHOW: 3,
  EXAMPLES: [
    'learning',
    'work',
    'writing',
    'personal',
    'research',
    'business',
    'creative',
    'data',
    'marketing',
    'legal',
    'health',
    'finance',
  ],
} as const

export const IMPACT_COLORS = {
  high: 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-300',
} as const

export const CONTENT_HEADERS = {
  USER_INTERACTION: '## User Interaction Guidelines',
  RESPONSE_GUIDELINES: '## Response Guidelines',
} as const

export const EXPORT_CONFIG = {
  FILENAME: 'prompt-export.json',
  MIME_TYPE: 'application/json',
} as const

export const UI_CONFIG = {
  CHAR_DISPLAY_THRESHOLD: 1,
  TEXTAREA_SCROLL_CONFIG: {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
  },
} as const

export const FORM_CONFIG = {
  TEXTAREA_ROWS: 3,
  MAX_TAG_LENGTH: 20,
  MAX_TAGS_COUNT: 10,
  TAG_SEPARATORS: ['Enter', ','],
  VALIDATION: {
    MIN_TITLE_LENGTH: 1,
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
  },
} as const

export const CATEGORY_KEYS = [
  'general',
  'academic',
  'writing',
  'programming',
  'dataAnalysis',
  'creative',
  'productivity',
  'research',
  'education',
  'business',
] as const

export const CSS_CLASSES_SAVE_INSTRUCTION_MODAL = {
  tag: 'bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-primary/20 hover:bg-primary/20 transition-colors',
  tagRemoveButton: 'text-primary/60 hover:text-primary hover:bg-primary/20 w-4 h-4 rounded-full flex items-center justify-center transition-colors cursor-pointer',
  addTagButton: 'absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer',
} as const

export const CHAT_CONFIG = {
  MAX_INPUT_LENGTH: 2000,
  TEXTAREA_MIN_HEIGHT: 52,
  TEXTAREA_MAX_HEIGHT: 200,
  AUTO_FOCUS_DELAY: 100,
  SCROLL_BEHAVIOR: 'smooth' as const,
} as const

export const ANIMATION_CONFIG_TEST_PROMPT_MODAL = {
  BOUNCE_DELAYS: ['-0.3s', '-0.15s', '0s'],
  TRANSITION_DURATION: 'transition-opacity',
} as const

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const

export const CSS_CLASSES_TEST_PROMPT_MODAL = {
  userAvatar: 'bg-primary text-primary-foreground',
  assistantAvatar: 'bg-gradient-to-br from-primary/20 to-primary/10',
  messageGroup: 'group',
  actionButton: 'h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer',
  sendButton: 'h-8 w-8 p-0 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg text-primary-foreground',
  stopButton: 'h-8 w-8 p-0 bg-red-500 hover:bg-red-600 cursor-pointer shadow-lg',
} as const

// block priority based on 5-category system (lower number = higher priority)
export const BLOCK_PRIORITY: Record<string, number> = {
  // 1. Role & Context (Foundation - Highest Priority)
  role_definition: 1,
  context_setting: 2,
  personality_traits: 3,
  subject_focus: 4,

  // 2. Interaction Style (Communication Layer)
  communication_style: 5,
  learning_style: 6,
  feedback_style: 7,

  // 3. Task Control (Execution Framework)
  goal_setting: 8,
  output_format: 9,
  difficulty_level: 10,
  time_management: 11,
  prioritization: 12,

  // 4. Thinking & Logic (Processing Methods)
  step_by_step: 13,
  creative_thinking: 14,
  conditional_logic: 15,
  error_handling: 16,

  // 5. Skills & Development (Specialized Functions)
  skill_assessment: 17,
  career_planning: 18,
}

// connection rules following logical flow: Role & Context → Interaction → Task Control → Thinking → Skills
export const CONNECTION_RULES: Record<string, string[]> = {
  // 1. Role & Context → Interaction Style
  role_definition: ['context_setting', 'communication_style', 'personality_traits'],
  context_setting: ['subject_focus', 'goal_setting', 'communication_style'],
  personality_traits: ['communication_style', 'feedback_style', 'creative_thinking'],
  subject_focus: ['learning_style', 'difficulty_level', 'goal_setting'],

  // 2. Interaction Style → Task Control
  communication_style: ['output_format', 'feedback_style', 'goal_setting'],
  learning_style: ['difficulty_level', 'step_by_step', 'goal_setting'],
  feedback_style: ['output_format', 'error_handling'],

  // 3. Task Control → Thinking & Logic
  goal_setting: ['output_format', 'prioritization', 'step_by_step'],
  output_format: ['step_by_step', 'creative_thinking'],
  difficulty_level: ['step_by_step', 'conditional_logic'],
  time_management: ['prioritization', 'step_by_step'],
  prioritization: ['conditional_logic', 'time_management'],

  // 4. Thinking & Logic → Advanced Processing
  step_by_step: ['error_handling', 'conditional_logic'],
  creative_thinking: ['conditional_logic', 'error_handling'],
  conditional_logic: ['error_handling'],
  error_handling: [], // Terminal node

  // 5. Skills & Development (Can connect across categories)
  skill_assessment: ['career_planning', 'difficulty_level', 'goal_setting'],
  career_planning: ['goal_setting', 'prioritization'],
}

// quick start content
export const QUICK_START_CONTENT: Record<string, Record<string, string>> = {
  tutor: {
    role_definition: `You are an expert AI tutor and learning coach with 10+ years of educational experience. Your specializations include:
- Transforming complex concepts into clear, digestible explanations using analogies and examples
- Designing personalized learning paths based on individual cognitive styles and pace
- Creating engaging, interactive learning experiences that promote active participation
- Building learner confidence through positive reinforcement and scaffolded challenges
- Adapting instructional methods across diverse subjects and skill levels`,
    context_setting: `Educational context and learning environment:
- Focus on creating a supportive and encouraging learning atmosphere
- Consider the user's current knowledge level and learning objectives
- Adapt to various educational settings (academic, professional, personal growth)
- Build upon prior knowledge while introducing new concepts gradually`,
    learning_style: `Adapt your teaching approach to be interactive and engaging:
- Use examples, analogies, and real-world applications
- Encourage questions and provide step-by-step explanations
- Offer multiple ways to understand the same concept
- Provide immediate feedback and positive reinforcement
- Adjust difficulty based on user progress and understanding`,
    goal_setting: `Learning objectives and measurable outcomes:
- Establish SMART learning goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Create progressive milestones that build confidence and maintain motivation
- Design assessment checkpoints to track comprehension and skill development
- Connect learning activities to real-world applications and learner interests
- Foster learner autonomy by encouraging self-directed goal setting and reflection`,
    step_by_step: `Provide systematic learning guidance:
- Break complex topics into digestible, sequential steps
- Ensure each step builds upon previous knowledge
- Provide clear instructions and examples for each stage
- Check for understanding before moving to the next step
- Offer additional practice and reinforcement when needed`,
  },
  business_consultant: {
    role_definition: `You are a strategic business consultant with expertise in:
- Business strategy and planning
- Market analysis and competitive intelligence
- Operational efficiency and process optimization
- Financial planning and risk assessment
- Leadership development and organizational change`,
    context_setting: `Business consulting context and environment:
- Understand the client's industry, market position, and competitive landscape
- Consider current business challenges, opportunities, and constraints
- Assess organizational culture, resources, and capabilities
- Factor in regulatory environment and market trends
- Align recommendations with business objectives and stakeholder interests`,
    communication_style: `Maintain a professional and analytical communication style:
- Be direct, clear, and results-oriented
- Use data-driven insights and evidence-based recommendations
- Present information in structured, logical formats
- Ask probing questions to understand business context
- Focus on actionable solutions and measurable outcomes`,
    output_format: `Structure all business recommendations as follows:
## Executive Summary
Brief overview of key findings and recommendations

## Analysis
Detailed assessment of the situation, including:
- Current state evaluation
- Key challenges and opportunities
- Market/competitive factors

## Recommendations
1. Priority actions with specific steps
2. Timeline and resource requirements
3. Expected outcomes and success metrics
4. Risk mitigation strategies`,
    prioritization: `Strategic prioritization framework:
- Assess impact vs. effort for all recommended actions
- Consider short-term wins alongside long-term strategic goals
- Identify critical path dependencies and resource constraints
- Balance risk tolerance with potential returns
- Establish clear decision criteria and success metrics for prioritization`,
  },
  creative_assistant: {
    role_definition: `You are a creative AI assistant specializing in:
- Brainstorming and idea generation
- Creative problem-solving and innovation
- Artistic and design thinking processes
- Writing and content creation
- Inspiring and nurturing creativity in others`,
    personality_traits: `Embody an inspiring and enthusiastic personality:
- Be energetic, optimistic, and encouraging
- Show genuine excitement about creative possibilities
- Embrace experimentation and celebrate "beautiful failures"
- Use vivid language and engaging storytelling
- Balance imagination with practical application`,
    creative_thinking: `Foster creativity through innovative approaches:
- Encourage out-of-the-box thinking and unconventional solutions
- Use techniques like mind mapping, word association, and scenario building
- Combine seemingly unrelated concepts to generate fresh ideas
- Challenge assumptions and explore alternative perspectives
- Provide inspiration from diverse fields and disciplines`,
    output_format: `Present creative ideas in engaging formats:
## Creative Concept
Brief, compelling overview of the main idea

## Inspiration & Context
- Sources of inspiration and creative influences
- Relevant trends, themes, or artistic movements
- Connection to user's creative goals

## Development & Execution
- Detailed exploration of the concept
- Multiple variations and creative directions
- Practical steps for implementation
- Resources and tools needed`,
    feedback_style: `Provide constructive creative feedback:
- Focus on strengths and creative potential first
- Offer specific, actionable suggestions for improvement
- Encourage experimentation and iteration
- Balance critique with encouragement and inspiration
- Help refine ideas while maintaining creative vision`,
  },
  step_by_step_guide: {
    role_definition: `You are a systematic guide specializing in:
- Breaking down complex tasks into manageable steps
- Creating clear, actionable instructions
- Helping users navigate multi-step processes
- Ensuring nothing important is missed
- Building confidence through structured approaches`,
    context_setting: `Process guidance context and environment:
- Understand the user's experience level and familiarity with the task
- Consider available resources, tools, and time constraints
- Assess potential obstacles and preparation requirements
- Factor in safety considerations and best practices
- Align the process with the user's specific goals and circumstances`,
    step_by_step: `Always provide instructions in clear, sequential steps:

**Step 1: [Action]**
- Detailed explanation of what to do
- Why this step is important
- What to expect as a result

**Step 2: [Next Action]**
- Clear instructions for the next phase
- Any prerequisite requirements
- Common mistakes to avoid

**Continue this pattern for all steps...**`,
    output_format: `Structure all step-by-step guides as follows:
## Overview
Brief summary of the process and expected outcomes

## Prerequisites
- Required materials, tools, or knowledge
- Preparation steps needed
- Estimated time required

## Step-by-Step Instructions
Numbered steps with detailed explanations

## Troubleshooting
Common issues and their solutions

## Next Steps
What to do after completion`,
    error_handling: `Anticipate and address potential issues:
- Identify common mistakes and how to avoid them
- Provide troubleshooting guidance for when things go wrong
- Offer alternative approaches if the primary method fails
- Include safety checks and quality verification steps
- Encourage users to ask questions when uncertain`,
  },
}

// Chinese version of quick start content
export const QUICK_START_CONTENT_ZH: Record<string, Record<string, string>> = {
  tutor: {
    role_definition: `你是一位拥有10年以上教育经验的专业AI导师和学习教练。你的专业领域包括：
- 运用类比和实例将复杂概念转化为清晰易懂的解释
- 基于个人认知风格和学习节奏设计个性化学习路径
- 创造引人入胜的互动学习体验，促进主动参与
- 通过正面强化和渐进式挑战建立学习者信心
- 适应不同学科和技能水平的教学方法`,
    context_setting: `教育背景和学习环境：
- 专注于创造支持性和鼓励性的学习氛围
- 考虑用户当前的知识水平和学习目标
- 适应各种教育环境（学术、职业、个人成长）
- 在引入新概念的同时建立在已有知识基础上`,
    learning_style: `采用互动性和吸引力的教学方法：
- 使用实例、类比和现实应用
- 鼓励提问并提供逐步解释
- 提供理解同一概念的多种方式
- 提供即时反馈和正面强化
- 根据用户进步和理解调整难度`,
    goal_setting: `学习目标和可衡量的成果：
- 建立SMART学习目标（具体、可衡量、可实现、相关、有时限）
- 创建渐进式里程碑，建立信心并保持动力
- 设计评估检查点来跟踪理解和技能发展
- 将学习活动与现实应用和学习者兴趣联系起来
- 通过鼓励自主目标设定和反思培养学习者自主性`,
    step_by_step: `提供系统性学习指导：
- 将复杂主题分解为易消化的顺序步骤
- 确保每个步骤都建立在先前知识基础上
- 为每个阶段提供清晰的说明和示例
- 在进入下一步之前检查理解情况
- 在需要时提供额外的练习和强化`,
  },
  business_consultant: {
    role_definition: `你是一位战略商业顾问，在以下领域具有专业知识：
- 商业战略和规划
- 市场分析和竞争情报
- 运营效率和流程优化
- 财务规划和风险评估
- 领导力发展和组织变革`,
    context_setting: `商业咨询背景和环境：
- 了解客户的行业、市场地位和竞争格局
- 考虑当前的商业挑战、机遇和约束
- 评估组织文化、资源和能力
- 考虑监管环境和市场趋势
- 将建议与商业目标和利益相关者利益保持一致`,
    communication_style: `保持专业和分析性的沟通风格：
- 直接、清晰且以结果为导向
- 使用数据驱动的洞察和基于证据的建议
- 以结构化、逻辑性的格式呈现信息
- 提出探索性问题以了解商业背景
- 专注于可行的解决方案和可衡量的结果`,
    output_format: `按以下格式构建所有商业建议：
## 执行摘要
关键发现和建议的简要概述

## 分析
情况的详细评估，包括：
- 当前状态评估
- 关键挑战和机遇
- 市场/竞争因素

## 建议
1. 优先行动和具体步骤
2. 时间表和资源要求
3. 预期结果和成功指标
4. 风险缓解策略`,
    prioritization: `战略优先级框架：
- 评估所有推荐行动的影响与努力比
- 在短期收益与长期战略目标之间取得平衡
- 识别关键路径依赖性和资源约束
- 平衡风险承受能力与潜在回报
- 建立明确的决策标准和优先级成功指标`,
  },
  creative_assistant: {
    role_definition: `你是一位专业的创意AI助手，专长领域包括：
- 头脑风暴和创意生成
- 创造性问题解决和创新
- 艺术和设计思维过程
- 写作和内容创作
- 激发和培养他人的创造力`,
    personality_traits: `体现鼓舞人心和热情的个性：
- 充满活力、乐观和鼓励
- 对创意可能性表现出真正的兴奋
- 拥抱实验并庆祝"美丽的失败"
- 使用生动的语言和引人入胜的叙述
- 在想象力与实际应用之间取得平衡`,
    creative_thinking: `通过创新方法培养创造力：
- 鼓励跳出框框的思维和非常规解决方案
- 使用思维导图、词汇联想和情景构建等技巧
- 结合看似无关的概念产生新鲜想法
- 挑战假设并探索替代观点
- 从不同领域和学科提供灵感`,
    output_format: `以引人入胜的格式呈现创意想法：
## 创意概念
主要想法的简洁、吸引人概述

## 灵感与背景
- 灵感来源和创意影响
- 相关趋势、主题或艺术运动
- 与用户创意目标的联系

## 发展与执行
- 概念的详细探索
- 多种变化和创意方向
- 实施的实际步骤
- 所需资源和工具`,
    feedback_style: `提供建设性的创意反馈：
- 首先关注优势和创意潜力
- 提供具体的、可行的改进建议
- 鼓励实验和迭代
- 在批评与鼓励和灵感之间取得平衡
- 帮助完善想法同时保持创意愿景`,
  },
  step_by_step_guide: {
    role_definition: `你是一位系统化指导专家，专长于：
- 将复杂任务分解为可管理的步骤
- 创建清晰、可行的指导说明
- 帮助用户导航多步骤过程
- 确保不遗漏重要环节
- 通过结构化方法建立信心`,
    context_setting: `过程指导背景和环境：
- 了解用户的经验水平和对任务的熟悉程度
- 考虑可用资源、工具和时间约束
- 评估潜在障碍和准备要求
- 考虑安全考虑和最佳实践
- 使过程与用户的具体目标和情况保持一致`,
    step_by_step: `始终以清晰的顺序步骤提供指导：

**步骤1：[行动]**
- 详细解释要做什么
- 为什么这一步很重要
- 预期的结果

**步骤2：[下一个行动]**
- 下一阶段的清晰指导
- 任何先决条件要求
- 避免常见错误

**继续这种模式处理所有步骤...**`,
    output_format: `按以下格式构建所有分步指南：
## 概述
过程和预期结果的简要总结

## 先决条件
- 所需材料、工具或知识
- 需要的准备步骤
- 估计所需时间

## 分步说明
带有详细解释的编号步骤

## 故障排除
常见问题及其解决方案

## 下一步
完成后要做的事情`,
    error_handling: `预期并解决潜在问题：
- 识别常见错误以及如何避免它们
- 为出现问题时提供故障排除指导
- 如果主要方法失败，提供替代方法
- 包括安全检查和质量验证步骤
- 鼓励用户在不确定时提问`,
  },
}

export const NODE_CONFIG = {
  MIN_WIDTH: 200,
  MIN_HEIGHT: 100,
  MAX_WIDTH: 500,
  MAX_HEIGHT: 600,
  DEFAULT_MIN_WIDTH: 240,
  DEFAULT_MAX_WIDTH: 320,
  FOCUS_DELAY: 100,
  TEXTAREA_MIN_HEIGHT: 120,
  TEXTAREA_MAX_HEIGHT: 300,
} as const

export const HANDLE_STYLES = {
  target: '!bg-muted !border-border !w-3 !h-3 !opacity-60 !pointer-events-none !z-10',
  source: '!bg-muted !border-border !w-3 !h-3 !opacity-60 !pointer-events-none !z-10',
} as const

export const CSS_CLASSES_CUSTOM_NODE = {
  container: 'group relative',
  selected: 'ring-2 ring-primary ring-offset-2 ring-offset-background',
  card: 'relative overflow-hidden rounded-xl border-2 transition-all duration-300 backdrop-blur-sm',
  cardDefault: 'border-border bg-card/80 hover:border-border/80 hover:bg-card/90',
  cardEditing: 'border-foreground bg-card',
  header: 'px-4 py-3 bg-gradient-to-r bg-opacity-10 border-b border-border relative',
  iconContainer: 'flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br bg-opacity-20 border border-border relative z-10 group-hover:bg-opacity-30 transition-all duration-300',
  icon: 'text-foreground text-sm group-hover:scale-110 transition-transform duration-300',
  actionButtons: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
  content: 'px-4 py-3',
  textarea: 'w-full min-h-[120px] max-h-[300px] p-3 text-sm bg-background border border-border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 overflow-y-auto select-text cursor-text scrollbar',
  actions: 'flex justify-end gap-2',
  placeholder: 'italic text-muted-foreground/70',
  statusDot: 'w-2 h-2 bg-green-500 rounded-full opacity-60',
} as const

export const NODE_METADATA: Record<string, NodeMetadata> = {
  // 1. Role & Context - Define AI's identity, background, and working environment
  role_definition: {
    icon: <Users className="h-4 w-4" />,
    description: 'Define assistant role and expertise',
    colors: { gradient: 'from-blue-500 to-blue-600', border: 'border-blue-500/30' },
  },
  context_setting: {
    icon: <Globe className="h-4 w-4" />,
    description: 'Set background and work environment',
    colors: { gradient: 'from-purple-500 to-purple-600', border: 'border-purple-500/30' },
  },
  personality_traits: {
    icon: <Heart className="h-4 w-4" />,
    description: 'Define AI personality traits',
    colors: { gradient: 'from-rose-500 to-rose-600', border: 'border-rose-500/30' },
  },
  subject_focus: {
    icon: <Book className="h-4 w-4" />,
    description: 'Specify main topic or domain',
    colors: { gradient: 'from-indigo-500 to-indigo-600', border: 'border-indigo-500/30' },
  },

  // 2. Interaction Style - Communication patterns and feedback approaches
  communication_style: {
    icon: <MessageCircle className="h-4 w-4" />,
    description: 'Define tone and communication style',
    colors: { gradient: 'from-teal-500 to-teal-600', border: 'border-teal-500/30' },
  },
  feedback_style: {
    icon: <MessageSquare className="h-4 w-4" />,
    description: 'How to provide feedback',
    colors: { gradient: 'from-cyan-500 to-cyan-600', border: 'border-cyan-500/30' },
  },
  learning_style: {
    icon: <Brain className="h-4 w-4" />,
    description: 'Teaching approach and methodology',
    colors: { gradient: 'from-pink-500 to-pink-600', border: 'border-pink-500/30' },
  },

  // 3. Task Control - Goal setting, output formatting, and task management
  goal_setting: {
    icon: <Target className="h-4 w-4" />,
    description: 'Set goals and expected outcomes',
    colors: { gradient: 'from-orange-500 to-orange-600', border: 'border-orange-500/30' },
  },
  output_format: {
    icon: <FileText className="h-4 w-4" />,
    description: 'Define response format',
    colors: { gradient: 'from-green-500 to-green-600', border: 'border-green-500/30' },
  },
  difficulty_level: {
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Specify complexity level',
    colors: { gradient: 'from-yellow-500 to-yellow-600', border: 'border-yellow-500/30' },
  },
  time_management: {
    icon: <Clock className="h-4 w-4" />,
    description: 'Consider time constraints',
    colors: { gradient: 'from-amber-500 to-amber-600', border: 'border-amber-500/30' },
  },
  prioritization: {
    icon: <Star className="h-4 w-4" />,
    description: 'Define task priorities',
    colors: { gradient: 'from-emerald-500 to-emerald-600', border: 'border-emerald-500/30' },
  },

  // 4. Thinking & Logic - Cognitive processes and reasoning patterns
  creative_thinking: {
    icon: <Lightbulb className="h-4 w-4" />,
    description: 'Activate creative thinking',
    colors: { gradient: 'from-lime-500 to-lime-600', border: 'border-lime-500/30' },
  },
  step_by_step: {
    icon: <Workflow className="h-4 w-4" />,
    description: 'Provide step-by-step reasoning',
    colors: { gradient: 'from-violet-500 to-violet-600', border: 'border-violet-500/30' },
  },
  conditional_logic: {
    icon: <Filter className="h-4 w-4" />,
    description: 'Define conditional responses',
    colors: { gradient: 'from-gray-500 to-gray-600', border: 'border-gray-500/30' },
  },
  error_handling: {
    icon: <AlertTriangle className="h-4 w-4" />,
    description: 'Error response strategy',
    colors: { gradient: 'from-red-500 to-red-600', border: 'border-red-500/30' },
  },

  // 5. Skills & Development - Professional growth and skill assessment
  career_planning: {
    icon: <Compass className="h-4 w-4" />,
    description: 'Career development guidance',
    colors: { gradient: 'from-blue-600 to-indigo-600', border: 'border-blue-600/30' },
  },
  skill_assessment: {
    icon: <CheckCircle className="h-4 w-4" />,
    description: 'Skills evaluation and positioning',
    colors: { gradient: 'from-green-600 to-teal-600', border: 'border-green-600/30' },
  },
}

export const DEFAULT_NODE_METADATA: NodeMetadata = {
  icon: <FileText className="h-4 w-4" />,
  description: 'Custom instruction',
  colors: { gradient: 'from-gray-500 to-gray-600', border: 'border-gray-500/30' },
}

export const STORE_CONFIG = {
  MAX_HISTORY_SIZE: 50,
  NODE_SPACING: 350,
  START_X: 200,
  BASE_Y: 150,
  ENHANCEMENT_BASE_Y: 200,
  ANIMATION_DELAY: 50,
  FOCUS_DELAY: 100,
} as const

export const NODE_LABELS: Record<string, string> = {
  step_by_step: 'Step by Step',
  role_definition: 'Role Definition',
  context_setting: 'Context Setting',
  output_format: 'Output Format',
  goal_setting: 'Goal Setting',
  learning_style: 'Learning Style',
  subject_focus: 'Subject Focus',
  difficulty_level: 'Difficulty Level',
  communication_style: 'Communication Style',
  creative_thinking: 'Creative Thinking',
  conditional_logic: 'Conditional Logic',
  personality_traits: 'Personality Traits',
  error_handling: 'Error Handling',
  feedback_style: 'Feedback Style',
  time_management: 'Time Management',
  prioritization: 'Prioritization',
  career_planning: 'Career Planning',
  skill_assessment: 'Skill Assessment',
} as const

export const CONTENT_CATEGORIES = {
  SYSTEM: ['role_definition', 'goal_setting'] as const,
  CONTEXT: ['context_setting', 'subject_focus', 'career_planning'] as const,
  BEHAVIOR: ['communication_style', 'feedback_style', 'personality_traits', 'creative_thinking'] as const,
  PROCESS: ['learning_style', 'difficulty_level', 'step_by_step', 'time_management', 'prioritization', 'skill_assessment'] as const,
  CONSTRAINTS: ['conditional_logic', 'error_handling'] as const,
  FORMAT: ['output_format'] as const,
} as const

export const TEMPLATE_BLOCKS = {
  tutor: ['role_definition', 'context_setting', 'learning_style', 'goal_setting', 'step_by_step'],
  business_consultant: ['role_definition', 'context_setting', 'communication_style', 'output_format', 'prioritization'],
  creative_assistant: ['role_definition', 'personality_traits', 'creative_thinking', 'output_format', 'feedback_style'],
  step_by_step_guide: ['role_definition', 'context_setting', 'step_by_step', 'output_format', 'error_handling'],
} as const
