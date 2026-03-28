import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-brand-600 text-white shadow-soft hover:bg-brand-700 hover:shadow-md',
        destructive:
          'bg-red-600 text-white shadow-soft hover:bg-red-700 hover:shadow-md',
        outline:
          'border border-gray-200 bg-white text-gray-700 shadow-soft hover:border-gray-300 hover:bg-gray-50',
        secondary:
          'bg-gray-100 text-gray-900 shadow-soft hover:bg-gray-200',
        ghost:
          'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        link:
          'text-brand-600 underline-offset-4 hover:underline',
        'glass':
          'glass border border-white/40 bg-white/40 text-gray-900 shadow-soft backdrop-blur-md hover:bg-white/60',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 rounded-md px-3 text-xs',
        lg:      'h-11 rounded-xl px-6 text-base',
        xl:      'h-12 rounded-xl px-8 text-base',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }