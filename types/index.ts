export interface TypingConfig {
  speed: number
  delete: number
  pause: number
  restart: number
}

export interface AnimationVariants {
  hidden: { opacity: number, y?: number }
  visible: { opacity: number, y?: number }
}
