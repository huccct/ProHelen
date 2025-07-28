import type { Connection, Edge, Node, NodeProps, OnEdgesChange, OnNodesChange } from '@xyflow/react'
import type { ReactNode } from 'react'

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

export interface BlockType {
  type: string
  labelKey: string
  icon: ReactNode
  descriptionKey: string
  category: string
  color: string
}

export interface ScrollState {
  showScrollButtons: boolean
  canScrollLeft: boolean
  canScrollRight: boolean
}

export interface CustomNodeData extends Record<string, unknown> {
  label: string
  type: string
  content?: string
  isEditing?: boolean
}

export type CustomNodeType = Node<CustomNodeData>

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  points: number
}

export interface ProgressData {
  score: number
  checklist: ChecklistItem[]
  nodeCount: number
  contentProgress: number
  hasExamples: boolean
  hasTaskClarity: boolean
  diversityCount: number
}

export interface ProgressStatus {
  status: string
  color: string
  bgColor: string
}

export interface AnalysisState {
  analysis: AnalysisResponse | null
  isAnalyzing: boolean
  analysisProgress: number
  selectedBlocks: Set<string>
  selectedEnhancements: Set<string>
}

export interface AnalysisResponse {
  extractedBlocks: ExtractedBlock[]
  suggestedEnhancements: SuggestedEnhancement[]
  missingEssentials: string[]
  detectedIntent: string
}

export interface PromptPreviewProps {
  className?: string
  style?: React.CSSProperties
}

export interface PreviewContent {
  system: string
  human: string
  assistant: string
}

export interface ExportData {
  system: string
  temperature: number
  maxTokens: number
  exportedAt: string
}

export interface ParsedContent {
  system: string
  human: string
  assistant: string
}

export interface SaveInstructionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (instructionData: InstructionFormData) => void
  isLoading?: boolean
}

export interface InstructionFormData {
  title: string
  description: string
  category: string
  tags: string[]
}

export interface FormState extends InstructionFormData {
  tagInput: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface TestPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export interface ChatState {
  messages: Message[]
  input: string
  isLoading: boolean
  hasAutoSent: boolean
}

export interface HistoryState {
  nodes: Node<CustomNodeData>[]
  edges: Edge[]
}

export interface BuilderState {
  nodes: Node<CustomNodeData>[]
  edges: Edge[]
  title: string
  description: string
  content: string
  tags: string[]
  isTemplate: boolean
  sourceId: string | null
  originalUserQuery: string
  selectedNode: string | null
  showRecommendations: boolean
  preview: {
    system: string
    human: string
    assistant: string
  }
  history: HistoryState[]
  historyIndex: number
}

export interface BuilderActions {
  setNodes: (nodes: Node<CustomNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (type: string, position?: { x: number, y: number }) => void
  addNodeWithContent: (type: string, content?: string, position?: { x: number, y: number }, skipHistorySave?: boolean) => void
  deleteNode: (nodeId: string) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: (connection: Connection) => void
  updateNodeData: (nodeId: string, data: Partial<CustomNodeData>) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setContent: (content: string) => void
  setTags: (tags: string[]) => void
  setIsTemplate: (isTemplate: boolean) => void
  setSourceId: (sourceId: string | null) => void
  setOriginalUserQuery: (query: string) => void
  setSelectedNode: (nodeType: string | null) => void
  setShowRecommendations: (show: boolean) => void
  updatePreview: () => void
  setPreview: (preview: { system: string, human: string, assistant: string }) => void
  exportFlowData: () => { nodes: Node<CustomNodeData>[], edges: Edge[] }
  importFlowData: (flowData: { nodes: Node<CustomNodeData>[], edges: Edge[] }) => void
  resetFlow: () => void
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  applyAnalysisResults: (blocks: ExtractedBlock[], enhancements: SuggestedEnhancement[], userQuery?: string) => void
  createEnhancementBlocks: (enhancements: SuggestedEnhancement[]) => void
  addQuickStartTemplate: (templateId: string) => void
  saveDraft: () => Promise<void>
  hasPendingChanges: () => boolean
}

export interface CustomNodeProps extends NodeProps<CustomNodeType> {
  onUpdateNodeData?: (nodeId: string, data: Partial<CustomNodeData>) => void
  onShowDeleteConfirm?: (nodeId: string) => void
}

export interface NodeMetadata {
  icon: React.ReactElement
  description: string
  colors: {
    gradient: string
    border: string
  }
}
