import type { NextRequest } from 'next/server'
import process from 'node:process'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/db'
import { checkMaintenanceMode, checkRateLimit } from '@/lib/server-utils'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
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

    const { systemPrompt, userMessage, conversationHistory } = await request.json()

    if (!systemPrompt || !userMessage) {
      return NextResponse.json(
        { error: 'System prompt and user message are required' },
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

    // Build the messages array for the API
    const messages: ConversationMessage[] = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: ConversationMessage) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      })
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: userMessage,
    })

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'

    return NextResponse.json({
      success: true,
      response,
    })
  }
  catch (error) {
    console.error('Error testing prompt:', error)

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
