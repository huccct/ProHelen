'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoArrowForward } from 'react-icons/io5'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

function TypewriterEffect() {
  const verbs = [
    'Design',
    'Customize',
    'Build',
    'Create',
    'Craft',
  ]
  const [currentVerb, setCurrentVerb] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const verb = verbs[currentVerb]
    const text = verb

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }
        else {
          setTimeout(() => {
            setIsDeleting(true)
          }, 4000)
        }
      }
      else {
        if (currentIndex > 0) {
          setDisplayText(text.substring(0, currentIndex - 1))
          setCurrentIndex(prev => prev - 1)
        }
        else {
          setTimeout(() => {
            setIsDeleting(false)
            setCurrentVerb(prev => (prev + 1) % verbs.length)
          }, 2000)
        }
      }
    }, isDeleting ? 100 : 150)

    return () => clearTimeout(timeout)
  }, [currentIndex, isDeleting, currentVerb])

  return (
    <>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500"
      >
        {displayText}
      </motion.span>
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="inline-block w-[3px] h-[1em] translate-y-[2px] mx-[2px] bg-blue-400 rounded-full"
      />
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500"> Your</span>
    </>
  )
}

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="relative z-20">
        <NavBar />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Gradient Blobs - 极简柔和色块 */}
        <motion.div
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-blue-900 via-gray-800 to-gray-900 opacity-30 blur-3xl z-0"
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-gray-800 via-blue-800 to-gray-900 opacity-20 blur-2xl z-0"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        {/* 去掉神经网络线条SVG */}
        <div>
          <svg width="100%" height="100%" viewBox="0 0 1440 800" className="opacity-50">
            <defs>
              <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.2" />
              </linearGradient>
              <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="url(#grid-gradient)" strokeWidth="0.8" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#grid)"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col relative">
          {/* Hero Section */}
          <motion.div
            className="flex-1 flex flex-col justify-center items-center text-center space-y-12 py-16"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="space-y-6 max-w-4xl mx-auto px-4"
              variants={fadeIn}
            >
              <motion.div className="space-y-4">
                <motion.h1
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                    <TypewriterEffect />
                    <br />
                    AI Assistant
                  </span>
                </motion.h1>
                <motion.p
                  className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.2,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                >
                  Create custom instructions with visual blocks.
                  <br />
                  No coding required.
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4"
              variants={staggerContainer}
            >
              {[
                {
                  title: 'Visual Builder',
                  description: 'Drag and drop interface for creating custom instructions',
                  color: 'blue',
                  icon: '🎨',
                },
                {
                  title: 'Smart Templates',
                  description: 'Pre-built templates for common educational scenarios',
                  color: 'purple',
                  icon: '🧠',
                },
                {
                  title: 'Instant Preview',
                  description: 'See your AI assistant\'s behavior in real-time',
                  color: 'teal',
                  icon: '👁️',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`group relative p-6 rounded-lg border border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-${feature.color}-500/50 transition-all duration-500 overflow-hidden`}
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: {
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  }}
                >
                  <motion.div
                    className="absolute -right-4 -top-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    animate={{
                      rotate: [0, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className={`text-xl font-semibold mb-3 group-hover:text-${feature.color}-400 transition-colors duration-500`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 relative z-10">{feature.description}</p>
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r from-${feature.color}-500/0 via-${feature.color}-500/5 to-${feature.color}-500/0`}
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-white via-white to-gray-400 rounded-lg blur opacity-30"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  size="lg"
                  className="relative bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-lg transition-all duration-300 cursor-pointer"
                  onClick={() => router.push('/builder')}
                >
                  Start Building
                  <motion.div
                    className="inline-block ml-2"
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <IoArrowForward className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="py-8 text-center text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            © 2025 ProHelen. All rights reserved.
          </motion.div>
        </div>
      </div>
    </div>
  )
}
