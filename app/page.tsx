'use client'
import type { AnimationVariants } from '@/types'
import type { Variants } from 'framer-motion'
import { useAppSettings } from '@/components/common/app-settings-context'
import { NavBar } from '@/components/common/nav-bar'
import { ConnectedLinesBackground } from '@/components/connected-lines-background'
import { CornerGrids } from '@/components/corner-grid'
import { EnhancedButton } from '@/components/enhanced-button'
import { FeatureCard } from '@/components/feature-card'
import { InteractivePlayground } from '@/components/interactive-playground'
import { ScrollToTopButton } from '@/components/scroll-to-top-button'
import { TypewriterEffect } from '@/components/type-writter'
import { ANIMATION_CONFIG_HOME } from '@/lib/constants'
import { useScrollToTop } from '@/lib/hooks/use-scroll-to-top'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { IoArrowForward, IoSparkles } from 'react-icons/io5'

export default function Home() {
  const { t } = useTranslation()
  const router = useRouter()
  const { siteName } = useAppSettings()
  const { showScrollTop, scrollToTop } = useScrollToTop()

  const navigateToBuilder = useCallback(() => router.push('/builder'), [router])
  const navigateToTemplates = useCallback(() => router.push('/templates'), [router])

  const sectionVariants: AnimationVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <ConnectedLinesBackground />

      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <NavBar siteName={siteName} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <motion.section
          className="min-h-screen flex flex-col justify-center py-20 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION_CONFIG_HOME.duration.long, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <div
              className="absolute top-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />
            <div
              className="absolute top-[80%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />
            <div
              className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />
            <div
              className="absolute right-[15%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent"
              style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, currentColor 8px, currentColor 16px)' }}
            />
            <CornerGrids />
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto text-center space-y-12 relative z-10"
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-light leading-tight"
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 1, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
            >
              <div className="text-foreground mb-6">
                {t('home.hero.mainTitle')}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-light tracking-wide relative">
                <span className="text-border/60 mr-2">[</span>
                <TypewriterEffect />
                <span className="text-border/60 ml-2">]</span>
                <div className="absolute -inset-4 border border-primary/20 rounded-lg pointer-events-none" />
              </div>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: ANIMATION_CONFIG_HOME.duration.medium, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
              dangerouslySetInnerHTML={{ __html: t('home.hero.description') }}
            />

            <motion.div
              className="pt-8 relative"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: ANIMATION_CONFIG_HOME.duration.medium, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 w-4 h-[1px] bg-primary/40" />
              <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 w-4 h-[1px] bg-primary/40" />

              <EnhancedButton onClick={navigateToBuilder}>
                <IoSparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{t('home.hero.startCreating')}</span>
                <IoArrowForward className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </EnhancedButton>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="py-24"
          variants={sectionVariants as unknown as Variants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: ANIMATION_CONFIG_HOME.duration.long, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={staggerVariants}
            >
              <motion.h2
                className="text-4xl sm:text-5xl font-light mb-6"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                {t('home.playground.title')}
              </motion.h2>
              <motion.p
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                {t('home.playground.subtitle')}
              </motion.p>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 1, delay: 0.3, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
            >
              <InteractivePlayground />
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="py-24 border-t border-border/30"
          variants={sectionVariants as unknown as Variants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: ANIMATION_CONFIG_HOME.duration.long, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: ANIMATION_CONFIG_HOME.duration.medium, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
            >
              <h2 className="text-3xl sm:text-4xl font-light mb-4">
                {t('home.features.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={(
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="6" height="6" rx="1" />
                    <rect x="15" y="3" width="6" height="6" rx="1" />
                    <rect x="9" y="15" width="6" height="6" rx="1" />
                    <path d="M6 9v6M18 9v6M12 3v6M12 15v6" />
                  </svg>
                )}
                title={t('home.features.visualBlockSystem.title')}
                description={t('home.features.visualBlockSystem.description')}
                delay={0.1}
              />
              <FeatureCard
                icon={<IoArrowForward className="w-6 h-6 text-primary" />}
                title={t('home.features.realTimePreview.title')}
                description={t('home.features.realTimePreview.description')}
                delay={0.2}
              />
              <FeatureCard
                icon={(
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M8 8h8M8 12h6M8 16h4" />
                  </svg>
                )}
                title={t('home.features.smartTemplates.title')}
                description={t('home.features.smartTemplates.description')}
                delay={0.3}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-24"
          variants={sectionVariants as unknown as Variants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: ANIMATION_CONFIG_HOME.duration.long, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: ANIMATION_CONFIG_HOME.duration.medium, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
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
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: ANIMATION_CONFIG_HOME.duration.medium, delay: 0.2, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
            >
              <EnhancedButton onClick={navigateToBuilder}>
                <IoSparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{t('home.cta.startButton')}</span>
                <IoArrowForward className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </EnhancedButton>

              <EnhancedButton variant="outline" onClick={navigateToTemplates}>
                {t('nav.templates')}
              </EnhancedButton>
            </motion.div>
          </div>
        </motion.section>

        <motion.footer
          className="py-16 text-center border-t border-border/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: ANIMATION_CONFIG_HOME.duration.medium, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
          viewport={{ once: true }}
        >
          <div className="text-muted-foreground text-sm">
            {t('home.footer.copyright')}
          </div>
        </motion.footer>
      </div>

      <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  )
}
