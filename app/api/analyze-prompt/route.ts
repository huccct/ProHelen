import type { NextRequest } from 'next/server'
import process from 'node:process'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/db'
import { checkMaintenanceMode, checkRateLimit } from '@/lib/server-utils'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface ExtractedBlock {
  type: string
  content: string
  confidence: number
  reasoning: string
}

interface SuggestedEnhancement {
  type: string
  reason: string
  impact: 'high' | 'medium' | 'low'
}

interface AnalysisResponse {
  extractedBlocks: ExtractedBlock[]
  suggestedEnhancements: SuggestedEnhancement[]
  missingEssentials: string[]
  detectedIntent: string
}

export async function POST(request: NextRequest) {
  try {
    if (await checkMaintenanceMode()) {
      return NextResponse.json(
        { error: 'System is under maintenance' },
        { status: 503 },
      )
    }

    const session = await getServerSession(authOptions)
    const identifier = session?.user?.id || request.headers.get('x-forwarded-for') || 'anonymous'

    const rateLimitResult = await checkRateLimit(identifier)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 },
      )
    }

    const { userPrompt } = await request.json()

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 },
      )
    }

    const apiKeySetting = await prisma.systemSetting.findUnique({
      where: { key: 'api.openai.key' },
    })

    const apiKey = apiKeySetting?.value || process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 },
      )
    }

    const openai = new OpenAI({
      apiKey,
    })

    const analysisPrompt = `
You are an expert in prompt engineering following the structured 5-category system. Analyze the user request and extract relevant instruction blocks based on our proven framework.

## IMPORTANT: Language Consistency
- Detect the primary language of the user's request
- Generate ALL content in the same language as the user's input
- If user writes in Chinese, respond entirely in Chinese
- If user writes in English, respond entirely in English
- Maintain professional terminology appropriate for the detected language

## 5-Category Framework:
1. **Role & Context** - AI identity, background, work environment
   - role_definition, context_setting, personality_traits, subject_focus

2. **Interaction Style** - Communication patterns and feedback approaches  
   - communication_style, feedback_style, learning_style

3. **Task Control** - Goal setting, output formatting, task management
   - goal_setting, output_format, difficulty_level, time_management, prioritization

4. **Thinking & Logic** - Cognitive processes and reasoning patterns
   - creative_thinking, step_by_step, conditional_logic, error_handling

5. **Skills & Development** - Professional growth and skill assessment
   - career_planning, skill_assessment

## Analysis Guidelines:
- Extract 3-6 blocks maximum (quality over quantity)
- Focus on blocks that are clearly indicated by the user's request
- Prioritize core blocks: role_definition, context_setting, goal_setting
- Consider the user's expertise level and domain
- Suggest enhancements that create a complete, logical flow

User request: "${userPrompt}"

## Language Detection:
First, identify the primary language of the user's request. Then ensure ALL generated content uses that same language consistently.

## Deep Analysis Questions:
1. What specific role should the AI play? (role_definition)
2. What's the context/environment? (context_setting) 
3. What are the clear objectives? (goal_setting)
4. How should the AI communicate? (communication_style)
5. What output format is implied? (output_format)
6. What thinking approach is needed? (step_by_step, creative_thinking)

Return JSON with this structure (content language must match user's input language):
{
  "detectedLanguage": "zh-CN" | "en-US",
  "extractedBlocks": [
    {
      "type": "role_definition",
      "content": "Specific, actionable content in user's language based on their domain and needs",
      "confidence": 0.95,
      "reasoning": "Clear indicators in user request suggest this role"
    }
  ],
  "suggestedEnhancements": [
    {
      "type": "output_format", 
      "reason": "Adding structured output format would improve response quality and usability",
      "impact": "high"
    }
  ],
  "missingEssentials": ["communication_style"],
  "detectedIntent": "User wants to create [specific type] AI for [specific purpose] with [key characteristics]"
}

## Content Quality Standards:
- Be specific to the user's domain (education, business, creative, technical)
- Include actionable instructions, not generic descriptions
- Use professional language appropriate for the context AND user's language
- Focus on practical implementation details
- Consider the complete user experience flow
- Ensure cultural and linguistic appropriateness

## Enhancement Logic:
- If role_definition exists, suggest context_setting or communication_style
- If educational content, suggest learning_style and step_by_step
- If business content, suggest prioritization and output_format
- If creative content, suggest creative_thinking and feedback_style
- Always consider if output_format would improve clarity

## Language-Specific Guidelines:
**For Chinese users:**
- Use professional Chinese business/technical terminology
- Follow Chinese communication patterns and cultural norms
- Provide examples relevant to Chinese business context

**For English users:**
- Use professional English business/technical terminology
- Follow Western communication patterns and practices
- Provide examples relevant to international business context
`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes prompts and returns valid JSON.' },
        { role: 'user', content: analysisPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No response from OpenAI')
    }

    let analysisResult: AnalysisResponse
    try {
      analysisResult = JSON.parse(responseContent)
    }
    catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      throw new Error('Invalid response format from AI')
    }

    // Validate response structure
    if (!analysisResult.extractedBlocks || !Array.isArray(analysisResult.extractedBlocks)) {
      throw new Error('Invalid analysis result structure')
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
    })
  }
  catch (error) {
    console.error('Error analyzing prompt:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
