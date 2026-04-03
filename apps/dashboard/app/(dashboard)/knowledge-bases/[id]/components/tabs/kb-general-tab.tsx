'use client'

import React from 'react'
import { Badge } from '@aicaller/ui'
import { Clock, CheckCircle2, FileText, XCircle } from 'lucide-react'
import { useKBDocuments } from '@/hooks/use-kb-documents'
import type { getKBDocuments } from '@aicaller/supabase/queries'

type KBDocument = NonNullable<Awaited<ReturnType<typeof getKBDocuments>>>[number]

interface KBGeneralTabProps {
  kbId: string
  initialDocuments: KBDocument[]
}

export default function KBGeneralTab({ kbId, initialDocuments }: KBGeneralTabProps) {
  const { data: documents = initialDocuments } = useKBDocuments(kbId, initialDocuments)

  const formatDocType = (type: string) => {
    if (type === 'plain_text') return 'Plain Text'
    if (type === 'docx') return 'DOCX'
    if (type === 'pdf') return 'PDF'
    if (type === 'txt') return 'TXT'
    return String(type).replace('_', ' ')
  }

  return (
    <div className="space-y-12">
      <section className="space-y-10">
        <section className="space-y-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-[13px] font-bold text-foreground tracking-tight">Documents</h4>
            <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
              Plain text + uploaded files
            </p>
          </div>

          <div className="rounded-[32px] border border-border/40 overflow-hidden bg-muted/5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/10">
                    <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                      Name
                    </th>
                    <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                      Type
                    </th>
                    <th className="text-left py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                      Status
                    </th>
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
                            <span className="text-[14px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                              {doc.name}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest mt-0.5">
                              Created {doc.created_at}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <Badge
                          variant="outline"
                          className="h-5 bg-background border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40"
                        >
                          {formatDocType(String(doc.type))}
                        </Badge>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-2">
                          {doc.status === 'ready' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                          {doc.status === 'processing' && <Clock className="h-3.5 w-3.5 text-amber-500" />}
                          {doc.status === 'error' && <XCircle className="h-3.5 w-3.5 text-destructive" />}
                          <span
                            className={[
                              'text-[10px] font-bold uppercase tracking-widest',
                              doc.status === 'ready' ? 'text-emerald-500/60' : '',
                              doc.status === 'processing' ? 'text-amber-500/60' : '',
                              doc.status === 'error' ? 'text-destructive/60' : '',
                            ].join(' ')}
                          >
                            {doc.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {documents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="h-[220px] text-center">
                        <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-3">
                          <FileText className="h-8 w-8" />
                          <p className="text-[11px] font-bold uppercase tracking-widest">No documents yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>

    </div>
  )
}
