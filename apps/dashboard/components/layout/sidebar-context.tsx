'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
  // Navigation visibility
  contextualCollapsed: boolean
  setContextualCollapsed: (collapsed: boolean) => void
  toggleContextual: () => void

  // Dynamic Content (Sub-sidebars like Agent lists)
  contextualSidebar: React.ReactNode | null
  setContextualSidebar: (sidebar: React.ReactNode | null) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [contextualCollapsed, setContextualCollapsed] = useState(false)
  const [contextualSidebar, setContextualSidebar] = useState<React.ReactNode | null>(null)

  const toggleContextual = () => setContextualCollapsed(prev => !prev)

  return (
    <SidebarContext.Provider 
      value={{ 
        contextualCollapsed, 
        setContextualCollapsed, 
        toggleContextual,
        contextualSidebar,
        setContextualSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

/**
 * Helper component to set the contextual sidebar from any child page/layout.
 * Automatically clears when unmounted.
 */
export function ContextualSidebar({ children }: { children: React.ReactNode }) {
  const { setContextualSidebar } = useSidebar()
  
  useEffect(() => {
    setContextualSidebar(children)
    return () => setContextualSidebar(null)
  }, [children, setContextualSidebar])

  return null
}
