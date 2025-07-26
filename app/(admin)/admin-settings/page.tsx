'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface SystemSetting {
  key: string
  value: string
  category: string
  description?: string
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    siteName: 'ProHelen',
    siteDescription: '',
    maintenanceMode: false,
    openaiKey: '',
    rateLimit: 60,
    sessionTimeout: 30,
    force2fa: false,
    allowRegistration: true,
  })

  // 初始化设置
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          const settingsMap = data.settings.reduce((acc: any, setting: SystemSetting) => {
            acc[setting.key] = setting.value
            return acc
          }, {})

          setFormData({
            siteName: settingsMap['site.name'] || 'ProHelen',
            siteDescription: settingsMap['site.description'] || t('admin.settings.general.siteDescriptionDefault'),
            maintenanceMode: settingsMap['maintenance.mode'] === 'true',
            openaiKey: settingsMap['api.openai.key'] || '',
            rateLimit: Number.parseInt(settingsMap['api.rate.limit']) || 60,
            sessionTimeout: Number.parseInt(settingsMap['security.session.timeout']) || 30,
            force2fa: settingsMap['security.force.2fa'] === 'true',
            allowRegistration: settingsMap['security.allow.registration'] !== 'false',
          })
        }
      }
      catch (error) {
        console.error('Failed to load settings:', error)
        toast.error(t('admin.settings.loadError'))
      }
      finally {
        setIsInitializing(false)
      }
    }

    loadSettings()
  }, [t])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const settingsToSave = [
        { key: 'site.name', value: formData.siteName, category: 'general', description: 'Site name' },
        { key: 'site.description', value: formData.siteDescription, category: 'general', description: 'Site description' },
        { key: 'maintenance.mode', value: formData.maintenanceMode.toString(), category: 'general', description: 'Maintenance mode' },
        { key: 'api.openai.key', value: formData.openaiKey, category: 'api', description: 'OpenAI API key' },
        { key: 'api.rate.limit', value: formData.rateLimit.toString(), category: 'api', description: 'API rate limit' },
        { key: 'security.session.timeout', value: formData.sessionTimeout.toString(), category: 'security', description: 'Session timeout' },
        { key: 'security.force.2fa', value: formData.force2fa.toString(), category: 'security', description: 'Force 2FA' },
        { key: 'security.allow.registration', value: formData.allowRegistration.toString(), category: 'security', description: 'Allow registration' },
      ]

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsToSave }),
      })

      if (response.ok) {
        toast.success(t('admin.settings.saveSuccess'))
        window.location.reload()
      }
      else {
        throw new Error('Save failed')
      }
    }
    catch (error) {
      console.error('Save error:', error)
      toast.error(t('admin.settings.saveError'))
    }
    finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('admin.settings.title')}</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="cursor-pointer">{t('admin.settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="api" className="cursor-pointer">{t('admin.settings.tabs.api')}</TabsTrigger>
          <TabsTrigger value="security" className="cursor-pointer">{t('admin.settings.tabs.security')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.settings.general.title')}</CardTitle>
              <CardDescription>
                {t('admin.settings.general.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">{t('admin.settings.general.siteName')}</Label>
                <Input
                  id="site-name"
                  value={formData.siteName}
                  onChange={e => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">{t('admin.settings.general.siteDescription')}</Label>
                <Input
                  id="site-description"
                  value={formData.siteDescription}
                  onChange={e => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance"
                  checked={formData.maintenanceMode}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, maintenanceMode: checked }))}
                  className="cursor-pointer"
                />
                <Label htmlFor="maintenance">{t('admin.settings.general.maintenanceMode')}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.settings.api.title')}</CardTitle>
              <CardDescription>
                {t('admin.settings.api.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">{t('admin.settings.api.openaiKey')}</Label>
                <Input
                  id="openai-key"
                  type="password"
                  value={formData.openaiKey}
                  onChange={e => setFormData(prev => ({ ...prev, openaiKey: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-rate-limit">{t('admin.settings.api.rateLimit')}</Label>
                <Input
                  id="api-rate-limit"
                  type="number"
                  value={formData.rateLimit}
                  onChange={e => setFormData(prev => ({ ...prev, rateLimit: Number.parseInt(e.target.value) || 60 }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.settings.security.title')}</CardTitle>
              <CardDescription>
                {t('admin.settings.security.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">{t('admin.settings.security.sessionTimeout')}</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={formData.sessionTimeout}
                  onChange={e => setFormData(prev => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) || 30 }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                {/* todo: need to add 2fa setting not now */}
                <Switch
                  id="force-2fa"
                  checked={formData.force2fa}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, force2fa: checked }))}
                  className="cursor-pointer"
                />
                <Label htmlFor="force-2fa">{t('admin.settings.security.force2fa')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="allow-registration"
                  checked={formData.allowRegistration}
                  onCheckedChange={checked => setFormData(prev => ({ ...prev, allowRegistration: checked }))}
                  className="cursor-pointer"
                />
                <Label htmlFor="allow-registration">{t('admin.settings.security.allowRegistration')}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 cursor-pointer">
          {isLoading ? t('admin.settings.saving') : t('admin.settings.save')}
        </Button>
      </div>
    </div>
  )
}
