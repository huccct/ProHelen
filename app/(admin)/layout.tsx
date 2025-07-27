import { AdminSidebar } from '@/components/admin/sidebar'
import { NavBar } from '@/components/common/nav-bar'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

async function getAppSettings() {
  try {
    const settings = await prisma.systemSetting.findMany()
    const settingsMap = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return {
      siteName: settingsMap['site.name'] || 'ProHelen',
      siteDescription: settingsMap['site.description'] || 'AI Instruction Management Platform',
      maintenanceMode: settingsMap['maintenance.mode'] === 'true',
    }
  }
  catch (error) {
    console.error('Failed to load app settings:', error)
    return {
      siteName: 'ProHelen',
      siteDescription: 'AI Instruction Management Platform',
      maintenanceMode: false,
    }
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const userRole = (session.user as any).role

  if (userRole !== 'ADMIN') {
    redirect('/')
  }

  const appSettings = await getAppSettings()

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar siteName={appSettings.siteName} />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
