'use client'

import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@aicaller/ui'
import { Plus, ShieldCheck, Database, Server } from 'lucide-react'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function AdminPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col flex-1 min-w-0 bg-background h-full font-sans transition-colors duration-300">
        
        {/* Page Header */}
        <header className="page-header shrink-0 px-6 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="page-title leading-none text-[15px] font-bold tracking-tight text-foreground">Admin Panel</h1>
            <p className="hidden sm:block text-[11px] font-semibold text-muted-foreground opacity-50 uppercase tracking-widest ml-2 border-l border-border/40 pl-4">System Management</p>
          </div>
          <div className="flex items-center gap-2">
             <ShieldCheck className="text-brand-500 h-5 w-5" />
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            {/* Number Pool Card */}
            <Card className="bg-card border border-border/40 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/20 bg-muted/30 px-8 py-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Database size={16} />
                   </div>
                   <CardTitle className="text-foreground text-[15px] font-bold">Number Pool</CardTitle>
                </div>
                <Button size="sm" variant="outline" className="border-border/40 text-muted-foreground font-bold h-8 rounded-lg text-[11px] uppercase tracking-wider hover:bg-muted/40 transition-colors">
                   Export Inventory
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/20 border-b border-border/40">
                      <tr>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-muted-foreground/70 tracking-widest">Phone Number</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-muted-foreground/70 tracking-widest">Provider</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-muted-foreground/70 tracking-widest">Status</th>
                        <th className="px-8 py-4 text-[10px] uppercase font-bold text-muted-foreground/70 tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                        <td className="px-8 py-5 text-[13px] font-bold text-foreground font-mono tracking-tighter">+91 9876 543210</td>
                        <td className="px-8 py-5 text-[12px] font-bold text-muted-foreground uppercase tracking-tight italic">Twilio</td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-tighter shadow-sm border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                            Available
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="text-[12px] font-semibold text-brand-500 hover:text-brand-400 uppercase tracking-tighter hover:underline transition-colors">Assign</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Add Number Form Card */}
            <Card className="bg-card border border-border/40 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/20 bg-muted/30 px-8 py-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-brand-500/10 text-brand-500 rounded-lg">
                      <Server size={16} />
                   </div>
                   <CardTitle className="text-foreground text-[15px] font-bold">Add Platform Number</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-foreground/80 uppercase tracking-wider">Phone E.164 Format</label>
                    <Input
                      placeholder="+919876543210"
                      className="bg-muted/30 border-border/40 h-11 px-4 rounded-xl text-foreground placeholder:text-muted-foreground/40 font-medium focus:ring-primary/40 focus:border-primary transition-all dark:bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-foreground/80 uppercase tracking-wider">SIP Provider</label>
                    <select className="w-full rounded-xl border border-border/40 bg-muted/30 h-11 px-4 text-foreground font-bold text-[13px] focus:ring-1 focus:ring-brand-500 appearance-none shadow-sm transition-all dark:bg-muted/20">
                      <option>Twilio Global</option>
                      <option>Retell API</option>
                    </select>
                  </div>
                  <Button className="bg-brand-500 hover:bg-brand-600 text-white font-bold h-11 px-8 rounded-xl shadow-sm shadow-brand-500/10 transition-transform active:scale-95 border-0 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Inventory
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
