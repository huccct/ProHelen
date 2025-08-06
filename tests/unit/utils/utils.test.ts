import type { CustomNodeData } from '@/types/builder'
import type { Node } from '@xyflow/react'
import {
  calculateNodePosition,
  categorizeNodeType,
  cn,
  containsKeywords,
  createNodeId,
  detectLanguage,
  generateNodeLabel,
  getInterfaceLanguage,
} from '@/lib/utils'

jest.mock('@/lib/i18n', () => ({
  __esModule: true,
  default: {
    language: 'en',
    changeLanguage: jest.fn(),
  },
}))

describe('utils', () => {
  describe('cn()', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-2 py-1', 'px-4', 'bg-red-500')
      expect(result).toBe('py-1 px-4 bg-red-500')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'valid-class')
      expect(result).toBe('base-class valid-class')
    })
  })

  describe('containsKeywords()', () => {
    it('should return true when content contains keywords', () => {
      const content = 'This is a test content with important keywords'
      const keywords = ['important', 'keywords']
      expect(containsKeywords(content, keywords)).toBe(true)
    })

    it('should return false when content does not contain keywords', () => {
      const content = 'This is a test content'
      const keywords = ['missing', 'keywords']
      expect(containsKeywords(content, keywords)).toBe(false)
    })

    it('should be case insensitive', () => {
      const content = 'This is a TEST content'
      const keywords = ['test']
      expect(containsKeywords(content, keywords)).toBe(true)
    })

    it('should handle empty keywords array', () => {
      const content = 'Any content'
      const keywords: string[] = []
      expect(containsKeywords(content, keywords)).toBe(false)
    })
  })

  describe('categorizeNodeType()', () => {
    it('should categorize role_definition as role_context', () => {
      expect(categorizeNodeType('role_definition')).toBe('core')
    })

    it('should categorize communication_style as interaction_style', () => {
      expect(categorizeNodeType('communication_style')).toBe('behavior')
    })

    it('should return other for unknown types', () => {
      expect(categorizeNodeType('unknown_type')).toBe('other')
    })
  })

  describe('createNodeId()', () => {
    it('should create unique node ID', () => {
      const mockNodes: Node<CustomNodeData>[] = [
        { id: 'role_definition-1', type: 'custom', position: { x: 0, y: 0 }, data: { type: 'role_definition', content: '', label: '' } },
        { id: 'goal_setting-1', type: 'custom', position: { x: 0, y: 0 }, data: { type: 'goal_setting', content: '', label: '' } },
      ]

      const result = createNodeId('role_definition', mockNodes)
      expect(result).toBe('role_definition-3')
    })

    it('should handle empty nodes array', () => {
      const result = createNodeId('role_definition', [])
      expect(result).toBe('role_definition-1')
    })
  })

  describe('generateNodeLabel()', () => {
    it('should generate label from snake_case', () => {
      expect(generateNodeLabel('role_definition')).toBe('Role Definition')
    })

    it('should generate label from single word', () => {
      expect(generateNodeLabel('goal')).toBe('Goal')
    })

    it('should handle empty string', () => {
      expect(generateNodeLabel('')).toBe('')
    })
  })

  describe('calculateNodePosition()', () => {
    it('should calculate position for first node', () => {
      const position = calculateNodePosition(0)
      expect(position.x).toBe(200) // START_X
      expect(position.y).toBe(150) // BASE_Y
    })

    it('should calculate position with spacing', () => {
      const position = calculateNodePosition(2)
      expect(position.x).toBe(900) // START_X + (index * NODE_SPACING)
      expect(position.y).toBe(150)
    })

    it('should use custom base Y', () => {
      const position = calculateNodePosition(0, 200)
      expect(position.x).toBe(200)
      expect(position.y).toBe(200)
    })
  })

  describe('detectLanguage()', () => {
    it('should detect Chinese text', () => {
      expect(detectLanguage('你好世界')).toBe('zh')
      expect(detectLanguage('这是一个测试')).toBe('zh')
    })

    it('should detect English text', () => {
      expect(detectLanguage('Hello world')).toBe('en')
      expect(detectLanguage('This is a test')).toBe('en')
    })

    it('should return en for empty string', () => {
      expect(detectLanguage('')).toBe('en')
    })

    it('should handle mixed content', () => {
      expect(detectLanguage('Hello 世界')).toBe('zh')
    })
  })

  describe('getInterfaceLanguage()', () => {
    beforeEach(() => {
      const i18n = jest.requireMock('@/lib/i18n').default
      i18n.language = 'en'
    })

    it('should return en for English language', () => {
      const i18n = jest.requireMock('@/lib/i18n').default
      i18n.language = 'en'
      expect(getInterfaceLanguage()).toBe('en')
    })

    it('should return zh for Chinese language', () => {
      const i18n = jest.requireMock('@/lib/i18n').default
      i18n.language = 'zh-CN'
      expect(getInterfaceLanguage()).toBe('zh')
    })
  })
})
