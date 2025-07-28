import type { CustomNodeData } from '@/types/builder'
import type { Edge, Node } from '@xyflow/react'
import { CONTENT_CATEGORIES } from '@/lib/constants'
import { detectLanguage, getInterfaceLanguage } from '@/lib/utils'

export class PreviewGenerator {
  private nodes: Node<CustomNodeData>[]
  private edges: Edge[]
  private originalUserQuery: string
  private interfaceLanguage: 'zh' | 'en'
  private contentLanguage: 'zh' | 'en'

  constructor(
    nodes: Node<CustomNodeData>[],
    edges: Edge[],
    originalUserQuery: string,
  ) {
    this.nodes = nodes
    this.edges = edges
    this.originalUserQuery = originalUserQuery
    this.interfaceLanguage = getInterfaceLanguage()
    this.contentLanguage = originalUserQuery
      ? detectLanguage(originalUserQuery)
      : this.interfaceLanguage
  }

  /**
   * Generate preview
   * @returns Preview object
   */
  generate() {
    const headers = this.getHeaders()
    const contentByType = this.categorizeContent(headers)
    const systemPrompt = this.buildSystemPrompt(contentByType, headers)
    const humanPrompt = this.buildHumanPrompt(contentByType)
    const assistantPrompt = this.buildAssistantPrompt(contentByType)

    return {
      system: systemPrompt || headers.noInstructions,
      human: humanPrompt,
      assistant: assistantPrompt,
    }
  }

  /**
   * Get headers
   * @returns Headers object
   */
  private getHeaders() {
    return this.interfaceLanguage === 'zh'
      ? {
          coreDefinition: '## 核心定义',
          contextHeader: '\n## 上下文',
          behaviorGuidelines: '\n## 行为准则',
          processInstructions: '\n## 过程指导',
          constraintsRules: '\n## 约束与规则',
          outputFormat: '\n## 输出格式',
          workflow: '\n\n## 工作流程',
          logicalFlow: '逻辑流程：',
          logicalFlows: '逻辑流程：\n',
          noInstructions: '尚未定义系统指令。添加块来构建您的提示词。',
          role: '角色：',
          contextLabel: '上下文：',
          goals: '目标：',
          learningStyle: '学习风格：',
          subjectFocus: '主题焦点：',
          difficultyLevel: '难度级别：',
          communicationStyle: '沟通风格：',
          feedbackApproach: '反馈方式：',
          personality: '个性：',
          stepByStep: '分步指导：',
          timeManagement: '时间管理：',
          prioritization: '优先级排序：',
          conditionalLogic: '条件逻辑：',
          creativeApproach: '创意方法：',
          errorHandling: '错误处理：',
          careerPlanning: '职业规划：',
          skillAssessment: '技能评估：',
        }
      : {
          coreDefinition: '## Core Definition',
          contextHeader: '\n## Context',
          behaviorGuidelines: '\n## Behavior Guidelines',
          processInstructions: '\n## Process Instructions',
          constraintsRules: '\n## Constraints & Rules',
          outputFormat: '\n## Output Format',
          workflow: '\n\n## Workflow',
          logicalFlow: 'Logical flow: ',
          logicalFlows: 'Logical flows:\n',
          noInstructions: 'No system instructions defined yet. Add blocks to build your prompt.',
          role: 'Role: ',
          contextLabel: 'Context: ',
          goals: 'Goals: ',
          learningStyle: 'Learning Style: ',
          subjectFocus: 'Subject Focus: ',
          difficultyLevel: 'Difficulty Level: ',
          communicationStyle: 'Communication Style: ',
          feedbackApproach: 'Feedback Approach: ',
          personality: 'Personality: ',
          stepByStep: 'Step by Step: ',
          timeManagement: 'Time Management: ',
          prioritization: 'Prioritization: ',
          conditionalLogic: 'Conditional Logic: ',
          creativeApproach: 'Creative Approach: ',
          errorHandling: 'Error Handling: ',
          careerPlanning: 'Career Planning: ',
          skillAssessment: 'Skill Assessment: ',
        }
  }

  /**
   * Categorize content
   * @param headers Headers object
   * @returns Content by type
   */
  private categorizeContent(headers: any) {
    const contentByType = {
      system: [] as string[],
      context: [] as string[],
      behavior: [] as string[],
      format: [] as string[],
      process: [] as string[],
      constraints: [] as string[],
    }

    this.nodes.forEach((node) => {
      const content = node.data.content?.trim()
      if (!content)
        return

      const nodeType = node.data.type

      if (CONTENT_CATEGORIES.SYSTEM.includes(nodeType as any)) {
        const label = nodeType === 'role_definition' ? headers.role : headers.goals
        contentByType.system.push(`${label}${content}`)
      }
      else if (CONTENT_CATEGORIES.CONTEXT.includes(nodeType as any)) {
        const labelMap: Record<string, string> = {
          context_setting: headers.contextLabel,
          subject_focus: headers.subjectFocus,
          career_planning: headers.careerPlanning,
        }
        contentByType.context.push(`${labelMap[nodeType] || ''}${content}`)
      }
      else if (CONTENT_CATEGORIES.BEHAVIOR.includes(nodeType as any)) {
        const labelMap: Record<string, string> = {
          communication_style: headers.communicationStyle,
          feedback_style: headers.feedbackApproach,
          personality_traits: headers.personality,
          creative_thinking: headers.creativeApproach,
        }
        contentByType.behavior.push(`${labelMap[nodeType] || ''}${content}`)
      }
      else if (CONTENT_CATEGORIES.PROCESS.includes(nodeType as any)) {
        const labelMap: Record<string, string> = {
          learning_style: headers.learningStyle,
          difficulty_level: headers.difficultyLevel,
          step_by_step: headers.stepByStep,
          time_management: headers.timeManagement,
          prioritization: headers.prioritization,
          skill_assessment: headers.skillAssessment,
        }
        contentByType.process.push(`${labelMap[nodeType] || ''}${content}`)
      }
      else if (CONTENT_CATEGORIES.CONSTRAINTS.includes(nodeType as any)) {
        const labelMap: Record<string, string> = {
          conditional_logic: headers.conditionalLogic,
          error_handling: headers.errorHandling,
        }
        contentByType.constraints.push(`${labelMap[nodeType] || ''}${content}`)
      }
      else if (CONTENT_CATEGORIES.FORMAT.includes(nodeType as any)) {
        contentByType.format.push(`${headers.outputFormat.replace('\n## ', '')}${content}`)
      }
      else {
        contentByType.system.push(content)
      }
    })

    return contentByType
  }

