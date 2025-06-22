'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface SaveTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (templateData: TemplateFormData) => void
  isLoading?: boolean
}

export interface TemplateFormData {
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
}

export function SaveTemplateModal({ open, onOpenChange, onSave, isLoading }: SaveTemplateModalProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    description: '',
    category: 'Other',
    tags: [],
    isPublic: false,
  })
  const [tagInput, setTagInput] = useState('')

  const categories = [
    t('builder.modals.saveTemplate.categories.goalSetting'),
    t('builder.modals.saveTemplate.categories.education'),
    t('builder.modals.saveTemplate.categories.career'),
    t('builder.modals.saveTemplate.categories.productivity'),
    t('builder.modals.saveTemplate.categories.communication'),
    t('builder.modals.saveTemplate.categories.planning'),
    t('builder.modals.saveTemplate.categories.other'),
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error(t('builder.modals.saveTemplate.titleRequired'))
      return
    }

    if (!formData.description.trim()) {
      toast.error(t('builder.modals.saveTemplate.descriptionRequired'))
      return
    }

    onSave(formData)
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('builder.modals.saveTemplate.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('builder.modals.saveTemplate.titleLabel')}</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80"
              placeholder={t('builder.modals.saveTemplate.titlePlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('builder.modals.saveTemplate.descriptionLabel')}</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80 h-20 resize-none"
              placeholder={t('builder.modals.saveTemplate.descriptionPlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('builder.modals.saveTemplate.categoryLabel')}</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80"
              disabled={isLoading}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{t('builder.modals.saveTemplate.tagsLabel')}</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-border/80"
                placeholder={t('builder.modals.saveTemplate.tagsPlaceholder')}
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-muted hover:bg-muted/80"
                disabled={isLoading}
              >
                {t('builder.modals.saveTemplate.addTag')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-muted text-xs rounded cursor-pointer hover:bg-muted/80"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  {' '}
                  ×
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={e => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="w-4 h-4"
              disabled={isLoading}
            />
            <label htmlFor="isPublic" className="text-sm text-foreground">
              {t('builder.modals.saveTemplate.makePublic')}
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              {t('builder.modals.saveTemplate.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? t('builder.modals.saveTemplate.saving') : t('builder.modals.saveTemplate.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
