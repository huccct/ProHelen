import type { NextRequest } from 'next/server'
import process from 'node:process'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    const { userPrompt } = await request.json()

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 },
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 },
      )
    }

    const analysisPrompt = `
You are an expert in prompt engineering and AI instruction design. Analyze the following user request and extract relevant instruction blocks.

Available block types:
- role_definition: Defines the AI's role and expertise
- context_setting: Sets the background and working environment
- communication_style: Defines how the AI should communicate
- learning_style: Specifies educational approach (for learning scenarios)
- personality_traits: Defines AI personality characteristics
- subject_focus: Specifies the main subject or domain
- output_format: Defines the expected response format
- goal_setting: Sets specific objectives or targets
- difficulty_level: Specifies complexity level
- creative_thinking: Enables creative problem-solving
- step_by_step: Provides structured step-by-step guidance
- time_management: Includes time-related considerations
- prioritization: Helps with task prioritization
- conditional_logic: Adds conditional responses
- error_handling: Defines error handling approaches
- feedback_style: Specifies how to give feedback
- career_planning: For career-related guidance
- skill_assessment: For evaluating skills and abilities

User request: "${userPrompt}"

Analyze this request and return a JSON object with the following structure:
{
  "extractedBlocks": [
    {
      "type": "role_definition",
      "content": "Detailed content for this block based on user's request",
      "confidence": 0.95,
      "reasoning": "Why this block was identified"
    }
  ],
  "suggestedEnhancements": [
    {
      "type": "output_format",
      "reason": "Adding output format would improve response quality",
      "impact": "high"
    }
  ],
  "missingEssentials": ["communication_style", "goal_setting"],
  "detectedIntent": "Brief description of what the user wants to achieve"
}

Rules:
1. Only suggest blocks that are clearly indicated by the user's request
2. Confidence should be between 0.1 and 1.0
3. Content should be specific and actionable
4. Suggest 2-4 enhancements maximum
5. Mark missing essentials that would significantly improve the prompt
6. Be conservative but helpful
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
