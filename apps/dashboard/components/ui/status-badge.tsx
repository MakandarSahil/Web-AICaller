import { Badge } from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'

type StatusTone = 'default' | 'success' | 'warning' | 'danger' | 'info'

const toneClassNames: Record<StatusTone, string> = {
  default: 'border-border bg-muted/40 text-muted-foreground',
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  danger: 'border-destructive/20 bg-destructive/10 text-destructive',
  info: 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
}

export function StatusBadge({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode
  tone?: StatusTone
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn('rounded-md px-2 py-0.5 text-xs font-medium capitalize', toneClassNames[tone], className)}
    >
      {children}
    </Badge>
  )
}
