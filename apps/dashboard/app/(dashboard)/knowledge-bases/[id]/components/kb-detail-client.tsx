'use client'

import React, { useState } from 'react'
import { 
  Badge,
  Button
} from '@aicaller/ui'
import { 
  Brain,
  FileText,
  Copy,
  Code,
  MoreVertical,
  Plus,
  Users
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { ContextualSidebarToggleButton } from '@/components/layout/contextual-sidebar-toggle-button'
import type { getKBDocuments, getKnowledgeBase } from '@aicaller/supabase/queries'

// New Tabs
import KBGeneralTab from './tabs/kb-general-tab'
import KBDocumentsTab from './tabs/kb-documents-tab'
import KBAgentsTab from './tabs/kb-agents-tab'

type KnowledgeBaseDetail = NonNullable<Awaited<ReturnType<typeof getKnowledgeBase>>>
type KBDocument = NonNullable<Awaited<ReturnType<typeof getKBDocuments>>>[number]

type KnowledgeBaseDetailClientProps = {
  id: string
  initialKb: KnowledgeBaseDetail
  initialDocuments: KBDocument[]
}

export default function KnowledgeBaseDetailClient({ id, initialKb, initialDocuments }: KnowledgeBaseDetailClientProps) {
  const [activeTab, setActiveTab] = useState<string>('general')

  const tabs = [
    { id: 'general', label: 'General', icon: Brain },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'agents', label: 'Agents', icon: Users },
  ]

  const handleCopyId = () => {
    navigator.clipboard.writeText(id)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background font-sans">
      
      {/* 1. Detail Header (Two-Row High Fidelity) */}
      <header className="px-6 md:px-10 border-b border-border bg-background sticky top-0 z-50 transition-colors">
        
        {/* Top Row: Info & Actions */}
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 min-w-0">
            <ContextualSidebarToggleButton className="mr-1 shrink-0" />
            
            <div className="flex flex-col min-w-0">
               <div className="flex items-center gap-2">
                  <h1 className="text-[18px] md:text-[20px] font-bold text-foreground tracking-tight truncate leading-none">
                    {initialKb.name}
                  </h1>
                  <Badge variant="outline" className="h-5 px-2 text-[9px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/20">Knowledge Base</Badge>
               </div>
               <div className="flex items-center gap-1.5 mt-0.5 group cursor-pointer" onClick={handleCopyId}>
                  <span className="text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-primary">
                    {id}
                  </span>
                  <Copy className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary transition-opacity opacity-40 group-hover:opacity-100" />
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground transition-all active:scale-95">
                <Code className="h-4 w-4" />
             </Button>
             
             <div className="h-6 w-[1px] bg-border/50 mx-1" />

             <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl font-bold text-[12px] gap-2 border-border/60 hover:bg-muted transition-all active:scale-95 group">
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground">Add Source</span>
             </Button>

             <div className="h-6 w-[1px] bg-border/50 mx-1" />

             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground transition-all active:scale-95">
                <MoreVertical className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {/* Bottom Row: Tab Navigation */}
        <div className="flex items-center gap-2 h-12">
            <nav className="flex items-center h-full px-1">
              {tabs.map((tab) => {
                  const isActive = activeTab === tab.id
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative h-12 px-5 flex items-center gap-2.5 transition-all group border-b-2 border-transparent",
                        isActive 
                          ? "text-foreground font-bold border-primary" 
                          : "text-muted-foreground/60 hover:text-foreground font-medium"
                      )}
                    >
                      <Icon className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-opacity",
                        isActive ? "opacity-100 text-primary" : "opacity-40 group-hover:opacity-100"
                      )} />
                      <span className="text-[12px] tracking-tight">{tab.label}</span>
                    </button>
                  )
              })}
            </nav>
        </div>
      </header>

      {/* 2. Detail Content Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Configuration Scroll Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
            <div className="max-w-5xl mx-auto px-10 py-12 pb-40">
              
              {/* Tab Content Rendering */}
              {activeTab === 'general' && (
                <KBGeneralTab kbId={id} initialDocuments={initialDocuments} />
              )}
              {activeTab === 'documents' && (
                <KBDocumentsTab kbId={id} initialDocuments={initialDocuments} />
              )}
              {activeTab === 'agents' && (
                <KBAgentsTab knowledgeBase={initialKb} />
              )}

           </div>
        </div>
      </div>

    </div>
  )
}
