'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useBuilderStore } from '@/store/builder'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/shallow'

interface SaveInstructionModalProps {
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

export function SaveInstructionModal({ open, onOpenChange, onSave, isLoading }: SaveInstructionModalProps) {
  const { t } = useTranslation()
  const { title, description, setTitle, setDescription } = useBuilderStore(useShallow(state => ({
    title: state.title,
    description: state.description,
    setTitle: state.setTitle,
    setDescription: state.setDescription,
  })))

  const [originalValues, setOriginalValues] = useState({ title: '', description: '' })

  const [formData, setFormData] = useState<InstructionFormData>({
    title: '',
    description: '',
    category: t('builder.modals.saveInstruction.categories.general'),
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (open) {
      setOriginalValues({ title, description })
      setFormData(prev => ({
        ...prev,
        title,
        description,
      }))
    }
  }, [open, title, description])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim())
      return

    setTitle(formData.title)
    setDescription(formData.description)

    onSave(formData)
  }

  const handleCancel = () => {
    setTitle(originalValues.title)
    setDescription(originalValues.description)
    onOpenChange(false)
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const categories = [
    t('builder.modals.saveInstruction.categories.general'),
    t('builder.modals.saveInstruction.categories.academic'),
    t('builder.modals.saveInstruction.categories.writing'),
    t('builder.modals.saveInstruction.categories.programming'),
    t('builder.modals.saveInstruction.categories.dataAnalysis'),
    t('builder.modals.saveInstruction.categories.creative'),
    t('builder.modals.saveInstruction.categories.productivity'),
    t('builder.modals.saveInstruction.categories.research'),
    t('builder.modals.saveInstruction.categories.education'),
    t('builder.modals.saveInstruction.categories.business'),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">{t('builder.modals.saveInstruction.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              {t('builder.modals.saveInstruction.titleLabel')}
            </Label>
            <Input
              id="title"
              placeholder={t('builder.modals.saveInstruction.titlePlaceholder')}
              value={formData.title}
              onChange={e => handleTitleChange(e.target.value)}
              className="bg-card border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              {t('builder.modals.saveInstruction.descriptionLabel')}
            </Label>
            <Textarea
              id="description"
              placeholder={t('builder.modals.saveInstruction.descriptionPlaceholder')}
              value={formData.description}
              onChange={e => handleDescriptionChange(e.target.value)}
              className="bg-card border-border text-foreground resize-none max-h-24 overflow-y-auto scrollbar"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              {t('builder.modals.saveInstruction.categoryLabel')}
            </Label>
            <Select
              value={formData.category}
              onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-card border-border text-foreground cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category} className="text-foreground hover:bg-muted cursor-pointer">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-foreground">
              {t('builder.modals.saveInstruction.tagsLabel')}
            </Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="tags"
                  placeholder={t('builder.modals.saveInstruction.tagsPlaceholderImproved')}
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-card border-border text-foreground pr-16"
                />
                {tagInput.trim() && (
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                  >
                    {t('builder.modals.saveInstruction.addTag')}
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {t('builder.modals.saveInstruction.tagsHint')}
              </div>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-primary/60 hover:text-primary hover:bg-primary/20 w-4 h-4 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      title={t('builder.modals.saveInstruction.removeTag')}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="cursor-pointer"
            >
              {t('builder.modals.saveInstruction.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {isLoading ? t('builder.modals.saveInstruction.saving') : t('builder.modals.saveInstruction.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
