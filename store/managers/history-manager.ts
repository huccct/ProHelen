import type { CustomNodeData, HistoryState } from '@/types/builder'
import type { Edge, Node } from '@xyflow/react'
import { STORE_CONFIG } from '@/lib/constants'

export class HistoryManager {
  private history: HistoryState[]
  private historyIndex: number
  private maxSize: number

  constructor(maxSize = STORE_CONFIG.MAX_HISTORY_SIZE) {
    this.history = []
    this.historyIndex = -1
    this.maxSize = maxSize
  }

  /**
   * Save the current state of the builder
   * @param nodes Nodes array
   * @param edges Edges array
   * @returns History state and index
   */
  save(nodes: Node<CustomNodeData>[], edges: Edge[]): { history: HistoryState[], historyIndex: number } {
    const currentState: HistoryState = { nodes, edges }

    // Remove any history after current index
    const newHistory = this.history.slice(0, this.historyIndex + 1)
    newHistory.push(currentState)

    // Limit history size
    if (newHistory.length > this.maxSize) {
      newHistory.shift()
    }
    else {
      this.historyIndex += 1
    }

    this.history = newHistory
    return { history: this.history, historyIndex: this.historyIndex }
  }

  /**
   * Undo the last action
   * @returns History state and index
   */
  undo(): { state: HistoryState | null, historyIndex: number } {
    if (this.historyIndex > 0) {
      this.historyIndex -= 1
      return {
        state: this.history[this.historyIndex],
        historyIndex: this.historyIndex,
      }
    }
    return { state: null, historyIndex: this.historyIndex }
  }

  /**
   * Redo the last action
   * @returns History state and index
   */
  redo(): { state: HistoryState | null, historyIndex: number } {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex += 1
      return {
        state: this.history[this.historyIndex],
        historyIndex: this.historyIndex,
      }
    }
    return { state: null, historyIndex: this.historyIndex }
  }

  /**
   * Check if undo is possible
   * @returns True if undo is possible
   */
  canUndo(): boolean {
    return this.historyIndex > 0
  }

  /**
   * Check if redo is possible
   * @returns True if redo is possible
   */
  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1
  }

  /**
   * Update the history state
   * @param history History state
   * @param historyIndex History index
   */
  updateState(history: HistoryState[], historyIndex: number): void {
    this.history = history
    this.historyIndex = historyIndex
  }
}
