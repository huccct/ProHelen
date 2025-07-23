import { AdminSidebar } from '@/components/admin/sidebar'
import { NavBar } from '@/components/nav-bar'
import { authOptions } from '@/lib/auth-config'
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
