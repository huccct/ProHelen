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
  isFavorite: boolean
}

export function SaveInstructionModal({ open, onOpenChange, onSave, isLoading }: SaveInstructionModalProps) {
  const { t } = useTranslation()
  const { title, description, setTitle, setDescription } = useBuilderStore(useShallow(state => ({
    title: state.title,
    description: state.description,
    setTitle: state.setTitle,
    setDescription: state.setDescription,
  })))

  // 保存弹框打开时的原始值，用于取消时恢复
  const [originalValues, setOriginalValues] = useState({ title: '', description: '' })

  const [formData, setFormData] = useState<InstructionFormData>({
    title: '',
    description: '',
    category: t('builder.modals.saveInstruction.categories.general'),
    tags: [],
    isFavorite: false,
  })
  const [tagInput, setTagInput] = useState('')

  // 当弹框打开时，同步 store 中的最新值到表单，并保存原始值
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

    // 只有在保存时才同步到 store
    setTitle(formData.title)
    setDescription(formData.description)

    onSave(formData)
  }

  const handleCancel = () => {
    // 恢复到弹框打开时的原始值
    setTitle(originalValues.title)
    setDescription(originalValues.description)
    onOpenChange(false)
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value }))
    // 移除实时同步到 store
  }

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }))
    // 移除实时同步到 store
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
    if (e.key === 'Enter') {
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
              <SelectTrigger className="bg-card border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category} className="text-foreground hover:bg-muted">
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
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder={t('builder.modals.saveInstruction.tagsPlaceholder')}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-card border-border text-foreground flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="cursor-pointer"
              >
                {t('builder.modals.saveInstruction.addTag')}
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-card text-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1 border border-border"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={e => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
              className="rounded border-border bg-card"
            />
            <Label htmlFor="favorite" className="text-foreground text-sm">
              {t('builder.modals.saveInstruction.addToFavorites')}
            </Label>
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
