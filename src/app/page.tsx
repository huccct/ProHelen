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
import React from 'react'
import { IoArrowForward } from 'react-icons/io5'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col">
          {/* Hero Section */}
          <motion.div
            className="flex-1 flex flex-col justify-center items-center text-center space-y-8 sm:space-y-12 py-8 sm:py-0"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="space-y-4 sm:space-y-6 px-4"
              variants={fadeIn}
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                Design Your AI Assistant
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto cursor-default"
                variants={fadeIn}
              >
                Create custom instructions with visual blocks. No coding required.
              </motion.p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl px-4"
              variants={staggerContainer}
            >
              <motion.div
                className="p-4 sm:p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-all duration-200 cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="text-lg font-semibold mb-2">Visual Builder</h3>
                <p className="text-gray-400 text-sm sm:text-base">Drag and drop interface for creating custom instructions</p>
              </motion.div>
              <motion.div
                className="p-4 sm:p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-all duration-200 cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="text-lg font-semibold mb-2">Smart Templates</h3>
                <p className="text-gray-400 text-sm sm:text-base">Pre-built templates for common educational scenarios</p>
              </motion.div>
              <motion.div
                className="p-4 sm:p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-all duration-200 cursor-pointer sm:col-span-2 lg:col-span-1"
                variants={cardVariants}
                whileHover="hover"
              >
                <h3 className="text-lg font-semibold mb-2">Instant Preview</h3>
                <p className="text-gray-400 text-sm sm:text-base">See your AI assistant's behavior in real-time</p>
              </motion.div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              className="pt-4 sm:pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-lg transition-all duration-300 cursor-pointer"
                  onClick={() => router.push('/builder')}
                >
                  Start Building
                  <IoArrowForward className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="py-6 sm:py-8 text-center text-gray-500 text-xs sm:text-sm cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            © 2025 ProHelen. All rights reserved.
          </motion.div>
        </div>
      </div>
    </div>
  )
}
