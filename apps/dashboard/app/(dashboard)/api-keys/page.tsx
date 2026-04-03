'use client'

import React, { useState } from 'react'
import { 
  Badge, 
  Button, 
  ScrollArea, 
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Alert,
  AlertDescription,
  AlertTitle
} from '@aicaller/ui'
import { 
  Plus, 
  Key, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Info,
  Calendar,
  Activity,
  Zap,
  Lock
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import Link from 'next/link'

// Mock Data for UI development
const mockKeys = [
  { id: '1', name: 'Production Dashboard', key: 'pk_live_************************4a2b', env: 'production', created: '2024-03-12', lastUsed: '2 min ago' },
  { id: '2', name: 'Development Webhook', key: 'pk_test_************************9f8e', env: 'development', created: '2024-03-28', lastUsed: '3 hours ago' },
]

export default function ApiKeysPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string | null>(null)
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const generateKey = () => {
    // Mock key generation
    setNewKey('pk_live_51P2c9JK8vL0m1zPx9sR4tQ5uV6wW7xY8z0a1b2c3d4e5f6g7h8i9j0')
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 bg-background font-sans">
      
      {/* 1. Page Header */}
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-bold tracking-tight text-foreground uppercase">API Keys</h1>
            <div className="h-4 w-[1px] bg-border/40 mx-1" />
            <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">Authentication & Systems</span>
         </div>

         <Dialog onOpenChange={(open) => !open && setNewKey(null)}>
            <DialogTrigger asChild>
               <Button className="h-10 gap-2.5 px-6 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-95 group">
                  <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
                  Generate Key
               </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl bg-card border-border/50 rounded-[32px] p-0 overflow-hidden shadow-2xl">
               <DialogHeader className="p-8 pb-6 border-b border-border/10 bg-muted/5">
                  <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">New API Key</DialogTitle>
                  <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
                    Grant secure access to your agents and knowledge bases from external applications.
                  </p>
               </DialogHeader>

               <div className="p-8">
                  {!newKey ? (
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Key Description</Label>
                          <Input 
                            placeholder="e.g. My Website Bot" 
                            className="h-12 bg-muted/10 border-border/50 rounded-xl px-5 font-bold text-[14px]" 
                          />
                       </div>
                       
                       <div className="space-y-4">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Environment</Label>
                          <div className="grid grid-cols-2 gap-4">
                             <button className="p-5 rounded-2xl border-2 border-primary bg-primary/5 text-left transition-all">
                                <span className="text-[13px] font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                                   <Zap className="h-3.5 w-3.5 text-primary" />
                                   Production
                                </span>
                             </button>
                             <button className="p-5 rounded-2xl border border-border/40 bg-muted/5 text-left opacity-40 hover:opacity-100 transition-all">
                                <span className="text-[13px] font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                                   <Activity className="h-3.5 w-3.5" />
                                   Development
                                </span>
                             </button>
                          </div>
                       </div>

                       <div className="pt-4">
                          <Button 
                            className="w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95"
                            onClick={generateKey}
                          >
                             Generate API Key
                          </Button>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <Alert className="bg-amber-500/5 border-amber-500/20 text-amber-500 rounded-2xl p-5">
                          <ShieldAlert className="h-4 w-4" />
                          <AlertTitle className="text-[12px] font-bold uppercase tracking-widest mb-1 ml-1">Sensitive Credential</AlertTitle>
                          <AlertDescription className="text-[11px] font-medium leading-relaxed opacity-70 ml-1">
                             This key will only be shown once. Secure it immediately. If lost, it cannot be recovered.
                          </AlertDescription>
                       </Alert>

                       <div className="space-y-4">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-px">Your Secret API Key</Label>
                          <div className="h-14 flex items-center justify-between px-6 rounded-2xl bg-muted/20 border border-primary/20 font-mono text-[13px] text-primary shadow-inner">
                             <span className="truncate pr-4">{newKey}</span>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-9 w-9 rounded-xl hover:bg-primary/10 text-primary transition-all shrink-0"
                               onClick={() => handleCopy(newKey, 'new')}
                             >
                                {copiedId === 'new' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                             </Button>
                          </div>
                       </div>

                       <div className="pt-4">
                          <Button 
                            variant="secondary"
                            className="w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest bg-muted border-border/40 hover:bg-muted/80 transition-all"
                            onClick={() => setNewKey(null)}
                          >
                             I have saved this key
                          </Button>
                       </div>
                    </div>
                  )}
               </div>
            </DialogContent>
         </Dialog>
      </header>

      <ScrollArea className="flex-1">
         <div className="max-w-6xl mx-auto px-10 py-12 pb-40 space-y-12">
            
            {/* 2. Strategy Banner (Premium Minimal) */}
            <div className="bg-primary/5 border border-primary/10 rounded-[40px] px-10 py-12 flex flex-col md:flex-row items-center gap-10">
               <div className="h-20 w-20 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/5">
                  <Lock className="h-10 w-10" />
               </div>
               <div className="flex flex-col gap-2">
                  <h2 className="text-[20px] font-bold tracking-tight text-foreground uppercase">Integration Infrastructure</h2>
                  <p className="text-[13px] font-medium text-muted-foreground/50 leading-relaxed max-w-2xl">
                     Use our secure REST API to trigger outbound calls, synchronized knowledge data, and fetch realtime transcripts of your agent conversations in your own systems.
                  </p>
                  <div className="flex items-center gap-6 mt-4">
                     <div className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 leading-none">All Systems Operational</span>
                     </div>
                     <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:underline underline-offset-4 flex items-center gap-2">
                        View API Reference
                        <Activity size={10} />
                     </Link>
                  </div>
               </div>
            </div>

            {/* 3. API Keys Table */}
            <section className="space-y-6">
               <div className="flex flex-col gap-1 px-1">
                  <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Active Credentials</h3>
                  <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                    Manage secure access tokens for your workspace applications.
                  </p>
               </div>

               <div className="rounded-[32px] border border-border/40 overflow-hidden bg-muted/5 shadow-sm">
                  <div className="overflow-x-auto">
                     <table className="w-full border-collapse">
                        <thead>
                           <tr className="border-b border-border/40 bg-muted/10">
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Name</th>
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Masked Key</th>
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Environment</th>
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Last Used</th>
                              <th className="text-right py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                           {mockKeys.map((key) => (
                              <tr key={key.id} className="group hover:bg-muted/20 transition-colors">
                                 <td className="py-6 px-8">
                                    <div className="flex flex-col">
                                       <span className="text-[14px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{key.name}</span>
                                       <span className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest mt-0.5">Created {key.created}</span>
                                    </div>
                                 </td>
                                 <td className="py-6 px-8">
                                    <div className="flex items-center gap-3">
                                       <span className="text-[13px] font-mono text-muted-foreground/40 tracking-widest">{key.key}</span>
                                       <Button 
                                         variant="ghost" 
                                         size="icon" 
                                         className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground transition-all active:scale-95"
                                         onClick={() => handleCopy(key.key, key.id)}
                                       >
                                          {copiedId === key.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                       </Button>
                                    </div>
                                 </td>
                                 <td className="py-6 px-8">
                                    <Badge variant="outline" className={cn(
                                       "h-5 bg-background border-border text-[9px] font-bold uppercase tracking-widest",
                                       key.env === 'production' ? "text-primary border-primary/20" : "text-muted-foreground/40"
                                    )}>
                                       {key.env}
                                    </Badge>
                                 </td>
                                 <td className="py-6 px-8">
                                    <div className="flex items-center gap-2">
                                       <Activity className="h-3 w-3 text-muted-foreground/20" />
                                       <span className="text-[12px] font-medium text-muted-foreground/60">{key.lastUsed}</span>
                                    </div>
                                 </td>
                                 <td className="py-6 px-8 text-right">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/40 hover:text-destructive transition-all active:scale-95">
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </section>

         </div>
      </ScrollArea>

    </div>
  )
}
