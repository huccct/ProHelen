'use client'

import logo from '@/assets/icons/logo.png'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookText, Files, LayoutDashboard, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface NavBarProps {
  hideSignIn?: boolean
}

export function NavBar({ hideSignIn = false }: NavBarProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = () => {
    signOut({ redirect: false })
    toast.success('Signed out successfully')
    router.push('/sign-in')
  }

  return (
    <nav className="border-b border-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center text-xl font-bold cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image src={logo} alt="ProHelen Logo" width={32} height={32} className="mr-2" />
            ProHelen
          </div>

          <div>
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
                    <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-gray-800">
                      <DropdownMenuLabel className="text-gray-400">
                        {session.user?.name || 'User'}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white hover:bg-white/[0.02] cursor-pointer flex items-center gap-2"
                        onClick={() => router.push('/dashboard')}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white hover:bg-white/[0.02] cursor-pointer flex items-center gap-2"
                        onClick={() => router.push('/templates')}
                      >
                        <Files className="w-4 h-4" />
                        Templates
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white hover:bg-white/[0.02] cursor-pointer flex items-center gap-2"
                        onClick={() => router.push('/my-instructions')}
                      >
                        <BookText className="w-4 h-4" />
                        My Instructions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white hover:bg-white/[0.02] cursor-pointer flex items-center gap-2"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              : !hideSignIn && (
                  <Button
                    onClick={() => router.push('/sign-in')}
                    className="bg-white text-black hover:bg-gray-100 cursor-pointer"
                  >
                    Sign in
                  </Button>
                )}
          </div>
        </div>
      </div>
    </nav>
  )
}
