'use client'

import logo from '@/assets/icons/logo.png'
import LanguageSwitcher from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookText, Files, LayoutDashboard, LogOut, Wrench } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface NavBarProps {
  hideSignIn?: boolean
  siteName?: string
}

export function NavBar({ hideSignIn = false, siteName = 'ProHelen' }: NavBarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useTranslation()

  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const handleSignOut = () => {
    signOut({ redirect: false })
    toast.success(t('auth.signOut'))
    router.push('/sign-in')
  }

  return (
    <nav className="border-b border-border bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <Image
              src={logo}
              alt="ProHelen Logo"
              width={32}
              height={32}
              className="mr-2 filter invert-0 dark:invert"
            />
            <span className="text-xl font-bold">{siteName}</span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {session
              ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full w-8 h-8 p-0 cursor-pointer">
                        <span className="sr-only">Open user menu</span>
                        <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-sm font-medium uppercase">
                          {session.user?.name?.charAt(0) || 'U'}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                      <DropdownMenuLabel className="text-muted-foreground">
                        {session.user?.name || 'User'}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isAdmin && (
                        <>
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            onClick={() => router.push('/admin-dashboard')}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            {t('nav.adminDashboard')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => router.push('/builder')}
                      >
                        <Wrench className="w-4 h-4" />
                        {t('nav.builder')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => router.push('/templates')}
                      >
                        <Files className="w-4 h-4" />
                        {t('nav.templates')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2"
                        onClick={() => router.push('/my-instructions')}
                      >
                        <BookText className="w-4 h-4" />
                        {t('nav.myInstructions')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer flex items-center gap-2"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        {t('auth.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              : !hideSignIn && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      router.push('/sign-in')
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    {t('auth.signInButton')}
                  </Button>
                )}
          </div>
        </div>
      </div>
    </nav>
  )
}