  /**
   * Build system prompt
   * @param contentByType Content by type
   * @param headers Headers object
   * @returns System prompt
   */
  private buildSystemPrompt(contentByType: any, headers: any): string {
    const sections = []

    if (contentByType.system.length > 0) {
      sections.push(`${headers.coreDefinition}\n${contentByType.system.join('\n')}`)
    }

    if (contentByType.context.length > 0) {
      sections.push(`${headers.contextHeader}\n${contentByType.context.join('\n')}`)
    }

    if (contentByType.behavior.length > 0) {
      sections.push(`${headers.behaviorGuidelines}\n${contentByType.behavior.join('\n')}`)
    }

    if (contentByType.process.length > 0) {
      sections.push(`${headers.processInstructions}\n${contentByType.process.join('\n')}`)
    }

    if (contentByType.constraints.length > 0) {
      sections.push(`${headers.constraintsRules}\n${contentByType.constraints.join('\n')}`)
    }

    if (contentByType.format.length > 0) {
      sections.push(`${headers.outputFormat}\n${contentByType.format.join('\n')}`)
    }

    let systemPrompt = sections.join('\n').trim()

    // Add workflow description
    const flowDescription = this.buildFlowDescription(headers)
    if (flowDescription) {
      systemPrompt += `${headers.workflow}\n${flowDescription}`
    }

    return systemPrompt
  }

  /**
   * Build flow description
   * @param headers Headers object
   * @returns Flow description
   */
  private buildFlowDescription(headers: any): string {
    if (this.edges.length === 0)
      return ''

    const startNodes = this.nodes.filter(node =>
      !this.edges.some(edge => edge.target === node.id),
    )

    if (startNodes.length === 0)
      return ''

    const startNode = startNodes[0]
    const visited = new Set<string>()
    const paths: string[] = []

    const buildPaths = (nodeId: string, currentPath: string[] = []) => {
      if (visited.has(nodeId))
        return

      const node = this.nodes.find(n => n.id === nodeId)
      if (!node)
        return

      const newPath = [...currentPath, node.data.label]
      const outgoingEdges = this.edges.filter(edge => edge.source === nodeId)

      if (outgoingEdges.length === 0) {
        if (newPath.length > 1) {
          paths.push(newPath.join(' → '))
        }
        else if (newPath.length === 1) {
          paths.push(newPath[0])
        }
      }
      else if (outgoingEdges.length === 1) {
        visited.add(nodeId)
        buildPaths(outgoingEdges[0].target, newPath)
      }
      else {
        visited.add(nodeId)
        outgoingEdges.forEach((edge) => {
          buildPaths(edge.target, newPath)
        })
      }
    }

    buildPaths(startNode.id)

    if (paths.length === 0 && this.nodes.length > 0) {
      const allNodeLabels = this.nodes.map(node => node.data.label)
      return `${headers.logicalFlow}${allNodeLabels.join(' → ')}`
    }

    if (paths.length === 1) {
      return `${headers.logicalFlow}${paths[0]}`
    }
    else if (paths.length > 1) {
      return `${headers.logicalFlows}${paths.map(path => `• ${path}`).join('\n')}`
    }

    return ''
  }

  /**
   * Build human prompt
   * @param contentByType Content by type
   * @returns Human prompt
   */
  private buildHumanPrompt(contentByType: any): string {
    const userGuidelines = []
    if (contentByType.context.some((c: string) =>
      c.includes('user') || c.includes('User') || c.includes('用户'),
    )) {
      userGuidelines.push(this.contentLanguage === 'zh'
        ? '请根据上述定义的上下文和准则进行交互。'
        : 'Please interact according to the defined context and guidelines above.')
    }
    return userGuidelines.join('\n')
  }

  /**
   * Build assistant prompt
   * @param contentByType Content by type
   * @returns Assistant prompt
   */
  private buildAssistantPrompt(contentByType: any): string {
    const responseGuidelines = []
    if (contentByType.format.length > 0) {
      responseGuidelines.push(this.contentLanguage === 'zh'
        ? '记住在回复中遵循指定的输出格式。'
        : 'Remember to follow the specified output format in your responses.')
    }
    if (contentByType.behavior.length > 0) {
      responseGuidelines.push(this.contentLanguage === 'zh'
        ? '在整个对话过程中保持指定的沟通风格和个性。'
        : 'Maintain the specified communication style and personality throughout the conversation.')
    }
    return responseGuidelines.join('\n')
  }
}
