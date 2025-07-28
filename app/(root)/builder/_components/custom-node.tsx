'use client'

import type { CustomNodeData, CustomNodeProps, NodeMetadata } from '@/types/builder'
import { Button } from '@/components/ui/button'
import { CSS_CLASSES_CUSTOM_NODE, DEFAULT_NODE_METADATA, HANDLE_STYLES, NODE_CONFIG, NODE_METADATA } from '@/lib/constants'
import { useEditingStateCustomNode } from '@/lib/hooks/use-editing-state-custom-node'
import { useEventHandlers } from '@/lib/hooks/use-event-handlers'
import { useBuilderStore } from '@/store/builder'
import { Handle, NodeResizer, Position } from '@xyflow/react'
import {
  Edit3,
  Save,
  Trash2,
  X,
} from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/shallow'

function storeSelector(state: any) {
  return {
    updateNodeData: state.updateNodeData,
    setSelectedNode: state.setSelectedNode,
    setShowRecommendations: state.setShowRecommendations,
  }
}

interface NodeResizerComponentProps {
  isVisible: boolean
}

const NodeResizerComponent = memo<NodeResizerComponentProps>(({ isVisible }) => {
  if (!isVisible)
    return null

  return (
    <NodeResizer
      minWidth={NODE_CONFIG.MIN_WIDTH}
      minHeight={NODE_CONFIG.MIN_HEIGHT}
      maxWidth={NODE_CONFIG.MAX_WIDTH}
      maxHeight={NODE_CONFIG.MAX_HEIGHT}
      isVisible={isVisible}
      color="hsl(var(--foreground))"
      handleStyle={{
        backgroundColor: 'hsl(var(--foreground))',
        border: '2px solid hsl(var(--background))',
        borderRadius: '4px',
        width: '8px',
        height: '8px',
        boxShadow: '0 2px 4px hsl(var(--foreground) / 0.2)',
      }}
      lineStyle={{
        borderColor: 'hsl(var(--foreground) / 0.3)',
        borderWidth: '1px',
        borderStyle: 'dashed',
      }}
    />
  )
})

NodeResizerComponent.displayName = 'NodeResizerComponent'

interface NodeHeaderProps {
  data: CustomNodeData
  metadata: NodeMetadata
  isEditing: boolean
  onEdit: () => void
  onDelete: (e: React.MouseEvent) => void
}

