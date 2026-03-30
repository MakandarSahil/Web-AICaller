'use client'

import { Card, CardContent } from '@aicaller/ui'
import { ShieldCheck } from 'lucide-react'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function QualityAssurancePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col flex-1 min-w-0 bg-background h-full font-sans transition-colors duration-300">
        <header className="page-header shrink-0 px-6 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="page-title leading-none text-[15px] font-bold tracking-tight text-foreground">AI Quality Assurance</h1>
            <p className="hidden sm:block text-[11px] font-semibold text-muted-foreground opacity-50 uppercase tracking-widest ml-2 border-l border-border/40 pl-4">Monitor</p>
          </div>
        </header>

        <div className="p-6">
          <Card className="bg-card border border-border/40 shadow-sm rounded-xl">
            <CardContent className="pt-24 pb-24">
              <div className="text-center flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 border border-border/40">
                  <ShieldCheck size={20} className="text-muted-foreground/60" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Quality assurance placeholder</h3>
                <p className="text-xs text-muted-foreground/70 mt-1 max-w-[280px]">Conversation scoring, policy checks, and model quality signals will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
