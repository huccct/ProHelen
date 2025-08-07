'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BLOCK_TYPES, CATEGORIES, CSS_CLASSES_BLOCK_PICKER, QUICK_START_TEMPLATES, TEMPLATE_ANIMATION } from '@/lib/constants'
import { useScrollControl } from '@/lib/hooks/use-scroll-control'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface BlockPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddNode: (type: string) => void
  onAddQuickStartTemplate?: (templateId: string) => void
}

interface ScrollButtonProps {
  direction: 'left' | 'right'
  canScroll: boolean
  onScroll: (direction: 'left' | 'right') => void
}

const ScrollButton = memo<ScrollButtonProps>(({ direction, canScroll, onScroll }) => {
  const isLeft = direction === 'left'
  const Icon = isLeft ? ChevronLeft : ChevronRight

  const gradientClass = isLeft
    ? 'from-background via-background/80 to-transparent'
    : 'from-background via-background/80 to-transparent bg-gradient-to-l'

  const positionClass = isLeft ? 'left-0 rounded-l' : 'right-0 rounded-r'
  const iconTransform = isLeft ? 'hover:translate-x-[-1px]' : 'hover:translate-x-[1px]'

  return (
    <button
      onClick={() => onScroll(direction)}
      className={`${CSS_CLASSES_BLOCK_PICKER.scrollButton} ${positionClass} ${gradientClass} ${
        canScroll ? CSS_CLASSES_BLOCK_PICKER.scrollButtonEnabled : CSS_CLASSES_BLOCK_PICKER.scrollButtonDisabled
      }`}
      disabled={!canScroll}
      aria-label={`Scroll ${direction}`}
    >
      <Icon className={`h-4 w-4 transition-transform duration-200 ${iconTransform}`} />
    </button>
  )
})

ScrollButton.displayName = 'ScrollButton'

interface CategoryButtonProps {
  category: typeof CATEGORIES[0]
  isSelected: boolean
  onSelect: (categoryId: string) => void
}

