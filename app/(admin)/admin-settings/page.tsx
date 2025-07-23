'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      toast.success(t('admin.settings.saveSuccess'))
    }
    catch (error) {
      console.error(error)
      toast.error(t('admin.settings.saveError'))
    }
    finally {
      setIsLoading(false)
    }
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
                <Input id="site-name" defaultValue="ProHelen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">{t('admin.settings.general.siteDescription')}</Label>
                <Input id="site-description" defaultValue="AI提示词工程平台" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance" />
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
                <Input id="openai-key" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-rate-limit">{t('admin.settings.api.rateLimit')}</Label>
                <Input id="api-rate-limit" type="number" defaultValue={60} />
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
                <Input id="session-timeout" type="number" defaultValue={30} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="force-2fa" />
                <Label htmlFor="force-2fa">{t('admin.settings.security.force2fa')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allow-registration" defaultChecked />
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
