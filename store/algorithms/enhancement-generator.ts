export class EnhancementContentGenerator {
  private language: 'zh' | 'en'

  constructor(language: 'zh' | 'en') {
    this.language = language
  }

  /**
   * Generate enhancement content
   * @param enhancementType Enhancement type
   * @returns Enhancement content
   */
  generate(enhancementType: string): string {
    const contentMap = this.language === 'zh' ? this.getChineseContent() : this.getEnglishContent()
    return contentMap[enhancementType] || `基于您的具体要求和用例优化的${enhancementType.replace(/_/g, ' ')}配置。`
  }

  private getChineseContent(): Record<string, string> {
    return {
      output_format: `使用以下专业格式构建所有回复：
## 主要回复
对问题的清晰、直接回答

## 要点
- 重要细节的要点
- 顺序过程的编号步骤  
- **粗体**强调关键信息

## 下一步
可行的建议或后续建议`,
      communication_style: '保持专业、友好的沟通风格：在保持温暖和鼓励的同时做到清晰简洁。使用主动语态，除非必要否则避免术语，在进入复杂话题之前始终确认理解。',
      goal_setting: '专注于实现符合用户目标的具体、可衡量成果。预先定义成功标准，创建进度跟踪的中期检查点，庆祝里程碑成就以保持动力。',
      feedback_style: '使用SBI模型提供建设性、可行的反馈：情境（背景）、行为（具体观察）、影响（效果/结果）。始终以优势为先，提供具体的改进建议，确保反馈及时相关。',
      step_by_step: '将复杂任务分解为逻辑性、顺序性的步骤，每个阶段都有清晰的指导。为所有步骤编号，解释每个步骤的重要性，包括质量检查点，为常见问题提供故障排除指导。',
      context_setting: '考虑用户的背景、经验水平、可用资源和具体约束。根据他们的行业、角色和直接环境调整你的方法，确保相关性和实际适用性。',
      creative_thinking: '通过发散思维技巧培养创新问题解决：头脑风暴、思维导图、横向思维和"假如"情景。鼓励探索非常规解决方案，同时保持实际可行性。',
    }
  }

  /**
   * Get English content
   * @returns English content
   */
  private getEnglishContent(): Record<string, string> {
    return {
      output_format: `Structure all responses using this professional format:
## Main Response
Clear, direct answer to the question

## Key Points
- Bullet points for important details
- Numbered steps for sequential processes
- **Bold** for emphasis on critical information

## Next Steps
Actionable recommendations or follow-up suggestions`,
      communication_style: 'Maintain a professional, approachable communication style: Be clear and concise while remaining warm and encouraging. Use active voice, avoid jargon unless necessary, and always confirm understanding before proceeding to complex topics.',
      goal_setting: 'Focus on achieving specific, measurable outcomes that align with user objectives. Define success criteria upfront, create interim checkpoints for progress tracking, and celebrate milestone achievements to maintain motivation.',
      feedback_style: 'Provide constructive, actionable feedback using the SBI model: Situation (context), Behavior (specific observations), Impact (effect/outcome). Always lead with strengths, offer specific improvement suggestions, and ensure feedback is timely and relevant.',
      step_by_step: 'Break down complex tasks into logical, sequential steps with clear instructions for each stage. Number all steps, provide context for why each step matters, include quality checkpoints, and offer troubleshooting guidance for common issues.',
      context_setting: 'Consider the user\'s background, experience level, available resources, and specific constraints. Adapt your approach based on their industry, role, and immediate environment to ensure relevance and practical applicability.',
      creative_thinking: 'Foster innovative problem-solving through divergent thinking techniques: brainstorming, mind mapping, lateral thinking, and "what if" scenarios. Encourage exploration of unconventional solutions while maintaining practical feasibility.',
    }
  }
}
