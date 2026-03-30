import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-md dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80',
        destructive:
          'bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:shadow-md dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/80',
        outline:
          'border border-input bg-background text-foreground shadow-soft hover:bg-accent hover:text-accent-foreground dark:border-border dark:bg-background dark:text-foreground dark:hover:bg-muted dark:hover:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/70',
        ghost:
          'text-foreground hover:bg-accent hover:text-accent-foreground dark:text-foreground dark:hover:bg-muted dark:hover:text-foreground',
        link:
          'text-primary underline-offset-4 hover:underline dark:text-primary dark:hover:underline',
        'glass':
          'glass border border-border/50 bg-white/40 text-foreground shadow-soft backdrop-blur-md hover:bg-white/60 dark:border-border/40 dark:bg-white/5 dark:hover:bg-white/10 dark:text-foreground',
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