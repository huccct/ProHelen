import type { CustomNodeData } from '@/types/builder'
import type { Edge, Node } from '@xyflow/react'
import { BLOCK_PRIORITY, CONNECTION_RULES } from '@/lib/constants'

export class AutoConnector {
  private nodes: Node<CustomNodeData>[]
  private existingEdges: Edge[]

  constructor(nodes: Node<CustomNodeData>[], existingEdges: Edge[] = []) {
    this.nodes = nodes
    this.existingEdges = existingEdges
  }

  /**
   * Connect nodes based on priority and rules
   * @returns Edges array
   */
  connect(): Edge[] {
    if (this.nodes.length === 0)
      return []

    const sortedNodes = this.getSortedNodes()
    const edges: Edge[] = []
    const nodeTypes = this.nodes.map(n => n.data.type)

    // Phase 1: Rule-based connections
    this.applyConnectionRules(sortedNodes, nodeTypes, edges)

    // Phase 2: Sequential fallback connections
    this.applyFallbackConnections(sortedNodes, edges)

    // Phase 3: Handle isolated nodes
    this.handleIsolatedNodes(sortedNodes, edges)

    return edges
  }

  /**
   * Sort nodes by priority
   * @returns Sorted nodes
   */
  private getSortedNodes(): Node<CustomNodeData>[] {
    return [...this.nodes].sort((a, b) => {
      const priorityA = BLOCK_PRIORITY[a.data.type] || 999
      const priorityB = BLOCK_PRIORITY[b.data.type] || 999
      return priorityA - priorityB
    })
  }

  /**
   * Apply connection rules to nodes
   * @param sortedNodes Sorted nodes
   * @param nodeTypes Node types
   * @param edges Edges array
   */
  private applyConnectionRules(
    sortedNodes: Node<CustomNodeData>[],
    nodeTypes: string[],
    edges: Edge[],
  ): void {
    sortedNodes.forEach((sourceNode) => {
      const possibleTargets = CONNECTION_RULES[sourceNode.data.type] || []

      if (possibleTargets.length > 0) {
        const availableTargets = this.getAvailableTargets(possibleTargets, nodeTypes)

        if (availableTargets.length > 0) {
          const targetNode = availableTargets[0]
          this.addEdgeIfNotExists(sourceNode.id, targetNode.id, edges)
        }
      }
    })
  }

  /**
   * Apply fallback connections to nodes
   * @param sortedNodes Sorted nodes
   * @param edges Edges array
   */
  private applyFallbackConnections(
    sortedNodes: Node<CustomNodeData>[],
    edges: Edge[],
  ): void {
    sortedNodes.forEach((sourceNode, index) => {
      if (index < sortedNodes.length - 1) {
        const nextNode = sortedNodes[index + 1]

        const hasOutgoingConnection = edges.some(e => e.source === sourceNode.id)

        if (!hasOutgoingConnection) {
          this.addEdgeIfNotExists(sourceNode.id, nextNode.id, edges)
        }
      }
    })
  }

  /**
   * Handle isolated nodes
   * @param sortedNodes Sorted nodes
   * @param edges Edges array
   */
  private handleIsolatedNodes(
    sortedNodes: Node<CustomNodeData>[],
    edges: Edge[],
  ): void {
    const connectedNodes = new Set([
      ...edges.map(e => e.source),
      ...edges.map(e => e.target),
    ])

    sortedNodes.forEach((node, index) => {
      if (!connectedNodes.has(node.id) && index < sortedNodes.length - 1) {
        const nextNode = sortedNodes[index + 1]
        this.addEdgeIfNotExists(node.id, nextNode.id, edges)
      }
    })
  }

  /**
   * Get available targets
   * @param possibleTargets Possible targets
   * @param nodeTypes Node types
   * @returns Available targets
   */
  private getAvailableTargets(
    possibleTargets: string[],
    nodeTypes: string[],
  ): Node<CustomNodeData>[] {
    return possibleTargets
      .filter(targetType => nodeTypes.includes(targetType))
      .map(targetType => this.nodes.find(n => n.data.type === targetType)!)
      .filter(Boolean)
      .sort((a, b) => {
        const priorityA = BLOCK_PRIORITY[a.data.type] || 999
        const priorityB = BLOCK_PRIORITY[b.data.type] || 999
        return priorityA - priorityB
      })
  }

  /**
   * Check if a node has a rule-based connection
   * @param nodeType Node type
   * @returns True if the node has a rule-based connection
   */
  private hasRuleBasedConnection(nodeType: string): boolean {
    return !!(CONNECTION_RULES[nodeType]?.length)
  }

  /**
   * Add an edge if it doesn't exist
   * @param sourceId Source node ID
   * @param targetId Target node ID
   * @param edges Edges array
   */
  private addEdgeIfNotExists(sourceId: string, targetId: string, edges: Edge[]): void {
    if (sourceId === targetId)
      return
    const existsInNew = edges.some(e => e.source === sourceId && e.target === targetId)
    const existsInCurrent = this.existingEdges.some(e => e.source === sourceId && e.target === targetId)

    if (!existsInNew && !existsInCurrent) {
      edges.push({
        id: `auto-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
      })
    }
  }
}
