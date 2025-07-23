'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  Command,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
    titleKey: 'nav.adminSettings',
    href: '/admin-settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={cn(
      'relative border-r bg-background transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64',
    )}
    >
      <div className="h-16">
      </div>
      <nav className="grid gap-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-lg transition-colors',
              isCollapsed
                ? 'h-11 w-11 ml-3 justify-center'
                : 'h-10 mx-2 gap-3 px-3',
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            <item.icon className={cn(
              'flex-shrink-0',
              isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
            )}
            />
            <span className={cn(
              'text-sm font-medium transition-all duration-300 overflow-hidden',
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
            )}
            >
              {t(item.titleKey)}
            </span>
          </Link>
        ))}
      </nav>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-5 h-6 w-6 rounded-full border bg-background shadow-sm cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed
          ? (
              <ChevronRight className="h-3 w-3" />
            )
          : (
              <ChevronLeft className="h-3 w-3" />
            )}
      </Button>
    </aside>
  )
}
