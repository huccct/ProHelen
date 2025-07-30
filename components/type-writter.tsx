import { ANIMATION_CONFIG_HOME } from '@/lib/constants'
import { useTypewriter } from '@/lib/hooks/use-typewriter'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function TypewriterEffect() {
  const { t, i18n } = useTranslation()

  const phrases = useMemo(() => [
    t('home.hero.typewriter.visualPromptDesign'),
    t('home.hero.typewriter.aiBehaviorControl'),
    t('home.hero.typewriter.smartInstructions'),
    t('home.hero.typewriter.llmCustomization'),
  ], [t])

  const config = useMemo(() =>
    ANIMATION_CONFIG_HOME.typing[i18n.language === 'zh' ? 'zh' : 'en'], [i18n.language])

  const { displayText, showCursor } = useTypewriter(phrases, config)

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
