import { ANIMATION_CONFIG_HOME } from '@/lib/constants'
import { motion } from 'framer-motion'
import { IoArrowUp } from 'react-icons/io5'

interface ScrollToTopButtonProps {
  show: boolean
  onClick: () => void
}

export function ScrollToTopButton({ show, onClick }: ScrollToTopButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="cursor-pointer fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95 z-50"
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: show ? 1 : 0,
        y: show ? 0 : 100,
        pointerEvents: show ? 'auto' : 'none',
      }}
      transition={{ duration: ANIMATION_CONFIG_HOME.duration.short, ease: ANIMATION_CONFIG_HOME.easeInOutQuint }}
      whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
    >
      <IoArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
      <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  )
}
