'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      toast.success('设置已保存')
    }
    catch (error) {
      console.error(error)
      toast.error('保存设置失败')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">系统设置</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="api">API 设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>
                配置系统的基本参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">网站名称</Label>
                <Input id="site-name" defaultValue="ProHelen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">网站描述</Label>
                <Input id="site-description" defaultValue="AI提示词工程平台" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance" />
                <Label htmlFor="maintenance">维护模式</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API 设置</CardTitle>
              <CardDescription>
                配置 API 相关参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input id="openai-key" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-rate-limit">API 速率限制 (每分钟请求数)</Label>
                <Input id="api-rate-limit" type="number" defaultValue={60} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>
                配置系统安全相关参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">会话超时时间 (分钟)</Label>
                <Input id="session-timeout" type="number" defaultValue={30} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="force-2fa" />
                <Label htmlFor="force-2fa">强制开启两步验证</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allow-registration" defaultChecked />
                <Label htmlFor="allow-registration">允许新用户注册</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? '保存中...' : '保存设置'}
        </Button>
      </div>
    </div>
  )
}
