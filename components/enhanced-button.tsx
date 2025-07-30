import { Button } from './ui/button'

interface EnhancedButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'outline'
  className?: string
}

export function EnhancedButton({ children, onClick, variant = 'primary', className = '' }: EnhancedButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <Button
      size="lg"
      variant={isPrimary ? 'default' : 'outline'}
      className={`px-12 py-6 text-xl rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group hover:scale-105 active:scale-95 ${
        isPrimary ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/25' : ''
      } ${className}`}
      onClick={onClick}
    >
      {isPrimary && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-0 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
        </>
      )}
      {children}
    </Button>
  )
}
