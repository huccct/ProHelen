import type { AnimationVariants } from '@/types'
import type { Variants } from 'framer-motion'
import { ANIMATION_CONFIG_HOME } from '@/lib/constants'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

export function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  const cardVariants: AnimationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={ref}
      className="text-center space-y-4"
      variants={cardVariants as unknown as Variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: ANIMATION_CONFIG_HOME.duration.medium, delay, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}
