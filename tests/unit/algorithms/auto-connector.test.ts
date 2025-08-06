import type { CustomNodeData } from '@/types/builder'
import type { Edge, Node } from '@xyflow/react'
import { AutoConnector } from '@/store/algorithms/auto-connector'

describe('autoConnector', () => {
  const createMockNode = (id: string, type: string): Node<CustomNodeData> => ({
    id,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { type, content: '', label: type },
  })

  describe('connect()', () => {
    it('should return empty array for empty nodes', () => {
      const connector = new AutoConnector([])
      const edges = connector.connect()
      expect(edges).toEqual([])
    })

    it('should connect nodes by priority order', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
        createMockNode('3', 'communication_style'),
      ]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      expect(edges).toHaveLength(2)
      // role_definition connects to context_setting (rule-based)
      expect(edges[0]).toEqual({
        id: 'auto-1-2',
        source: '1',
        target: '2',
      })
      // context_setting connects to communication_style (rule-based)
      expect(edges[1]).toEqual({
        id: 'auto-2-3',
        source: '2',
        target: '3',
      })
    })

    it('should follow connection rules', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
        createMockNode('3', 'communication_style'),
      ]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      // role_definition should connect to context_setting (rule-based)
      // context_setting should connect to communication_style (rule-based)
      expect(edges).toHaveLength(2)
      expect(edges[0].source).toBe('1')
      expect(edges[0].target).toBe('2')
      expect(edges[1].source).toBe('2')
      expect(edges[1].target).toBe('3')
    })

    it('should handle isolated nodes with fallback connections', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
        createMockNode('3', 'unknown_type'),
      ]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      // Should connect all nodes sequentially by priority
      // role_definition -> context_setting -> unknown_type
      expect(edges).toHaveLength(2)
      expect(edges[0].source).toBe('1')
      expect(edges[0].target).toBe('2')
      expect(edges[1].source).toBe('2')
      expect(edges[1].target).toBe('3')
    })

    it('should not create duplicate edges', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
      ]

      const existingEdges: Edge[] = [
        { id: 'existing-1-2', source: '1', target: '2' },
      ]

      const connector = new AutoConnector(nodes, existingEdges)
      const edges = connector.connect()

      expect(edges).toHaveLength(0) // No new edges should be created
    })

    it('should not create self-loops', () => {
      const nodes = [createMockNode('1', 'role_definition')]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      expect(edges).toHaveLength(0) // No self-loops
    })

    it('should handle complex rule-based connections', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
        createMockNode('3', 'communication_style'),
        createMockNode('4', 'goal_setting'),
        createMockNode('5', 'step_by_step'),
      ]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      // Should follow rules: role_definition -> context_setting -> communication_style -> goal_setting -> step_by_step
      expect(edges.length).toBeGreaterThan(0)

      // Check that role_definition connects to context_setting
      const roleToContext = edges.find(e => e.source === '1' && e.target === '2')
      expect(roleToContext).toBeDefined()
    })

    it('should prioritize rule-based connections over fallback', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
        createMockNode('3', 'communication_style'),
      ]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      // Should use rule-based connection (role_definition -> context_setting)
      // instead of sequential fallback (role_definition -> communication_style)
      const ruleBasedEdge = edges.find(e => e.source === '1' && e.target === '2')
      const fallbackEdge = edges.find(e => e.source === '1' && e.target === '3')

      expect(ruleBasedEdge).toBeDefined()
      expect(fallbackEdge).toBeUndefined()
    })
  })

  describe('edge generation', () => {
    it('should generate unique edge IDs', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
      ]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      expect(edges[0].id).toBe('auto-1-2')
    })

    it('should handle multiple connections to same target', () => {
      const nodes = [
        createMockNode('1', 'role_definition'),
        createMockNode('2', 'context_setting'),
        createMockNode('3', 'communication_style'),
      ]

      const connector = new AutoConnector(nodes)
      const edges = connector.connect()

      // Should not create multiple edges to the same target
      const edgesToContext = edges.filter(e => e.target === '2')
      expect(edgesToContext.length).toBeLessThanOrEqual(1)
    })
  })
})
