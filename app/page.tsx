'use client'

import { NavBar } from '@/components/nav-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoArrowForward, IoCodeSlash, IoCube, IoDocumentText, IoFlash, IoGrid, IoLayers, IoRocket, IoSparkles, IoTrendingUp } from 'react-icons/io5'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
}

function TypewriterEffect() {
  const phrases = [
    'Visual Prompt Design',
    'AI Behavior Control',
    'Smart Instructions',
    'LLM Customization',
  ]
  const [currentPhrase, setCurrentPhrase] = useState(0)
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
    const phrase = phrases[currentPhrase]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < phrase.length) {
          setDisplayText(prev => prev + phrase[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }
        else {
          setTimeout(() => {
            setIsDeleting(true)
          }, 2500)
        }
      }
      else {
        if (currentIndex > 0) {
          setDisplayText(phrase.substring(0, currentIndex - 1))
          setCurrentIndex(prev => prev - 1)
        }
        else {
          setTimeout(() => {
            setIsDeleting(false)
            setCurrentPhrase(prev => (prev + 1) % phrases.length)
          }, 800)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentIndex, isDeleting, currentPhrase])

  return (
    <>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-foreground"
      >
        {displayText}
      </motion.span>
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="inline-block w-[3px] h-[1em] translate-y-[2px] mx-[2px] bg-foreground rounded-full"
      />
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
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.02"
              className="text-foreground"
            />
          </pattern>
          <radialGradient id="radialGradient" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.04" className="text-foreground" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.01" className="text-foreground" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" className="text-background" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#radialGradient)" />
      </svg>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, highlight, delay = 0 }: {
  icon: any
  title: string
  description: string
  highlight?: string
  delay?: number
}) {
  return (
    <motion.div
      className="relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm group hover:border-border transition-all duration-500 hover:bg-card/80"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-muted-foreground/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-muted border border-border">
            <Icon className="h-6 w-6 text-foreground" />
          </div>
          {highlight && (
            <Badge variant="outline" className="text-xs">
              {highlight}
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-foreground/90 transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

function UseCaseCard({ title, description, icon: Icon, delay = 0 }: {
  title: string
  description: string
  icon: any
  delay?: number
}) {
  return (
    <motion.div
      className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ x: 5 }}
    >
      <div className="p-2 rounded-lg bg-muted border border-border flex-shrink-0">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div>
        <h4 className="font-medium text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <GridBackground />

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/5 to-blue-600/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-600/5 to-teal-600/5 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -60, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />

        {/* Floating UI elements */}
        <motion.div
          className="absolute top-20 right-20 opacity-10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="w-16 h-3 bg-muted rounded"></div>
            <div className="w-12 h-3 bg-muted/80 rounded"></div>
            <div className="w-14 h-3 bg-muted rounded"></div>
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 opacity-8"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="w-8 h-8 bg-muted rounded border border-border"></div>
            <div className="w-8 h-8 bg-muted/80 rounded border border-border/80"></div>
            <div className="w-8 h-8 bg-muted/80 rounded border border-border/80"></div>
            <div className="w-8 h-8 bg-muted rounded border border-border"></div>
          </div>
        </motion.div>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <NavBar />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col relative">
          {/* Enhanced Hero Section */}
          <motion.div
            className="flex-1 flex flex-col justify-center items-center text-center space-y-12 py-24"
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="space-y-8 max-w-6xl mx-auto px-4"
              variants={fadeIn}
            >
              <motion.div
                className="flex items-center justify-center gap-2 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="outline" className="px-3 py-1">
                  <IoSparkles className="w-3 h-3 mr-1" />
                  ProHelen v1.0
                </Badge>
              </motion.div>

              <motion.h1
                className="text-6xl sm:text-7xl md:text-8xl font-light tracking-tight leading-none"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="text-foreground block mb-4">
                  The Future of
                </span>
                <span className="text-foreground">
                  <TypewriterEffect />
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Transform how you interact with AI through
                {' '}
                <span className="text-foreground font-medium">intuitive visual building blocks</span>
                . Create sophisticated LLM instructions without coding, deploy instantly, and achieve precise AI behavior control with our revolutionary drag-and-drop interface.
              </motion.p>

              {/* Enhanced workflow visualization */}
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex items-center justify-center gap-12 text-sm">
                  <motion.div
                    className="flex flex-col items-center space-y-3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <div className="w-16 h-16 rounded-2xl border-2 border-border bg-muted backdrop-blur-sm flex items-center justify-center group hover:border-border/80 transition-all">
                      <IoGrid className="text-2xl text-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-foreground text-center font-medium">
                      Drag & Drop
                      <br />
                      <span className="text-sm text-muted-foreground">Visual Blocks</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <div className="w-12 h-[2px] bg-gradient-to-r from-muted-foreground to-muted-foreground/70"></div>
                    <IoArrowForward className="text-muted-foreground" />
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-center space-y-3"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.6 }}
                  >
                    <div className="w-16 h-16 rounded-2xl border-2 border-border bg-muted backdrop-blur-sm flex items-center justify-center group hover:border-border/80 transition-all">
                      <IoFlash className="text-2xl text-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-foreground text-center font-medium">
                      Generate
                      <br />
                      <span className="text-sm text-muted-foreground">Smart Prompts</span>
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <div className="w-12 h-[2px] bg-gradient-to-r from-muted-foreground to-muted-foreground/70"></div>
                    <IoArrowForward className="text-muted-foreground" />
                  </motion.div>

                  <motion.div
                    className="flex flex-col items-center space-y-3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <div className="w-16 h-16 rounded-2xl border-2 border-border bg-muted backdrop-blur-sm flex items-center justify-center group hover:border-border/80 transition-all">
                      <IoRocket className="text-2xl text-foreground group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-foreground text-center font-medium">
                      Deploy
                      <br />
                      <span className="text-sm text-muted-foreground">Instantly</span>
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced CTA Section */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="relative bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg font-medium rounded-xl transition-all duration-300 cursor-pointer shadow-2xl"
                    onClick={() => router.push('/builder')}
                  >
                    <IoSparkles className="h-5 w-5 mr-2" />
                    Start Creating
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
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-10 py-6 text-lg font-medium rounded-xl transition-all duration-300 cursor-pointer"
                    onClick={() => router.push('/templates')}
                  >
                    <IoDocumentText className="h-5 w-5 mr-2" />
                    Explore Templates
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  No coding required
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Real-time preview
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Free to start
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Features Section */}
        <motion.div
          className="py-24 space-y-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-light text-foreground">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build, manage, and deploy sophisticated AI instructions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={IoGrid}
              title="Visual Block System"
              description="Intuitive drag-and-drop interface with intelligent block connections. Build complex AI behaviors using our comprehensive library of pre-designed components."
              highlight="Core Feature"
              delay={0.8}
            />
            <FeatureCard
              icon={IoDocumentText}
              title="Smart Templates"
              description="Pre-built instruction templates for common AI tasks. Educational, productivity, and creative use cases with customizable parameters and examples."
              highlight="Popular"
              delay={0.9}
            />
            <FeatureCard
              icon={IoFlash}
              title="Real-time Preview"
              description="See your AI's behavior change instantly as you modify instructions. Live testing environment with immediate feedback and iteration."
              highlight="Pro"
              delay={1.0}
            />
            <FeatureCard
              icon={IoLayers}
              title="Instruction Management"
              description="Organize, categorize, and version your AI instructions. Advanced search, favorites, and sharing capabilities with team collaboration features."
              delay={1.1}
            />
            <FeatureCard
              icon={IoCodeSlash}
              title="Export & Integration"
              description="Export your instructions in multiple formats. Direct API integration with popular AI models and platforms for seamless deployment."
              delay={1.2}
            />
            <FeatureCard
              icon={IoTrendingUp}
              title="Analytics & Insights"
              description="Track usage patterns, performance metrics, and optimization suggestions. Data-driven insights to improve your AI instruction effectiveness."
              delay={1.3}
            />
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          className="py-24 space-y-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-light text-foreground">Perfect For</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're an educator, developer, or AI enthusiast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              <UseCaseCard
                icon={IoCodeSlash}
                title="Developers & Engineers"
                description="Rapid prototyping of AI-powered features, API prompt optimization, and integration testing"
                delay={1.3}
              />
              <UseCaseCard
                icon={IoDocumentText}
                title="Content Creators"
                description="Custom writing assistants, content generation workflows, and creative AI collaborations"
                delay={1.4}
              />
              <UseCaseCard
                icon={IoSparkles}
                title="Educators & Trainers"
                description="Interactive learning experiences, automated grading systems, and personalized tutoring"
                delay={1.5}
              />
            </div>
            <div className="space-y-6">
              <UseCaseCard
                icon={IoRocket}
                title="Startup Teams"
                description="MVP development, customer support automation, and product feature enhancement"
                delay={1.6}
              />
              <UseCaseCard
                icon={IoTrendingUp}
                title="Business Analysts"
                description="Data analysis workflows, report generation, and decision support systems"
                delay={1.7}
              />
              <UseCaseCard
                icon={IoCube}
                title="AI Researchers"
                description="Prompt engineering experiments, behavior analysis, and model comparison studies"
                delay={1.8}
              />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div
          className="py-20 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Block Types', value: '30+', description: 'Versatile components' },
              { label: 'Templates', value: '25+', description: 'Ready-to-use patterns' },
              { label: 'Instructions', value: '500+', description: 'Community created' },
              { label: 'Response Time', value: '<100ms', description: 'Lightning fast' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="space-y-3 group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl font-mono font-light text-foreground group-hover:text-foreground/80 transition-colors">
                  {stat.value}
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-foreground/80 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="py-16 text-center text-muted-foreground text-sm font-light border-t border-border/50 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Support</span>
          </div>
          <div>
            © 2025 ProHelen. Revolutionizing AI instruction design for everyone.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
