'use client'

import React, { useState } from 'react'
import { 
  Badge,
  Button,
  Input,
  Textarea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  ScrollArea
} from '@aicaller/ui'
import { 
  FileText, 
  Upload, 
  Trash2, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Bot,
  ExternalLink,
  Save
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import Link from 'next/link'
import { ContextualSidebarToggleButton } from '@/components/layout/contextual-sidebar-toggle-button'

// Mock types/data for UI development
interface KBDocument {
  id: string
  name: string
  type: 'plain_text' | 'file'
  status: 'ready' | 'processing' | 'error'
  created_at: string
}

interface Agent {
  id: string
  name: string
}

export default function KnowledgeBaseDetailClient({ id }: { id: string }) {
  // 1. Local State (Strict UI implementation)
  const [kbName, setKbName] = useState('Company Benefits 2024')
  const [kbDesc, setKbDesc] = useState('Core documentation for HR and employee onboarding.')
  const [isEditingHeader, setIsEditingHeader] = useState(false)
  
  const [documents, setDocuments] = useState<KBDocument[]>([
    { id: '1', name: 'Health Insurance Policy', type: 'plain_text', status: 'ready', created_at: '2024-03-20' },
    { id: '2', name: 'Onboarding_Deck.pdf', type: 'file', status: 'processing', created_at: '2024-03-21' },
    { id: '3', name: 'Vacation_Rules.txt', type: 'file', status: 'error', created_at: '2024-03-22' },
  ])

  const [attachedAgents] = useState<Agent[]>([
    { id: 'agt_1', name: 'Front Desk Assistant' },
    { id: 'agt_2', name: 'HR Support Bot' },
  ])

  const [plainTextTitle, setPlainTextTitle] = useState('')
  const [plainTextContent, setPlainTextContent] = useState('')

  return (
    <div className="flex-1 flex min-w-0 h-full overflow-hidden bg-background">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto scrollbar-none pb-40">
        
        {/* 1. Header (Inline Editable) */}
        <header className="px-10 pt-12 pb-10 space-y-4">
           <div className="flex items-center gap-3 shrink-0">
             <ContextualSidebarToggleButton />
           </div>
           <div className="flex flex-col gap-2 group">
              {isEditingHeader ? (
                 <div className="space-y-4">
                    <Input 
                      value={kbName} 
                      onChange={(e) => setKbName(e.target.value)}
                      onBlur={() => setIsEditingHeader(false)}
                      autoFocus
                      className="text-[24px] font-bold tracking-tight h-14 bg-muted/20 border-primary/20 rounded-2xl px-6 focus:ring-1 focus:ring-primary/10"
                    />
                    <Textarea 
                      value={kbDesc} 
                      onChange={(e) => setKbDesc(e.target.value)}
                      onBlur={() => setIsEditingHeader(false)}
                      className="text-[14px] font-medium text-muted-foreground leading-relaxed bg-muted/10 border-border/40 rounded-2xl p-6 min-h-[100px] resize-none"
                    />
                 </div>
              ) : (
                <div className="cursor-pointer group/header" onClick={() => setIsEditingHeader(true)}>
                   <div className="flex items-center gap-3">
                      <h1 className="text-[24px] md:text-[28px] font-bold text-foreground tracking-tight leading-none group-hover/header:text-primary transition-colors">
                        {kbName}
                      </h1>
                      <Badge variant="outline" className="h-5 px-2 bg-muted/30 border-border/40 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 opacity-0 group-hover/header:opacity-100 transition-opacity">Click to Edit</Badge>
                   </div>
                   <p className="text-[14px] md:text-[15px] font-medium text-muted-foreground/50 mt-3 leading-relaxed max-w-2xl">
                     {kbDesc}
                   </p>
                </div>
              )}
           </div>
        </header>

        {/* 2. Document Management UI */}
        <div className="px-10 space-y-12">
            
            {/* Add Document Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Ingest Knowledge</h3>
                      <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                        Add text directly or upload files to the vector store.
                      </p>
                   </div>
                </div>

                <Tabs defaultValue="plain-text" className="w-full">
                   <TabsList className="h-12 bg-muted/20 border border-border/40 rounded-xl p-1 gap-1">
                      <TabsTrigger value="plain-text" className="h-full rounded-lg px-6 font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                        <FileText className="h-3.5 w-3.5" />
                        Plain Text
                      </TabsTrigger>
                      <TabsTrigger value="file-upload" className="h-full rounded-lg px-6 font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                        <Upload className="h-3.5 w-3.5" />
                        File Upload
                      </TabsTrigger>
                   </TabsList>

                   <TabsContent value="plain-text" className="mt-6">
                      <Card className="p-8 rounded-[32px] bg-muted/5 border-border/40 space-y-6 shadow-none transition-all hover:bg-muted/10">
                         <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-3">
                               <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Document Title</Label>
                               <Input 
                                 placeholder="e.g. Refund Policy Update"
                                 value={plainTextTitle}
                                 onChange={(e) => setPlainTextTitle(e.target.value)}
                                 className="h-12 bg-background border-border/50 rounded-xl px-5 font-bold text-[14px]"
                               />
                            </div>
                            <div className="space-y-3">
                               <div className="flex items-center justify-between px-1">
                                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Content</Label>
                                  <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest tabular-nums",
                                    plainTextContent.length > 55000 ? "text-destructive" : "text-muted-foreground/30"
                                  )}>
                                    {plainTextContent.length.toLocaleString()} / 60,000
                                  </span>
                               </div>
                               <Textarea 
                                 placeholder="Paste or type your documentation here..."
                                 value={plainTextContent}
                                 onChange={(e) => setPlainTextContent(e.target.value)}
                                 className="min-h-[300px] bg-background border-border/50 rounded-2xl p-6 text-[14px] leading-relaxed resize-none font-medium"
                               />
                            </div>
                         </div>
                         <div className="flex justify-end">
                            <Button className="h-12 px-10 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-3 shadow-lg shadow-primary/10 transition-all active:scale-95">
                               <Save className="h-4 w-4" />
                               Save Document
                            </Button>
                         </div>
                      </Card>
                   </TabsContent>

                   <TabsContent value="file-upload" className="mt-6">
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-[28px] p-6 mb-6 flex items-start gap-4">
                         <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <AlertCircle className="h-4 w-4" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[13px] font-bold text-amber-500 uppercase tracking-tight">Phase 1 Notice</h4>
                            <p className="text-[11.5px] font-medium text-amber-500/60 leading-relaxed">
                               File uploaded to secure storage. Automated text extraction for large files is coming in v2. Please add mission-critical content as Plain Text for immediate agent access.
                            </p>
                         </div>
                      </div>
                      
                      <div className="h-64 rounded-[32px] border-2 border-dashed border-border/60 bg-muted/5 flex flex-col items-center justify-center group hover:border-primary/40 hover:bg-muted/10 transition-all cursor-pointer">
                          <div className="h-14 w-14 rounded-[20px] bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all shadow-sm">
                             <Upload className="h-6 w-6" />
                          </div>
                          <p className="mt-6 text-[13px] font-bold text-foreground">Click to upload files</p>
                          <p className="mt-1 text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">PDF, TXT, or CSV (Max 25MB)</p>
                      </div>
                   </TabsContent>
                </Tabs>
            </section>

            {/* Document List Table */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Document Library</h3>
                      <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                        Total {documents.length} sources linked and synchronized.
                      </p>
                   </div>
                </div>

                <div className="rounded-[32px] border border-border/40 overflow-hidden bg-muted/5">
                   <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                         <thead>
                            <tr className="border-b border-border/40 bg-muted/10">
                               <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Name</th>
                               <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Type</th>
                               <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Status</th>
                               <th className="text-right py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-border/20">
                            {documents.map((doc) => (
                               <tr key={doc.id} className="group hover:bg-muted/20 transition-colors">
                                  <td className="py-5 px-8">
                                     <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl border border-border/40 bg-background flex items-center justify-center text-primary/40 group-hover:text-primary transition-all">
                                           <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                           <span className="text-[14px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{doc.name}</span>
                                           <span className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest mt-0.5">Created {doc.created_at}</span>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="py-5 px-8">
                                     <Badge variant="outline" className="h-5 bg-background border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                                        {doc.type.replace('_', ' ')}
                                     </Badge>
                                  </td>
                                  <td className="py-5 px-8">
                                     <div className="flex items-center gap-2">
                                        {doc.status === 'ready' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                                        {doc.status === 'processing' && <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />}
                                        {doc.status === 'error' && <XCircle className="h-3.5 w-3.5 text-destructive" />}
                                        <span className={cn(
                                          "text-[10px] font-bold uppercase tracking-widest",
                                          doc.status === 'ready' && "text-emerald-500/60",
                                          doc.status === 'processing' && "text-amber-500/60",
                                          doc.status === 'error' && "text-destructive/60"
                                        )}>
                                          {doc.status}
                                        </span>
                                     </div>
                                  </td>
                                  <td className="py-5 px-8 text-right">
                                     <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/40 hover:text-destructive transition-all">
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
      </div>

      {/* Right Sidebar (Attached Agents) */}
      <aside className="w-80 border-l border-border bg-muted/5 flex flex-col shrink-0 overflow-y-auto">
         <header className="h-16 px-8 border-b border-border/50 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Attached Agents</span>
            <Badge className="h-5 bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">{attachedAgents.length}</Badge>
         </header>

         <div className="p-8 space-y-6">
            <p className="text-[11px] font-medium text-muted-foreground/30 uppercase tracking-widest leading-relaxed">
               These agents are currently utilizing this knowledge base for real-time inference.
            </p>

            <div className="space-y-3">
               {attachedAgents.map((agent) => (
                  <Link 
                    key={agent.id} 
                    href={`/agents/${agent.id}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border/40 hover:border-primary/20 transition-all group/agent shadow-sm"
                  >
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground transition-all group-hover/agent:text-primary">
                           <Bot className="h-4 w-4" />
                        </div>
                        <span className="text-[13px] font-bold text-foreground/80 group-hover/agent:text-foreground transition-colors truncate max-w-[120px]">{agent.name}</span>
                     </div>
                     <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/20 group-hover/agent:text-primary/40 transition-colors" />
                  </Link>
               ))}
               
               {attachedAgents.length === 0 && (
                  <div className="py-10 text-center border-2 border-dashed border-border/40 rounded-[28px] opacity-20">
                     <span className="text-[10px] font-bold uppercase tracking-widest">Isolated Base</span>
                  </div>
               )}
            </div>

            <div className="pt-8 border-t border-border/50">
               <Button variant="outline" className="w-full h-11 rounded-xl border-border/60 hover:bg-muted font-bold text-[11px] uppercase tracking-widest gap-2 bg-background transition-all active:scale-95" asChild>
                  <Link href="/agents">
                     <Plus className="h-3.5 w-3.5" />
                     Connect to Agent
                  </Link>
               </Button>
            </div>
         </div>
      </aside>

    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>
}
