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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from '@aicaller/ui'
import { 
  Plus, 
  Phone, 
  Globe, 
  Copy, 
  Check, 
  MoreVertical, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import Link from 'next/link'

// Mock Data for UI development
const mockNumbers = [
  { id: '1', number: '+1 (555) 012-3456', type: 'platform', agent: 'Front Desk Assistant', status: true, webhook: 'https://api.callmind.com/voice?agent_id=agt_1' },
  { id: '2', number: '+1 (555) 987-6543', type: 'own', agent: 'HR Support Bot', status: false, webhook: 'https://api.callmind.com/voice?agent_id=agt_2' },
]

export default function PhoneNumbersPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background font-sans">
      
      {/* 1. Page Header */}
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-bold tracking-tight text-foreground uppercase">Phone Numbers</h1>
            <div className="h-4 w-[1px] bg-border/40 mx-1" />
            <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">Global Deployment</span>
         </div>

         <Dialog>
            <DialogTrigger asChild>
               <Button className="h-10 gap-2.5 px-6 font-bold text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/10 active:scale-95 group">
                  <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-300" />
                  Add Number
               </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border/50 rounded-[32px] p-0 overflow-hidden shadow-2xl">
               <DialogHeader className="p-8 pb-4 border-b border-border/10 bg-muted/5">
                  <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">Provision Phone Number</DialogTitle>
                  <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
                    Connect a dedicated line to start making and receiving AI automated voice calls.
                  </p>
               </DialogHeader>

               <div className="p-8">
                  <Tabs defaultValue="request" className="w-full">
                     <TabsList className="h-12 w-full bg-muted/20 border border-border/40 rounded-xl p-1 gap-1 mb-8">
                        <TabsTrigger value="request" className="flex-1 h-full rounded-lg font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                           <Globe className="h-3.5 w-3.5" />
                           Request Platform Number
                        </TabsTrigger>
                        <TabsTrigger value="own" className="flex-1 h-full rounded-lg font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                           <ShieldCheck className="h-3.5 w-3.5" />
                           Bring Your Own
                        </TabsTrigger>
                     </TabsList>

                     <TabsContent value="request" className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-8">
                        <div className="space-y-4">
                           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Preferred Country</Label>
                           <Select defaultValue="us">
                              <SelectTrigger className="h-12 bg-muted/10 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-border/50">
                                 <SelectItem value="us" className="font-bold tracking-tight">United States (+1)</SelectItem>
                                 <SelectItem value="uk" className="font-bold tracking-tight">United Kingdom (+44)</SelectItem>
                                 <SelectItem value="in" className="font-bold tracking-tight">India (+91)</SelectItem>
                                 <SelectItem value="au" className="font-bold tracking-tight">Australia (+61)</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Usage Type</Label>
                           <div className="grid grid-cols-2 gap-4">
                              <button className="flex flex-col gap-2 p-5 rounded-2xl border-2 border-primary bg-primary/5 text-left transition-all">
                                 <span className="text-[13px] font-bold text-foreground">Standard Local</span>
                                 <span className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed">$5.00 / month</span>
                              </button>
                              <button className="flex flex-col gap-2 p-5 rounded-2xl border border-border/40 bg-muted/5 text-left opacity-40 cursor-not-allowed">
                                 <span className="text-[13px] font-bold text-foreground">Toll Free</span>
                                 <span className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed">Coming Soon</span>
                              </button>
                           </div>
                        </div>
                        <div className="pt-4">
                           <Button className="w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95">
                              Submit Request
                           </Button>
                           <p className="text-center mt-4 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                              Platform numbers are typically assigned within 24 hours.
                           </p>
                        </div>
                     </TabsContent>

                     <TabsContent value="own" className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-6">
                        <div className="space-y-4">
                           <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Phone Number (E.164)</Label>
                           <Input placeholder="+15551234567" className="h-12 bg-muted/10 border-border/50 rounded-xl px-5 font-mono text-[14px]" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Assign Agent</Label>
                              <Select>
                                 <SelectTrigger className="h-12 bg-muted/10 border-border/50 rounded-xl px-5 font-bold">
                                    <SelectValue placeholder="Select Agent" />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl border-border/50">
                                    <SelectItem value="agt1" className="font-bold">Front Desk Assistant</SelectItem>
                                    <SelectItem value="agt2" className="font-bold">HR Support Bot</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-4">
                              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Provider SID (Optional)</Label>
                              <Input placeholder="ACxxxxxxxx..." className="h-12 bg-muted/10 border-border/50 rounded-xl px-5 font-mono text-[13px]" />
                           </div>
                        </div>

                        <div className="bg-muted/30 border border-border/40 p-6 rounded-[24px] space-y-3">
                           <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                              <Server className="h-3 w-3 text-primary" />
                              Webhook Configuration
                           </h4>
                           <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
                              Set your provider's voice webhook to the following URL to route calls to CallMind:
                           </p>
                           <div className="h-10 flex items-center justify-between px-4 rounded-lg bg-background border border-border/50 font-mono text-[11px] text-primary/80">
                              <span className="truncate">https://api.callmind.com/voice?agent_id=...</span>
                              <Copy className="h-3 w-3 cursor-pointer hover:text-primary transition-colors shrink-0 ml-4 opacity-40 hover:opacity-100" />
                           </div>
                        </div>

                        <div className="pt-4">
                           <Button className="w-full h-12 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95">
                              Verify & Save
                           </Button>
                        </div>
                     </TabsContent>
                  </Tabs>
               </div>
            </DialogContent>
         </Dialog>
      </header>

      <ScrollArea className="flex-1">
         <div className="max-w-6xl mx-auto px-10 py-12 pb-40 space-y-12">
            
            {/* 2. Top Stats Overlay (Minimal) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[
                  { label: 'Active Numbers', value: '2', icon: Phone, color: 'text-primary' },
                  { label: 'Platform Owned', value: '1', icon: Globe, color: 'text-emerald-500' },
                  { label: 'BYO Numbers', value: '1', icon: ShieldCheck, color: 'text-amber-500' },
                  { label: 'Total Requests', value: '0', icon: Plus, color: 'text-muted-foreground' },
               ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-[28px] border border-border/40 bg-muted/5 flex flex-col gap-3 transition-all hover:bg-muted/10 group">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{stat.label}</span>
                        <stat.icon className={cn("h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
                     </div>
                     <span className="text-[20px] font-bold tracking-tight text-foreground">{stat.value}</span>
                  </div>
               ))}
            </div>

            {/* 3. Numbers Table */}
            <section className="space-y-6">
               <div className="flex flex-col gap-1">
                  <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Assigned Infrastructure</h3>
                  <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                    Manage active lines and routing configurations for your agents.
                  </p>
               </div>

               <div className="rounded-[32px] border border-border/40 overflow-hidden bg-muted/5">
                  <div className="overflow-x-auto">
                     <table className="w-full border-collapse">
                        <thead>
                           <tr className="border-b border-border/40 bg-muted/10">
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Phone Number</th>
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Type</th>
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Assigned Agent</th>
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Webhook URL</th>
                              <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Status</th>
                              <th className="text-right py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                           {mockNumbers.map((line) => (
                              <tr key={line.id} className="group hover:bg-muted/20 transition-colors">
                                 <td className="py-6 px-8">
                                    <span className="text-[14px] font-mono font-bold text-foreground tracking-tight">{line.number}</span>
                                 </td>
                                 <td className="py-6 px-8">
                                    <Badge variant="outline" className={cn(
                                       "h-5 bg-background border-border text-[9px] font-bold uppercase tracking-widest",
                                       line.type === 'platform' ? "text-emerald-500" : "text-amber-500"
                                    )}>
                                       {line.type === 'platform' ? 'Platform' : 'BYO'}
                                    </Badge>
                                 </td>
                                 <td className="py-6 px-8">
                                    <div className="flex items-center gap-2.5">
                                       <div className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 shrink-0">
                                          <Server className="h-3.5 w-3.5" />
                                       </div>
                                       <span className="text-[13px] font-bold text-foreground/80 group-hover:text-primary transition-colors">{line.agent}</span>
                                    </div>
                                 </td>
                                 <td className="py-6 px-8">
                                    <button 
                                      onClick={() => handleCopy(line.webhook, line.id)}
                                      className="flex items-center gap-2 group/copy px-3 py-1.5 rounded-lg bg-background border border-border/40 hover:border-primary/20 transition-all overflow-hidden max-w-[120px]"
                                    >
                                       <span className="text-[10px] font-mono text-muted-foreground/30 truncate">{line.webhook}</span>
                                       {copiedId === line.id ? <Check className="h-3 w-3 text-emerald-500 shrink-0" /> : <Copy className="h-3 w-3 text-muted-foreground/20 group-hover/copy:text-primary shrink-0 transition-colors" />}
                                    </button>
                                 </td>
                                 <td className="py-6 px-8">
                                    <Switch checked={line.status} className="data-[state=checked]:bg-emerald-500 scale-90" />
                                 </td>
                                 <td className="py-6 px-8 text-right">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground transition-all active:scale-95">
                                       <MoreVertical className="h-4 w-4" />
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
