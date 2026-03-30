import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
  {
    variants: {
      variant: {
        default:     'border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20 dark:text-primary',
        secondary:   'border-border bg-card/50 text-muted-foreground dark:border-border dark:bg-muted/20 dark:text-muted-foreground',
        destructive: 'border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20 dark:text-destructive',
        outline:     'border-border text-muted-foreground dark:border-border dark:text-muted-foreground',
        success:     'border-green-500/20 bg-green-500/10 text-green-700 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400',
        warning:     'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400',
        error:       'border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20 dark:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }