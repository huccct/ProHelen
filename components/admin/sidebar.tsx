'use client'

import { cn } from '@/lib/utils'
import {
  BarChart,
  Command,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const navItems = [
  {
    titleKey: 'nav.adminDashboard',
    href: '/admin-dashboard',
    icon: LayoutDashboard,
  },
  {
    titleKey: 'nav.adminUsers',
    href: '/admin-users',
    icon: Users,
  },
  {
    titleKey: 'nav.adminTemplates',
    href: '/admin-templates',
    icon: FileText,
  },
  {
    titleKey: 'nav.adminInstructions',
    href: '/admin-instructions',
    icon: Command,
  },
  {
    titleKey: 'nav.adminAnalytics',
    href: '/admin-analytics',
    icon: BarChart,
  },
  {
    titleKey: 'nav.adminSettings',
    href: '/admin-settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6">
      </div>
      <nav className="space-y-1 px-2">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.titleKey)}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
