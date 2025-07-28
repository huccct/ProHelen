export interface ExtractedBlock {
  type: string
  content: string
  confidence: number
  reasoning: string
}

export interface SuggestedEnhancement {
  type: string
  reason: string
  impact: 'high' | 'medium' | 'low'
}
