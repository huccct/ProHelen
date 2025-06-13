'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoArrowForward, IoCodeSlash, IoCube, IoFlash } from 'react-icons/io5'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

function TypewriterEffect() {
  const verbs = [
    'Design',
    'Build',
    'Create',
    'Deploy',
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
          }, 3000)
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
          }, 1500)
        }
      }
    }, isDeleting ? 80 : 120)

    return () => clearTimeout(timeout)
  }, [currentIndex, isDeleting, currentVerb])

  return (
    <>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white"
      >
        {displayText}
      </motion.span>
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="inline-block w-[3px] h-[1em] translate-y-[2px] mx-[2px] bg-white rounded-full"
      />
      <span className="text-gray-300"> LLM</span>
    </>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.01)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#fadeGradient)" />
      </svg>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }: {
  icon: any
  title: string
  description: string
  delay?: number
}) {
  return (
    <motion.div
      className="relative p-6 rounded-xl border border-gray-800/50 bg-gray-900/20 backdrop-blur-sm group hover:border-gray-700/50 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Icon className="h-8 w-8 text-white mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <GridBackground />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-gray-600/5 to-gray-500/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-gray-500/5 to-gray-600/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Floating code elements */}
        <motion.div
          className="absolute top-20 right-20 opacity-5"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="text-6xl font-mono text-gray-400">{`{}`}</div>
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 opacity-3"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        >
          <div className="text-4xl font-mono text-gray-500">{`</>`}</div>
        </motion.div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800/20">
        <NavBar />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col relative">
          {/* Hero Section */}
          <motion.div
            className="flex-1 flex flex-col justify-center items-center text-center space-y-12 py-24"
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="space-y-8 max-w-5xl mx-auto px-4"
              variants={fadeIn}
            >
              <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl font-light tracking-tight leading-none"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="text-white">
                  <TypewriterEffect />
                  <br />
                  <span className="text-gray-300">Behaviors</span>
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                A Web-Based Tool for Customising LLM Behaviour Using
                {' '}
                <span className="text-white font-medium">Visual Instruction Generation</span>
                <br />
                Drag, drop, and deploy intelligent prompts with ease.
              </motion.p>

              {/* Workflow visualization */}
              <motion.div
                className="max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex items-center justify-center gap-8 text-sm">
                  <motion.div
                    className="flex flex-col items-center space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-lg">1</span>
                    </div>
                    <span className="text-gray-300 text-center">
                      Design
                      <br />
                      Visually
                    </span>
                  </motion.div>

                  <motion.div
                    className="w-8 h-[1px] bg-gray-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  />

                  <motion.div
                    className="flex flex-col items-center space-y-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-lg">2</span>
                    </div>
                    <span className="text-gray-300 text-center">
                      Generate
                      <br />
                      Instantly
                    </span>
                  </motion.div>

                  <motion.div
                    className="w-8 h-[1px] bg-gray-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  />

                  <motion.div
                    className="flex flex-col items-center space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-lg">3</span>
                    </div>
                    <span className="text-gray-300 text-center">
                      Deploy
                      <br />
                      Anywhere
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <FeatureCard
                icon={IoCodeSlash}
                title="Visual Block Editor"
                description="Intuitive drag-and-drop interface for building complex AI prompts without coding"
                delay={0.8}
              />
              <FeatureCard
                icon={IoCube}
                title="Smart Templates"
                description="Pre-built prompt patterns and customizable templates for common AI tasks"
                delay={0.9}
              />
              <FeatureCard
                icon={IoFlash}
                title="Real-time Preview"
                description="See your AI's behavior change instantly as you modify instructions"
                delay={1.0}
              />
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="relative bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-xl transition-all duration-300 cursor-pointer"
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

              <motion.div
                className="flex items-center justify-center gap-6 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <span>✓ No setup required</span>
                <span>✓ Deploy in seconds</span>
                <span>✓ Free to start</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="py-16 border-t border-gray-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Visual Blocks', value: '50+' },
                { label: 'Templates', value: '20+' },
                { label: 'AI Models', value: '10+' },
                { label: 'Deploy Time', value: '<1s' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                >
                  <div className="text-3xl font-mono font-light text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="py-12 text-center text-gray-600 text-sm font-light border-t border-gray-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            © 2025 ProHelen. Built for the next generation of AI development.
          </motion.div>
        </div>
      </div>
    </div>
  )
}
