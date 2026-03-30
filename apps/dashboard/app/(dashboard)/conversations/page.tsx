'use client'

import { Card, CardContent } from '@aicaller/ui'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function ConversationsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col flex-1 min-w-0 bg-background h-full font-sans transition-colors duration-300">
        
        {/* Page Header */}
        <header className="page-header shrink-0 px-6 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="page-title leading-none text-[15px] font-bold tracking-tight text-foreground">Conversations</h1>
            <p className="hidden sm:block text-[11px] font-semibold text-muted-foreground opacity-50 uppercase tracking-widest ml-2 border-l border-border/40 pl-4">Monitor & Manage</p>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              placeholder="Search conversations..."
              className="h-9 px-4 rounded-lg border border-border/40 bg-muted/30 text-foreground placeholder:text-muted-foreground/50 text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Card className="bg-card border border-border/40 shadow-sm rounded-xl">
              <CardContent className="pt-24 pb-24">
                <div className="text-center flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                     <span className="text-muted-foreground/50">💬</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">No conversations yet</h3>
                  <p className="text-xs text-muted-foreground/70 mt-1 max-w-[200px]">Start making calls to see your conversations here.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
