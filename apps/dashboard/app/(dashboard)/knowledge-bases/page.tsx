'use client'

import React from 'react'
import { Card, CardContent, Button, ScrollArea } from '@aicaller/ui'
import { Plus, BookOpen, Search, Info } from 'lucide-react'
import { DashboardShell } from '@/components/layout/dashboard-shell'

/**
 * Knowledge Bases Page (Professional / Midnight Theme Optimized)
 * 
 * 1. Normalized font weights: font-black/extrabold -> font-bold.
 * 2. Background: #181b25 (Dashboard Area).
 * 3. Cards: #242630.
 */
export default function KnowledgeBasesPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col flex-1 min-w-0 bg-background h-full font-sans transition-colors duration-300">
        
        {/* Page Header */}
        <header className="page-header shrink-0 px-6 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="page-title leading-none text-[15px] font-bold tracking-tight text-foreground">Knowledge Bases</h1>
            <p className="hidden sm:block text-[11px] font-semibold text-muted-foreground opacity-50 uppercase tracking-widest ml-2 border-l border-border/40 pl-4">Management</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button className="h-9 gap-2 px-5 bg-brand-500 hover:bg-brand-600 text-white border-0 text-[12px] font-bold shadow-lg shadow-brand-500/10 transition-all active:scale-95 rounded-xl">
              <Plus size={16} />
              <span>New Knowledge Base</span>
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6 sm:p-10 flex flex-col gap-10 max-w-[1200px] mx-auto">
            
            {/* Context Info */}
            <div className="bg-brand-500/5 border border-brand-500/10 rounded-2xl p-5 flex items-start gap-4">
               <div className="h-9 w-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                  <Info size={18} />
               </div>
               <div className="flex flex-col gap-1">
                  <h3 className="text-[14px] font-bold text-foreground">Understanding Knowledge Bases</h3>
                  <p className="text-[12.5px] text-muted-foreground font-medium opacity-70 leading-relaxed">
                    Knowledge bases allow you to upload PDFs, text files, or URLs that your AI voice agents can reference in real-time. 
                    This enables them to answer specific questions about your business, products, or FAQs.
                  </p>
               </div>
            </div>

            {/* Empty State / Grid */}
            <Card className="stat-card border border-border/40 overflow-hidden shadow-2xl rounded-3xl bg-card">
              <CardContent className="pt-32 pb-32">
                <div className="text-center flex flex-col items-center">
                  <div className="h-20 w-20 rounded-3xl bg-white/2 border border-border/40 flex items-center justify-center mb-8 shadow-3xl text-muted-foreground group hover:scale-105 transition-transform duration-300">
                     <BookOpen size={28} className="opacity-30 group-hover:text-brand-500 group-hover:opacity-100 transition-colors" />
                  </div>
                  <h3 className="text-[18px] font-bold text-foreground tracking-tight">Zero knowledge bases yet</h3>
                  <p className="text-[13px] text-muted-foreground mt-4 max-w-[320px] font-medium leading-relaxed opacity-50">
                    Connect your data sources or upload files to give your agents specialized intelligence.
                  </p>
                  <Button variant="outline" className="mt-10 border-border/40 bg-white/2 hover:bg-white/5 h-11 px-10 font-bold text-[12.5px] uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm">
                     Setup your first KB
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
      </div>
    </DashboardShell>
  )
}
