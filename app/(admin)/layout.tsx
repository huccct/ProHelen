import { AdminSidebar } from '@/components/admin/sidebar'
import { NavBar } from '@/components/common/nav-bar'
import { authOptions } from '@/lib/auth-config'
import { getAppSettings } from '@/lib/server-utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

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
