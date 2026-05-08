import type { ReactNode } from 'react'

import { cn } from '@aicaller/ui/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  leading?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  leading,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'page-header min-h-[var(--header-height)] gap-4 px-5 sm:px-6 lg:px-8',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground sm:text-base">
              {title}
            </h1>
            {eyebrow ? (
              <span className="hidden rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:inline-flex">
                {eyebrow}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}
