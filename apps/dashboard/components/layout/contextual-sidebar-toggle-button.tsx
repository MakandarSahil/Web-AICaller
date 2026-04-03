 'use client'
 
 import React from 'react'
 import { ChevronLeft, ChevronRight } from 'lucide-react'
 import { Button } from '@aicaller/ui'
 import { cn } from '@aicaller/ui/lib/utils'
 import { useSidebar } from './sidebar-context'
 
 interface ContextualSidebarToggleButtonProps {
   className?: string
 }
 
 /**
  * Collapses/expands the contextual (middle) sidebar.
  * Used by Agents + Knowledge Bases to keep the UX consistent.
  */
 export function ContextualSidebarToggleButton({
   className,
 }: ContextualSidebarToggleButtonProps) {
   const { contextualCollapsed, toggleContextual } = useSidebar()
 
   return (
     <Button
       variant="ghost"
       size="icon"
       className={cn(
         'h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground transition-all active:scale-95',
         className
       )}
       onClick={toggleContextual}
       aria-label={contextualCollapsed ? 'Expand contextual sidebar' : 'Collapse contextual sidebar'}
       title={contextualCollapsed ? 'Show sidebar' : 'Hide sidebar'}
     >
       {contextualCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
     </Button>
   )
 }

