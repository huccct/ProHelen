'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'
import { signOut, useSession } from 'next-auth/react'
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-b border-gray-800 text-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push('/')}
          >
            ProHelen
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
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
                        className="text-gray-300 hover:text-white cursor-pointer"
                        onClick={() => router.push('/dashboard')}
                      >
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white cursor-pointer"
                        onClick={() => router.push('/templates')}
                      >
                        Templates
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white cursor-pointer"
                        onClick={() => router.push('/my-instructions')}
                      >
                        My Instructions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem
                        className="text-gray-300 hover:text-white cursor-pointer"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              : !hideSignIn && (
                  <Button
                    onClick={() => router.push('/sign-in')}
                    className="cursor-pointer"
                  >
                    Sign in
                  </Button>
                )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
