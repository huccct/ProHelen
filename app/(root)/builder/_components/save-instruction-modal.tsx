'use client'

import type { FormState, InstructionFormData, SaveInstructionModalProps, ValidationResult } from '@/types/builder'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORY_KEYS, CSS_CLASSES_SAVE_INSTRUCTION_MODAL, FORM_CONFIG } from '@/lib/constants'
import { useFormState } from '@/lib/hooks/use-form-state'
import { useTagManager } from '@/lib/hooks/use-tag-manager'
import { useBuilderStore } from '@/store/builder'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/shallow'

function storeSelector(state: any) {
  return {
    title: state.title,
    description: state.description,
    setTitle: state.setTitle,
    setDescription: state.setDescription,
  }
}

function validateForm(formData: InstructionFormData): ValidationResult {
  const errors: Record<string, string> = {}

  if (!formData.title.trim()) {
    errors.title = 'Title is required'
  }
  else if (formData.title.length > FORM_CONFIG.VALIDATION.MAX_TITLE_LENGTH) {
    errors.title = `Title must be less than ${FORM_CONFIG.VALIDATION.MAX_TITLE_LENGTH} characters`
  }

  if (formData.description.length > FORM_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be less than ${FORM_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH} characters`
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function sanitizeTag(tag: string): string {
  return tag.trim().toLowerCase().slice(0, FORM_CONFIG.MAX_TAG_LENGTH)
}

interface TagInputProps {
  tagInput: string
  onTagInputChange: (value: string) => void
  onKeyPress: (e: React.KeyboardEvent) => void
  onAddTag: () => void
  canAddTag: boolean
}

const TagInput = memo<TagInputProps>(({
  tagInput,
  onTagInputChange,
  onKeyPress,
  onAddTag,
  canAddTag,
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id="tags"
          placeholder={t('builder.modals.saveInstruction.tagsPlaceholderImproved')}
          value={tagInput}
          onChange={e => onTagInputChange(e.target.value)}
          onKeyDown={onKeyPress}
          className="bg-card border-border text-foreground pr-16"
          maxLength={FORM_CONFIG.MAX_TAG_LENGTH}
        />
        {canAddTag && (
          <Button
            type="button"
            onClick={onAddTag}
            size="sm"
            className={CSS_CLASSES_SAVE_INSTRUCTION_MODAL.addTagButton}
          >
            {t('builder.modals.saveInstruction.addTag')}
          </Button>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {t('builder.modals.saveInstruction.tagsHint')}
      </div>
    </div>
  )
})

TagInput.displayName = 'TagInput'

interface TagListProps {
  tags: string[]
  onRemoveTag: (tag: string) => void
}

const TagList = memo<TagListProps>(({ tags, onRemoveTag }) => {
  const { t } = useTranslation()

  if (tags.length === 0)
    return null

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map(tag => (
        <span key={tag} className={CSS_CLASSES_SAVE_INSTRUCTION_MODAL.tag}>
          {tag}
          <button
            type="button"
            onClick={() => onRemoveTag(tag)}
            className={CSS_CLASSES_SAVE_INSTRUCTION_MODAL.tagRemoveButton}
            title={t('builder.modals.saveInstruction.removeTag')}
            aria-label={`Remove ${tag} tag`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )
})

TagList.displayName = 'TagList'

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  categories: string[]
}

const CategorySelect = memo<CategorySelectProps>(({ value, onChange, categories }) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="text-foreground">
        {t('builder.modals.saveInstruction.categoryLabel')}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-card border-border text-foreground cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {categories.map((category, index) => (
            <SelectItem
              key={index}
              value={category}
              className="text-foreground hover:bg-muted cursor-pointer"
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
})

CategorySelect.displayName = 'CategorySelect'

interface FormActionsProps {
  onCancel: () => void
  onSubmit: () => void
  isLoading: boolean
  isValid: boolean
}

const FormActions = memo<FormActionsProps>(({ onCancel, onSubmit, isLoading, isValid }) => {
  const { t } = useTranslation()

  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="cursor-pointer"
      >
        {t('builder.modals.saveInstruction.cancel')}
      </Button>
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onSubmit}
      >
        {isLoading
          ? t('builder.modals.saveInstruction.saving')
          : t('builder.modals.saveInstruction.save')}
      </Button>
    </div>
  )
})

FormActions.displayName = 'FormActions'

export const SaveInstructionModal = memo<SaveInstructionModalProps>(({
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const { title, description, setTitle, setDescription } = useBuilderStore(useShallow(storeSelector))
  const formRef = useRef<HTMLFormElement>(null)

  const {
    formState,
    originalValues,
    initializeForm,
    resetForm,
    updateField,
  } = useFormState(title, description, t)

  const {
    addTag,
    removeTag,
    handleKeyPress,
    canAddTag,
  } = useTagManager(formState, updateField)

  const categories = useMemo(() =>
    CATEGORY_KEYS.map(key => t(`builder.modals.saveInstruction.categories.${key}`)), [t])

  const validation = useMemo(() =>
    validateForm(formState), [formState])

  useEffect(() => {
    if (open) {
      initializeForm(title, description)
    }
  }, [open, title, description, initializeForm])

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open, resetForm])

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!validation.isValid)
      return

    setTitle(formState.title)
    setDescription(formState.description)

    onSave({
      title: formState.title.trim(),
      description: formState.description.trim(),
      category: formState.category,
      tags: formState.tags,
    })
  }, [formState, validation.isValid, setTitle, setDescription, onSave])

  const handleCancel = useCallback(() => {
    setTitle(originalValues.title)
    setDescription(originalValues.description)
    onOpenChange(false)
  }, [originalValues, setTitle, setDescription, onOpenChange])

  const handleFieldChange = useCallback((field: keyof FormState) => (
    value: string,
  ) => {
    updateField(field, value)
  }, [updateField])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open)
        return

      if (e.key === 'Escape') {
        handleCancel()
      }
      else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSubmit()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleCancel, handleSubmit])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('builder.modals.saveInstruction.title')}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              {t('builder.modals.saveInstruction.titleLabel')}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="title"
              placeholder={t('builder.modals.saveInstruction.titlePlaceholder')}
              value={formState.title}
              onChange={e => handleFieldChange('title')(e.target.value)}
              className="bg-card border-border text-foreground"
              maxLength={FORM_CONFIG.VALIDATION.MAX_TITLE_LENGTH}
              required
              aria-invalid={!!validation.errors.title}
              aria-describedby={validation.errors.title ? 'title-error' : undefined}
            />
            {validation.errors.title && (
              <p id="title-error" className="text-sm text-red-500">
                {validation.errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              {t('builder.modals.saveInstruction.descriptionLabel')}
              <span className="text-muted-foreground text-sm ml-2">
                (
                {formState.description.length}
                /
                {FORM_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH}
                )
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder={t('builder.modals.saveInstruction.descriptionPlaceholder')}
              value={formState.description}
              onChange={e => handleFieldChange('description')(e.target.value)}
              className="bg-card border-border text-foreground resize-none max-h-24 overflow-y-auto scrollbar"
              rows={FORM_CONFIG.TEXTAREA_ROWS}
              maxLength={FORM_CONFIG.VALIDATION.MAX_DESCRIPTION_LENGTH}
              aria-invalid={!!validation.errors.description}
              aria-describedby={validation.errors.description ? 'description-error' : undefined}
            />
            {validation.errors.description && (
              <p id="description-error" className="text-sm text-red-500">
                {validation.errors.description}
              </p>
            )}
          </div>

          <CategorySelect
            value={formState.category}
            onChange={handleFieldChange('category')}
            categories={categories}
          />

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-foreground">
              {t('builder.modals.saveInstruction.tagsLabel')}
              <span className="text-muted-foreground text-sm ml-2">
                (
                {formState.tags.length}
                /
                {FORM_CONFIG.MAX_TAGS_COUNT}
                )
              </span>
            </Label>
            <TagInput
              tagInput={formState.tagInput}
              onTagInputChange={handleFieldChange('tagInput')}
              onKeyPress={handleKeyPress}
              onAddTag={addTag}
              canAddTag={canAddTag as boolean}
            />
            <TagList
              tags={formState.tags}
              onRemoveTag={removeTag}
            />
          </div>

          <FormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isValid={validation.isValid}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
})

SaveInstructionModal.displayName = 'SaveInstructionModal'
