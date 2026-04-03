'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import { useSidebar } from './sidebar-context'

interface ContextualSidebarToggleButtonProps {
  className?: string
}

/**
 * Collapses/expands the contextual (middle) sidebar.
 * Used by Agents + Knowledge Bases to keep the UX consistent.
 * 
 * Logic:
 * - Desktop: Toggles 'contextualCollapsed' to expand/collapse left sidebar.
 * - Mobile: Toggles 'mobileContextualOpen' to open/close right drawer.
 */
export function ContextualSidebarToggleButton({
  className,
}: ContextualSidebarToggleButtonProps) {
  const { 
    contextualCollapsed, 
    toggleContextual,
    toggleMobileContextual 
  } = useSidebar()

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleMobileContextual()
    } else {
      toggleContextual()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground transition-all active:scale-95',
        className
      )}
      onClick={handleToggle}
      aria-label="Toggle sidebar"
      title="Toggle sidebar"
    >
      <ChevronLeft className={cn(
        "h-4 w-4 transition-transform duration-200",
        contextualCollapsed && "rotate-180 md:rotate-180"
      )} />
    </Button>
  )
}
