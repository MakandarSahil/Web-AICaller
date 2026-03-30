import * as React from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground shadow-sm',
          'placeholder:text-muted-foreground resize-none',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-border dark:bg-card/30 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-primary',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }