'use client'

import { InteractivePlayground } from '@/components/interactive-playground'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoArrowForward, IoSparkles } from 'react-icons/io5'

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
        {/* Hero Section - 极简版 */}
        <motion.section
          className="min-h-screen flex flex-col justify-center py-20 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
        >
          {/* 交叉网格线条背景 */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            {/* 水平虚线 */}
            <div
              className="absolute top-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />

            <div
              className="absolute top-[80%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />
            {/* 垂直虚线 */}
            <div
              className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />

            <div
              className="absolute right-[15%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />
          </motion.div>

          <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-light leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: easeInOutQuint }}
            >
              <div className="text-foreground mb-6">
                {t('home.hero.mainTitle')}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-light tracking-wide relative">
                {/* 装饰方括号 - 参考 VoidZero */}
                <span className="text-border/60 mr-2">[</span>
                <TypewriterEffect />
                <span className="text-border/60 ml-2">]</span>

                {/* 装饰线条 - 参考 Kree8 */}
                <div className="absolute -inset-4 border border-primary/20 rounded-lg pointer-events-none" />
              </div>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: easeInOutQuint }}
              dangerouslySetInnerHTML={{ __html: t('home.hero.description') }}
            />

            {/* 单一明确的CTA */}
            <motion.div
              className="pt-8 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: easeInOutQuint }}
            >
              {/* 装饰线条 - 参考网站设计 */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* 侧边装饰 */}
              <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 w-4 h-[1px] bg-primary/40" />
              <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-4 h-[1px] bg-primary/40" />

              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-xl rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 active:scale-95"
                onClick={() => router.push('/builder')}
              >
                {/* 动态光泽扫过效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                {/* 按钮内部装饰线条 */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* 脉动边框效果 */}
                <div className="absolute inset-0 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />

                <IoSparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{t('home.hero.startCreating')}</span>
                <IoArrowForward className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Interactive Playground - 核心体验 */}
        <motion.section
          className="py-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                className="text-4xl sm:text-5xl font-light mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: easeInOutQuint }}
                viewport={{ once: true }}
              >
                {t('home.playground.title')}
              </motion.h2>

              <motion.p
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: easeInOutQuint }}
                viewport={{ once: true }}
              >
                {t('home.playground.subtitle')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: easeInOutQuint }}
              viewport={{ once: true }}
            >
              <InteractivePlayground />
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section - 核心价值 */}
        <motion.section
          className="py-24 border-t border-border/30"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeInOutQuint }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-light mb-4">
                {t('home.features.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: easeInOutQuint }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="6" height="6" rx="1" />
                    <rect x="15" y="3" width="6" height="6" rx="1" />
                    <rect x="9" y="15" width="6" height="6" rx="1" />
                    <path d="M6 9v6M18 9v6M12 3v6M12 15v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">{t('home.features.visualBlockSystem.title')}</h3>
                <p className="text-muted-foreground">{t('home.features.visualBlockSystem.description')}</p>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: easeInOutQuint }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <IoArrowForward className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">{t('home.features.realTimePreview.title')}</h3>
                <p className="text-muted-foreground">{t('home.features.realTimePreview.description')}</p>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: easeInOutQuint }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M8 8h8M8 12h6M8 16h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium">{t('home.features.smartTemplates.title')}</h3>
                <p className="text-muted-foreground">{t('home.features.smartTemplates.description')}</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section - 最终转化 */}
        <motion.section
          className="py-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeInOutQuint }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl font-light mb-4"
                dangerouslySetInnerHTML={{ __html: t('home.cta.title') }}
              />
              <p className="text-lg text-muted-foreground mb-8">
                {t('home.cta.subtitle')}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: easeInOutQuint }}
              viewport={{ once: true }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-xl rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 active:scale-95"
                onClick={() => router.push('/builder')}
              >
                {/* 动态光泽扫过效果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                {/* 按钮内部装饰线条 */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* 脉动边框效果 */}
                <div className="absolute inset-0 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />

                <IoSparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{t('home.cta.startButton')}</span>
                <IoArrowForward className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-12 py-6 text-xl rounded-xl transition-colors cursor-pointer"
                onClick={() => router.push('/templates')}
              >
                {t('nav.templates')}
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* 简洁页脚 */}
        <motion.footer
          className="py-16 text-center border-t border-border/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="text-muted-foreground text-sm">
            {t('home.footer.copyright')}
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
