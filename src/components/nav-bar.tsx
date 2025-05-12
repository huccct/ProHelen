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

export function NavBar() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="border-b border-gray-800"
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
          <div>
            {!session
              ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      className="text-white hover:text-gray-200 hover:bg-transparent transition-colors duration-200 cursor-pointer"
                      onClick={() => router.push('/auth/signin')}
                    >
                      Login
                    </Button>
                  </motion.div>
                )
              : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 relative"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                          {session.user?.image && (
                            <img
                              src={session.user.image}
                              alt={session.user.name || 'avatar'}
                              className="w-8 h-8 rounded-full border"
                            />
                          )}
                          <span className="font-medium">{session.user?.name}</span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[160px] bg-zinc-900 text-white border-zinc-800 dark:bg-zinc-900 dark:text-white dark:border-zinc-800"
                      >
                        <DropdownMenuLabel>
                          {session.user?.name}
                          <div className="text-xs text-gray-500">{session.user?.email}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => router.push('/dashboard')}
                          className="cursor-pointer"
                        >
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="cursor-pointer text-red-600"
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
