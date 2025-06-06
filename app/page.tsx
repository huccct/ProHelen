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

function TypewriterEffect() {
  const verbs = [
    'Design',
    'Build',
    'Create',
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
        className="inline-block w-[3px] h-[1em] translate-y-[2px] mx-[2px] bg-gray-400 rounded-full"
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
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col relative">
          {/* Hero Section */}
          <motion.div
            className="flex-1 flex flex-col justify-center items-center text-center space-y-16 py-24"
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="space-y-8 max-w-4xl mx-auto px-4"
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
                  <span className="text-gray-300">AI Assistant</span>
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Visual prompt engineering made simple.
                <br />
                Drag, drop, and deploy.
              </motion.p>
            </motion.div>

            {/* Feature Points */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-4xl px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {[
                'Visual Block Editor',
                'Smart Templates',
                'Real-time Preview',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center space-x-3 text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.7 + index * 0.1,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-lg font-light">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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

          {/* Footer */}
          <motion.div
            className="py-12 text-center text-gray-600 text-sm font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            © 2025 ProHelen. All rights reserved.
          </motion.div>
        </div>
      </div>
    </div>
  )
}