const CategoryButton = memo<CategoryButtonProps>(({ category, isSelected, onSelect }) => {
  const { t } = useTranslation()

  return (
    <Button
      variant={isSelected ? 'default' : 'ghost'}
      size="sm"
      onClick={() => onSelect(category.id)}
      className={`${CSS_CLASSES_BLOCK_PICKER.categoryButton} ${
        isSelected
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {t(category.labelKey)}
    </Button>
  )
})

CategoryButton.displayName = 'CategoryButton'

interface TemplateCardProps {
  template: typeof QUICK_START_TEMPLATES[0]
  onSelect: (template: typeof QUICK_START_TEMPLATES[0]) => void
}

const TemplateCard = memo<TemplateCardProps>(({ template, onSelect }) => {
  const { t } = useTranslation()

  const templateBlocks = useMemo(() => {
    return template.blocks.map((blockType) => {
      const block = BLOCK_TYPES.find(b => b.type === blockType)
      return block ? { type: blockType, block } : null
    }).filter(Boolean) as Array<{ type: string, block: typeof BLOCK_TYPES[0] }>
  }, [template.blocks])

  return (
    <div
      className={CSS_CLASSES_BLOCK_PICKER.templateCard}
      onClick={() => onSelect(template)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(template)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} bg-opacity-10 border border-border group-hover:border-primary/20 transition-all duration-300`}>
          <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {template.icon}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {t(template.labelKey)}
          </h4>
          <p className="text-xs text-muted-foreground leading-tight">
            {t(template.descriptionKey)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {templateBlocks.map(({ type, block }) => (
          <div
            key={type}
            className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground"
          >
            <div className="w-3 h-3 flex items-center justify-center">
              {block.icon}
            </div>
            <span>{t(block.labelKey)}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
          {t('builder.components.blockPicker.quickStart.addAll')}
        </div>
      </div>
    </div>
  )
})

TemplateCard.displayName = 'TemplateCard'

interface BlockCardProps {
  block: typeof BLOCK_TYPES[0]
  onSelect: (type: string) => void
  onDragStart: (event: React.DragEvent, type: string) => void
}

const BlockCard = memo<BlockCardProps>(({ block, onSelect, onDragStart }) => {
  const { t } = useTranslation()

  return (
    <div
      className={CSS_CLASSES_BLOCK_PICKER.blockCard}
      draggable
      onDragStart={e => onDragStart(e, block.type)}
      onClick={() => onSelect(block.type)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(block.type)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${block.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${block.color} bg-opacity-10 border border-border group-hover:border-border/80 transition-all duration-300`}>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {block.icon}
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
          {t(block.labelKey)}
        </h3>
        <p className="text-xs text-muted-foreground leading-tight">
          {t(block.descriptionKey)}
        </p>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
        <div className="grid grid-cols-2 gap-0.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-1 h-1 bg-muted-foreground rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
})

BlockCard.displayName = 'BlockCard'

interface QuickStartViewProps {
  onTemplateSelect: (template: typeof QUICK_START_TEMPLATES[0]) => void
}

const QuickStartView = memo<QuickStartViewProps>(({ onTemplateSelect }) => {
  const { t } = useTranslation()

  return (
    <div className="p-4 space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('builder.components.blockPicker.quickStart.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('builder.components.blockPicker.quickStart.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_START_TEMPLATES.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onTemplateSelect}
          />
        ))}
      </div>
    </div>
  )
})

QuickStartView.displayName = 'QuickStartView'

interface BlockGridViewProps {
  blocks: typeof BLOCK_TYPES
  onBlockSelect: (type: string) => void
  onDragStart: (event: React.DragEvent, type: string) => void
}

const BlockGridView = memo<BlockGridViewProps>(({ blocks, onBlockSelect, onDragStart }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
    {blocks.map(block => (
      <BlockCard
        key={block.type}
        block={block}
        onSelect={onBlockSelect}
        onDragStart={onDragStart}
      />
    ))}
  </div>
))

BlockGridView.displayName = 'BlockGridView'

export const BlockPickerModal = memo<BlockPickerModalProps>(({
  open,
  onOpenChange,
  onAddNode,
  onAddQuickStartTemplate,
}) => {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('quick-start')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { showScrollButtons, canScrollLeft, canScrollRight, scroll } = useScrollControl(
    scrollContainerRef as React.RefObject<HTMLDivElement>,
    open,
    selectedCategory,
  )

  const filteredBlocks = useMemo(() => {
    return selectedCategory === 'all'
      ? BLOCK_TYPES
      : BLOCK_TYPES.filter(block => block.category === selectedCategory)
  }, [selectedCategory])

  const handleQuickStartTemplate = useCallback((template: typeof QUICK_START_TEMPLATES[0]) => {
    if (onAddQuickStartTemplate) {
      onAddQuickStartTemplate(template.id)
    }
    else {
      template.blocks.forEach((blockType, index) => {
        setTimeout(() => {
          onAddNode(blockType)
        }, index * TEMPLATE_ANIMATION.DELAY_PER_BLOCK)
      })
    }
    onOpenChange(false)
  }, [onAddNode, onAddQuickStartTemplate, onOpenChange])

  const handleDragStart = useCallback((event: React.DragEvent, type: string) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
    // Close the modal so the canvas can receive the onDrop event
    // Defer to next tick to avoid interrupting the drag gesture
    setTimeout(() => onOpenChange(false), 0)
  }, [onOpenChange])

  const handleBlockClick = useCallback((type: string) => {
    onAddNode(type)
    onOpenChange(false)
  }, [onAddNode, onOpenChange])

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
  }, [])

  useEffect(() => {
    if (!open) {
      setSelectedCategory('quick-start')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            {t('builder.components.blockPicker.title')}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {t('builder.components.blockPicker.description')}
          </p>
        </DialogHeader>

        <div className="relative border-b border-border pb-2">
          <div
            ref={scrollContainerRef}
            className={CSS_CLASSES_BLOCK_PICKER.scrollContainer}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
            }}
          >
            {CATEGORIES.map(category => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={handleCategorySelect}
              />
            ))}
          </div>

          {showScrollButtons && (
            <>
              <ScrollButton
                direction="left"
                canScroll={canScrollLeft}
                onScroll={scroll}
              />
              <ScrollButton
                direction="right"
                canScroll={canScrollRight}
                onScroll={scroll}
              />
            </>
          )}
        </div>

        <div className="overflow-y-auto scrollbar">
          {selectedCategory === 'quick-start'
            ? (
                <QuickStartView onTemplateSelect={handleQuickStartTemplate} />
              )
            : (
                <BlockGridView
                  blocks={filteredBlocks}
                  onBlockSelect={handleBlockClick}
                  onDragStart={handleDragStart}
                />
              )}
        </div>

        <div className="px-4 py-3 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground text-center">
            💡
            {' '}
            {t('builder.components.blockPicker.helpText')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
})

BlockPickerModal.displayName = 'BlockPickerModal'
