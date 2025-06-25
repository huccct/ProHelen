'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoArrowForward, IoCheckmarkCircle, IoCodeSlash, IoCube, IoDocumentText, IoFlash, IoGrid, IoInfinite, IoRocket, IoSparkles, IoTime, IoTrendingUp } from 'react-icons/io5'

// 丝滑的缓动函数
const easeInOutQuint = [0.86, 0, 0.07, 1]

function TypewriterEffect() {
  const { t, i18n } = useTranslation()

  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const isChinese = i18n.language === 'zh'
    const typingSpeed = isChinese ? 120 : 80
    const deleteSpeed = isChinese ? 60 : 40
    const pauseTime = isChinese ? 2500 : 2000
    const restartDelay = isChinese ? 800 : 600

    const phrases = [
      t('home.hero.typewriter.visualPromptDesign'),
      t('home.hero.typewriter.aiBehaviorControl'),
      t('home.hero.typewriter.smartInstructions'),
      t('home.hero.typewriter.llmCustomization'),
    ]

    let currentPhrase = 0
    let currentIndex = 0
    let isDeleting = false
    let animationId: NodeJS.Timeout

    const animate = () => {
      const phrase = phrases[currentPhrase]
      if (!phrase)
        return

      if (!isDeleting) {
        if (currentIndex < phrase.length) {
          setDisplayText(phrase.substring(0, currentIndex + 1))
          currentIndex++
          animationId = setTimeout(animate, typingSpeed)
        }
        else {
          animationId = setTimeout(() => {
            isDeleting = true
            animate()
          }, pauseTime)
        }
      }
      else {
        if (currentIndex > 0) {
          setDisplayText(phrase.substring(0, currentIndex - 1))
          currentIndex--
          animationId = setTimeout(animate, deleteSpeed)
        }
        else {
          isDeleting = false
          currentPhrase = (currentPhrase + 1) % phrases.length
          animationId = setTimeout(animate, restartDelay)
        }
      }
    }

    // 重置并开始动画
    currentPhrase = 0
    currentIndex = 0
    isDeleting = false
    setDisplayText('')
    animate()

    return () => {
      if (animationId) {
        clearTimeout(animationId)
      }
    }
  }, [t, i18n.language])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className="text-primary font-medium tracking-wide">
      {displayText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="inline-block w-[2px] h-[1em] translate-y-[2px] mx-[2px] bg-primary rounded-sm"
      />
    </span>
  )
}

// 线条连接背景
function ConnectedLinesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
        <motion.path
          d="M0,400 Q300,200 600,400 T1200,400"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-border/40"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: easeInOutQuint }}
        />
        <motion.path
          d="M0,200 Q400,100 800,200 T1200,200"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-border/30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 0.5, ease: easeInOutQuint }}
        />
        <motion.path
          d="M0,600 Q350,500 700,600 T1200,600"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-border/20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, delay: 1, ease: easeInOutQuint }}
        />

      </svg>
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <ConnectedLinesBackground />

      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <NavBar />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        {/* Hero Section - 极简但有冲击力 */}
        <motion.section
          className="min-h-screen flex flex-col justify-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
        >
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeInOutQuint }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm"
            >
              <IoSparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{t('home.hero.badge')}</span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-light leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: easeInOutQuint }}
            >
              <div className="text-foreground mb-4">
                {t('home.hero.mainTitle')}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-light tracking-wide">
                <TypewriterEffect />
              </div>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: easeInOutQuint }}
              dangerouslySetInnerHTML={{ __html: t('home.hero.description') }}
            />

            {/* 核心价值主张 - 三个关键点 */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: easeInOutQuint }}
            >
              <div className="flex items-center gap-3 text-foreground">
                <IoCheckmarkCircle className="w-5 h-5 text-green-500" />
                <span>{t('home.hero.features.noCoding')}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <IoTime className="w-5 h-5 text-blue-500" />
                <span>{t('home.hero.features.realTime')}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <IoInfinite className="w-5 h-5 text-purple-500" />
                <span>{t('home.hero.features.freeStart')}</span>
              </div>
            </motion.div>

            {/* CTA按钮 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: easeInOutQuint }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-xl transition-colors cursor-pointer"
                onClick={() => router.push('/builder')}
              >
                <IoSparkles className="w-5 h-5 mr-2" />
                {t('home.hero.startCreating')}
                <IoArrowForward className="w-5 h-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl transition-colors cursor-pointer"
                onClick={() => router.push('/templates')}
              >
                <IoDocumentText className="w-5 h-5 mr-2" />
                {t('home.hero.exploreTemplates')}
              </Button>
            </motion.div>

            {/* 快速统计 - 突出效果 */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: easeInOutQuint }}
            >
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-1">15+</div>
                <div className="text-sm text-muted-foreground">{t('home.stats.blockTypes.label')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">{t('home.stats.templates.label')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-1">{'< 2s'}</div>
                <div className="text-sm text-muted-foreground">{t('home.stats.responseTime.label')}</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 功能展示 - 极简卡片 */}
        <motion.section
          className="py-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-4">{t('home.features.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: IoGrid,
                  title: t('home.features.visualBlockSystem.title'),
                  description: t('home.features.visualBlockSystem.description'),
                },
                {
                  icon: IoFlash,
                  title: t('home.features.realTimePreview.title'),
                  description: t('home.features.realTimePreview.description'),
                },
                {
                  icon: IoRocket,
                  title: t('home.features.exportIntegration.title'),
                  description: t('home.features.exportIntegration.description'),
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: easeInOutQuint }}
                  viewport={{ once: true }}
                >
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 使用场景 - 简洁展示 */}
        <motion.section
          className="py-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-4">{t('home.useCases.title')}</h2>
            <p className="text-xl text-muted-foreground mb-16">
              {t('home.useCases.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: IoCodeSlash, title: t('home.useCases.developers.title') },
                { icon: IoDocumentText, title: t('home.useCases.contentCreators.title') },
                { icon: IoSparkles, title: t('home.useCases.educators.title') },
                { icon: IoRocket, title: t('home.useCases.startups.title') },
                { icon: IoTrendingUp, title: t('home.useCases.analysts.title') },
                { icon: IoCube, title: t('home.useCases.researchers.title') },
              ].map((useCase, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/30 bg-background/30 hover:bg-background/60 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease: easeInOutQuint }}
                  viewport={{ once: true }}
                >
                  <useCase.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{useCase.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 最终CTA - 强有力的结尾 */}
        <motion.section
          className="py-24 text-center"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-light" dangerouslySetInnerHTML={{ __html: t('home.cta.title') }} />

            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-xl rounded-xl transition-colors cursor-pointer"
              onClick={() => router.push('/builder')}
            >
              {t('home.cta.startButton')}
              <IoArrowForward className="w-6 h-6 ml-3" />
            </Button>

            <p className="text-muted-foreground">
              {t('home.cta.subtitle')}
            </p>
          </div>
        </motion.section>

        {/* 简洁的页脚 */}
        <motion.footer
          className="py-12 border-t border-border/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">{t('home.footer.privacy')}</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{t('home.footer.terms')}</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{t('home.footer.documentation')}</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">{t('home.footer.support')}</span>
          </div>
          <div className="text-center mt-4 text-muted-foreground text-sm">
            {t('home.footer.copyright')}
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
