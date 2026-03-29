import { memo } from 'react'
import { cn } from '../../lib'

interface DottedNumberProps {
  num: string | number
  className?: string
}

export const DottedNumber = memo(({ num, className }: DottedNumberProps) => (
  <div
    className={cn(
      "font-serif font-black leading-none tracking-tighter text-[40px] sm:text-[50px] lg:text-[60px] mb-1",
      className
    )}
    style={{
      color: 'transparent',
      backgroundImage: 'radial-gradient(circle, #0a1128 2.8px, transparent 3.2px)',
      backgroundSize: '8px 8px',
      backgroundPosition: 'center center',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
    }}
  >
    {num}
  </div>
))

DottedNumber.displayName = 'DottedNumber'
