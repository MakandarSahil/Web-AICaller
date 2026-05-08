import type { ComponentType, ReactNode } from 'react'
import type { LucideProps } from 'lucide-react'

import { Card, CardContent } from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'

type MetricTone = 'default' | 'success' | 'warning' | 'info'

const toneClassNames: Record<MetricTone, string> = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
}

type MetricCardProps = {
  label: string
  value: ReactNode
  icon: ComponentType<LucideProps>
  description?: ReactNode
  trend?: ReactNode
  tone?: MetricTone
  className?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  description,
  trend,
  tone = 'default',
  className,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        'rounded-xl border-border/70 bg-card shadow-sm transition-colors hover:border-primary/25',
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
            <div className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
              {value}
            </div>
          </div>
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', toneClassNames[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {(description || trend) ? (
          <div className="mt-4 flex min-h-5 items-center justify-between gap-3 text-xs">
            <div className="min-w-0 truncate text-muted-foreground">{description}</div>
            {trend ? <div className="shrink-0 font-medium text-foreground">{trend}</div> : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
