import { ANIMATION_CONFIG_HOME } from '@/lib/constants'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ConnectedLinesBackground() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -30])
  const y3 = useTransform(scrollY, [0, 300], [0, -20])

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: { pathLength: 1 },
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        style={{ y: y1 }}
      >
        <motion.path
          d="M0,400 Q300,200 600,400 T1200,400"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-border/40"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 3, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
        />
        <motion.path
          d="M0,200 Q400,100 800,200 T1200,200"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-border/30"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 4, delay: 0.5, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
          style={{ y: y2 }}
        />
        <motion.path
          d="M0,600 Q350,500 700,600 T1200,600"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-border/20"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 5, delay: 1, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
          style={{ y: y3 }}
        />
      </motion.svg>
    </div>
  )
}