const NodeHeader = memo<NodeHeaderProps>(({ data, metadata, isEditing, onEdit, onDelete }) => {
  return (
    <div className={`${CSS_CLASSES_CUSTOM_NODE.header} ${metadata.colors.gradient}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={`${CSS_CLASSES_CUSTOM_NODE.iconContainer} ${metadata.colors.gradient}`}>
            <div className={CSS_CLASSES_CUSTOM_NODE.icon}>
              {metadata.icon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground text-sm">
              {data.label}
            </h3>
            <p className="text-xs text-foreground/70">
              {metadata.description}
            </p>
          </div>
        </div>

        <div className={CSS_CLASSES_CUSTOM_NODE.actionButtons}>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-6 w-6 p-0 hover:bg-white/20 cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-6 w-6 p-0 hover:bg-red-500/20 cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
})

NodeHeader.displayName = 'NodeHeader'

interface EditingContentProps {
  editContent: string
  onContentChange: (content: string) => void
  onSave: () => void
  onCancel: (e: React.MouseEvent) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  placeholder: string
}

const EditingContent = memo<EditingContentProps>(({
  editContent,
  onContentChange,
  onSave,
  onCancel,
  textareaRef,
  placeholder,
}) => {
  const { t } = useTranslation()

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={editContent}
        onChange={e => onContentChange(e.target.value)}
        placeholder={placeholder}
        className={CSS_CLASSES_CUSTOM_NODE.textarea}
        style={{
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text',
          pointerEvents: 'auto',
          touchAction: 'manipulation',
        }}
        autoFocus
        onKeyDown={handleKeyDown}
        spellCheck={true}
      />
      <div className={CSS_CLASSES_CUSTOM_NODE.actions}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
        >
          <X className="h-3 w-3 mr-1" />
          {t('common.cancel')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="text-foreground border-border hover:bg-muted cursor-pointer"
        >
          <Save className="h-3 w-3 mr-1" />
          {t('common.save')}
        </Button>
      </div>
    </div>
  )
})

EditingContent.displayName = 'EditingContent'

interface PreviewContentProps {
  content?: string
  placeholder: string
}

const PreviewContent = memo<PreviewContentProps>(({ content, placeholder }) => {
  return (
    <div className="text-sm text-muted-foreground leading-relaxed">
      {content || (
        <span className={CSS_CLASSES_CUSTOM_NODE.placeholder}>
          {placeholder}
        </span>
      )}
    </div>
  )
})

PreviewContent.displayName = 'PreviewContent'

interface StatusIndicatorProps {
  hasContent: boolean
  isEditing: boolean
}

const StatusIndicator = memo<StatusIndicatorProps>(({ hasContent, isEditing }) => {
  if (!hasContent || isEditing)
    return null

  return (
    <div className="absolute top-2 right-2">
      <div className={CSS_CLASSES_CUSTOM_NODE.statusDot} />
    </div>
  )
})

StatusIndicator.displayName = 'StatusIndicator'

export const CustomNode = memo<CustomNodeProps>(({
  data,
  id,
  onUpdateNodeData,
  onShowDeleteConfirm,
  selected = false,
}) => {
  const { t } = useTranslation()
  const storeActions = useBuilderStore(useShallow(storeSelector))

  const updateNodeData = onUpdateNodeData || storeActions.updateNodeData

  const {
    isEditing,
    editContent,
    setEditContent,
    textareaRef,
    handleEdit,
    handleSave,
    handleCancel,
  } = useEditingStateCustomNode(data, id, updateNodeData)

  useEventHandlers(isEditing, textareaRef as React.RefObject<HTMLTextAreaElement>)

  const metadata = useMemo(() =>
    NODE_METADATA[data.type] || DEFAULT_NODE_METADATA, [data.type])

  const containerClass = useMemo(() =>
    `${CSS_CLASSES_CUSTOM_NODE.container} ${isEditing ? '' : `min-w-[${NODE_CONFIG.DEFAULT_MIN_WIDTH}px] max-w-[${NODE_CONFIG.DEFAULT_MAX_WIDTH}px]`} ${selected ? CSS_CLASSES_CUSTOM_NODE.selected : ''}`, [isEditing, selected])

  const cardClass = useMemo(() =>
    `${CSS_CLASSES_CUSTOM_NODE.card} ${isEditing ? CSS_CLASSES_CUSTOM_NODE.cardEditing : CSS_CLASSES_CUSTOM_NODE.cardDefault}`, [isEditing])

  const cardStyle = useMemo(() =>
    isEditing
      ? {
          userSelect: 'text' as const,
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text',
        }
      : undefined, [isEditing])

  const placeholder = useMemo(() =>
    t('builder.components.customNode.enterInstructions', { label: data.label.toLowerCase() }), [t, data.label])

  const clickToAddText = useMemo(() =>
    t('builder.components.customNode.clickToAdd'), [t])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isEditing) {
      handleEdit()
    }
  }, [isEditing, handleEdit])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onShowDeleteConfirm) {
      onShowDeleteConfirm(id)
    }
  }, [id, onShowDeleteConfirm])

  const handleSaveWithRecommendations = useCallback(() => {
    handleSave()
    storeActions.setSelectedNode(data.type)
    storeActions.setShowRecommendations(true)
  }, [handleSave, storeActions, data.type])

  const handleMouseEvent = useCallback((e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation()
    }
  }, [isEditing])

  return (
    <div
      className={containerClass}
      data-editing={isEditing}
      data-node-id={id}
    >
      {/* NodeResizer - Only show when editing */}
      <NodeResizerComponent isVisible={isEditing} />

      {/* Target Handle - for receiving connections, but not interactive */}
      <Handle
        type="target"
        position={Position.Left}
        className={HANDLE_STYLES.target}
        isConnectable={false}
      />

      {/* Source Handle - for making connections */}
      <Handle
        type="source"
        position={Position.Right}
        className={HANDLE_STYLES.source}
        isConnectable={false}
      />

      <div
        className={cardClass}
        onDoubleClick={isEditing ? undefined : handleDoubleClick}
        onMouseDown={handleMouseEvent}
        onMouseMove={handleMouseEvent}
        onMouseUp={handleMouseEvent}
        onDragStart={handleMouseEvent}
        style={cardStyle as React.CSSProperties}
      >
        {/* Header */}
        <NodeHeader
          data={data}
          metadata={metadata}
          isEditing={isEditing}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Content */}
        <div className={CSS_CLASSES_CUSTOM_NODE.content}>
          {isEditing
            ? (
                <EditingContent
                  editContent={editContent}
                  onContentChange={setEditContent}
                  onSave={handleSaveWithRecommendations}
                  onCancel={handleCancel}
                  textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                  placeholder={placeholder}
                />
              )
            : (
                <PreviewContent
                  content={data.content}
                  placeholder={clickToAddText}
                />
              )}
        </div>

        {/* Status Indicator */}
        <StatusIndicator
          hasContent={!!data.content}
          isEditing={isEditing}
        />
      </div>
    </div>
  )
})

CustomNode.displayName = 'CustomNode'
