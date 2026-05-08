'use client'

import React, { useEffect, useRef, useState } from 'react'
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
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
  Save,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react'
import { cn } from '@aicaller/ui/lib/utils'
import { useUser } from '@/providers/user-provider'
import {
  useCreatePlainTextKBDocument,
  useDeleteKBDocument,
  useUpdatePlainTextKBDocument,
  useKBDocuments,
  useUploadKBFileDocument,
} from '@/hooks/use-kb-documents'
import type { getKBDocuments } from '@aicaller/supabase/queries'

type KBDocument = NonNullable<Awaited<ReturnType<typeof getKBDocuments>>>[number]

interface KBDocumentsTabProps {
  kbId: string
  initialDocuments: KBDocument[]
}

export default function KBDocumentsTab({ kbId, initialDocuments }: KBDocumentsTabProps) {
  const { workspace } = useUser()
  const { data: documents = initialDocuments } = useKBDocuments(kbId, initialDocuments)
  
  // UI States
  const [plainTextModalOpen, setPlainTextModalOpen] = useState(false)
  const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false)
  
  // Form States
  const [plainTextTitle, setPlainTextTitle] = useState('')
  const [plainTextContent, setPlainTextContent] = useState('')
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { mutate: createPlainTextDoc, isPending: creatingDoc } = useCreatePlainTextKBDocument()
  const { mutate: uploadFileDoc, isPending: uploadingDoc } = useUploadKBFileDocument()
  const { mutate: deleteDoc, isPending: deletingDoc } = useDeleteKBDocument()
  const { mutate: updatePlainTextDoc, isPending: updatingPlainTextDoc } = useUpdatePlainTextKBDocument()
  const [deleteTarget, setDeleteTarget] = useState<KBDocument | null>(null)
  const [previewTarget, setPreviewTarget] = useState<KBDocument | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    if (!previewTarget) return
    if (previewTarget.type === 'plain_text') {
      setEditTitle(previewTarget.name)
      setEditContent(previewTarget.content ?? '')
    } else {
      setEditTitle('')
      setEditContent('')
    }
  }, [previewTarget])

  const plainTextDocs = documents.filter((d) => d.type === 'plain_text')
  const fileDocs = documents.filter((d) => d.type !== 'plain_text')

  const formatDocType = (type: string) => {
    if (type === 'plain_text') return 'Plain Text'
    if (type === 'docx') return 'DOCX'
    if (type === 'pdf') return 'PDF'
    if (type === 'txt') return 'TXT'
    return String(type).replace('_', ' ')
  }

  return (
    <div className="space-y-12">
      
      <section className="space-y-8">
          <div className="flex flex-col gap-1">
             <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Knowledge Inventory</h3>
             <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
               Manage your textual context and uploaded documentation.
             </p>
          </div>

          <Tabs defaultValue="plain-text" className="w-full">
             <TabsList className="h-12 bg-muted/20 border border-border/40 rounded-xl p-1 gap-1">
                <TabsTrigger value="plain-text" className="h-full rounded-lg px-6 font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Plain Text ({plainTextDocs.length})
                </TabsTrigger>
                <TabsTrigger value="file-upload" className="h-full rounded-lg px-6 font-bold text-[11px] uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                  <Upload className="h-3.5 w-3.5" />
                  Files ({fileDocs.length})
                </TabsTrigger>
             </TabsList>

             {/* PLAIN TEXT SUB-TAB */}
             <TabsContent value="plain-text" className="mt-10 space-y-8">
                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[13px] font-bold text-foreground tracking-tight">Add Plain Text</h4>
                    <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                      Create a document ready for agent context
                    </p>
                  </div>
                  <Button
                    onClick={() => setPlainTextModalOpen(true)}
                    variant="outline"
                    className={cn(
                      'h-10 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 shadow-sm transition-all active:scale-95',
                      'border-primary/20 text-primary hover:bg-primary/5'
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Plain Text
                  </Button>
                </div>

                <Dialog
                  open={plainTextModalOpen}
                  onOpenChange={(open) => {
                    setPlainTextModalOpen(open)
                    if (!open) {
                      setPlainTextTitle('')
                      setPlainTextContent('')
                    }
                  }}
                >
                  <DialogContent className="max-w-2xl bg-card border-border/50 rounded-xl p-0 overflow-hidden shadow-sm">
                    <DialogHeader className="p-8 pb-4 border-b border-border/10 bg-muted/5">
                      <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">New Plain Text Document</DialogTitle>
                      <DialogDescription className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
                        Stored with status `ready` so it can be used immediately.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                          Document Title
                        </Label>
                        <Input
                          placeholder="e.g. Refund Policy Update"
                          value={plainTextTitle}
                          onChange={(e) => setPlainTextTitle(e.target.value)}
                          className="h-12 bg-background border-border/50 rounded-xl px-5 font-bold text-[14px]"
                          autoFocus
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Content</Label>
                          <span
                            className={cn(
                              'text-[10px] font-bold uppercase tracking-widest tabular-nums',
                              plainTextContent.length > 60000
                                ? 'text-destructive'
                                : 'text-muted-foreground/30'
                            )}
                          >
                            {plainTextContent.length.toLocaleString()} / 60,000
                          </span>
                        </div>
                        <Textarea
                          placeholder="Paste or type your documentation here..."
                          value={plainTextContent}
                          onChange={(e) => setPlainTextContent(e.target.value)}
                          className="min-h-[300px] bg-background border-border/50 rounded-xl p-6 text-[14px] leading-relaxed resize-none font-medium"
                        />
                      </div>

                      <DialogFooter className="pt-2">
                        <Button
                          variant="ghost"
                          onClick={() => setPlainTextModalOpen(false)}
                          className="h-12 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest text-muted-foreground"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={
                            creatingDoc ||
                            !plainTextTitle.trim() ||
                            !plainTextContent.trim() ||
                            plainTextContent.length > 60000
                          }
                          onClick={() => {
                            const title = plainTextTitle.trim()
                            const content = plainTextContent.slice(0, 60000)
                            if (!title || !content.trim()) return

                            createPlainTextDoc(
                              { kbId: kbId, name: title, content },
                              {
                                onSuccess: () => {
                                  setPlainTextTitle('')
                                  setPlainTextContent('')
                                  setPlainTextModalOpen(false)
                                },
                              }
                            )
                          }}
                          className="h-12 px-10 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-3 shadow-sm shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                          Save Plain Text
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="rounded-xl border border-border/40 overflow-hidden bg-muted/5">
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
                          <th className="text-right py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border/20">
                        {plainTextDocs.map((doc) => (
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
                                {doc.status === 'ready' && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                )}
                                {doc.status === 'processing' && (
                                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                                )}
                                {doc.status === 'error' && (
                                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                                )}
                                <span
                                  className={cn(
                                    'text-[10px] font-bold uppercase tracking-widest',
                                    doc.status === 'ready' && 'text-emerald-500/60',
                                    doc.status === 'processing' && 'text-amber-500/60',
                                    doc.status === 'error' && 'text-destructive/60'
                                  )}
                                >
                                  {doc.status}
                                </span>
                              </div>
                            </td>

                            <td className="py-5 px-8 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-muted/20 text-muted-foreground/60 hover:text-foreground transition-all"
                                  onClick={() => setPreviewTarget(doc)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/40 hover:text-destructive transition-all"
                                  disabled={deletingDoc}
                                  onClick={() => setDeleteTarget(doc)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {plainTextDocs.length === 0 && (
                          <tr>
                            <td colSpan={4} className="h-[220px] text-center">
                              <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-3">
                                <FileText className="h-8 w-8" />
                                <p className="text-[11px] font-bold uppercase tracking-widest">
                                  No documents yet
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
             </TabsContent>

             {/* FILES SUB-TAB */}
             <TabsContent value="file-upload" className="mt-10 space-y-8">
                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[13px] font-bold text-foreground tracking-tight">Upload File</h4>
                    <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                      Files are stored now; extraction in v2.
                    </p>
                  </div>
                  <Button
                    onClick={() => setFileUploadModalOpen(true)}
                    variant="outline"
                    className={cn(
                      'h-10 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-2 shadow-sm transition-all active:scale-95',
                      'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5'
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Upload Source
                  </Button>
                </div>

                <Dialog
                  open={fileUploadModalOpen}
                  onOpenChange={(open) => {
                    setFileUploadModalOpen(open)
                    if (!open) {
                      setSelectedFile(null)
                      setUploadError(null)
                      setUploadFileName(null)
                    }
                  }}
                >
                  <DialogContent className="max-w-2xl bg-card border-border/50 rounded-xl p-0 overflow-hidden shadow-sm">
                    <DialogHeader className="p-8 pb-4 border-b border-border/10 bg-muted/5">
                      <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">Upload Knowledge Source</DialogTitle>
                      <DialogDescription className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
                        Upload now, text extraction will arrive in v2.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-6">
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 flex items-start gap-4">
                        <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[13px] font-bold text-amber-500 uppercase tracking-tight">Upload Notice</h4>
                          <p className="text-[11.5px] font-medium text-amber-500/60 leading-relaxed">
                            File uploaded. Text extraction coming in v2. Add content as plain text for now.
                          </p>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null
                          setSelectedFile(file)
                          setUploadError(null)
                        }}
                      />

                      <div
                        className="h-64 rounded-xl border-2 border-dashed border-border/60 bg-muted/5 flex flex-col items-center justify-center group hover:border-primary/40 hover:bg-muted/10 transition-all cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
                        }}
                      >
                        <div className="h-14 w-14 rounded-lg bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all shadow-sm">
                          <Upload className="h-6 w-6" />
                        </div>
                        <p className="mt-6 text-[13px] font-bold text-foreground">
                          {selectedFile ? 'Selected for upload' : 'Click to upload files'}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                          PDF, DOCX, or TXT
                        </p>
                        {selectedFile ? (
                          <p className="mt-3 text-[12px] font-bold text-foreground/80 break-all max-w-[280px] text-center px-4">
                            {selectedFile.name}
                          </p>
                        ) : null}
                      </div>

                      {uploadError ? (
                        <p className="text-[11px] font-medium text-destructive/70 px-4">{uploadError}</p>
                      ) : null}

                      <DialogFooter className="pt-2">
                        <Button
                          variant="ghost"
                          onClick={() => setFileUploadModalOpen(false)}
                          className="h-12 px-6 rounded-xl font-bold text-[11px] uppercase tracking-widest text-muted-foreground"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!workspace || !selectedFile || uploadingDoc}
                          onClick={() => {
                            if (!workspace || !selectedFile) return
                            setUploadError(null)

                            uploadFileDoc(
                              {
                                workspaceId: workspace.id,
                                kbId: kbId,
                                name: selectedFile.name,
                                file: selectedFile,
                              },
                              {
                                onSuccess: () => {
                                  setUploadFileName(selectedFile.name)
                                  setSelectedFile(null)
                                  setFileUploadModalOpen(false)
                                },
                                onError: (err) => {
                                  setUploadError(err instanceof Error ? err.message : 'Upload failed')
                                },
                              }
                            )
                          }}
                          className="h-12 px-10 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-3 shadow-sm shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <Upload className="h-4 w-4" />
                          Upload to Storage
                        </Button>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="rounded-xl border border-border/40 overflow-hidden bg-muted/5">
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
                          <th className="text-right py-4 px-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {fileDocs.map((doc) => (
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
                                {doc.status === 'ready' && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                )}
                                {doc.status === 'processing' && (
                                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                                )}
                                {doc.status === 'error' && (
                                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                                )}
                                <span
                                  className={cn(
                                    'text-[10px] font-bold uppercase tracking-widest',
                                    doc.status === 'ready' && 'text-emerald-500/60',
                                    doc.status === 'processing' && 'text-amber-500/60',
                                    doc.status === 'error' && 'text-destructive/60'
                                  )}
                                >
                                  {doc.status}
                                </span>
                              </div>
                            </td>

                            <td className="py-5 px-8 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-muted/20 text-muted-foreground/60 hover:text-foreground transition-all"
                                  onClick={() => setPreviewTarget(doc)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/40 hover:text-destructive transition-all"
                                  disabled={deletingDoc}
                                  onClick={() => setDeleteTarget(doc)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {fileDocs.length === 0 && (
                          <tr>
                            <td colSpan={4} className="h-[220px] text-center">
                              <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-3">
                                <FileText className="h-8 w-8" />
                                <p className="text-[11px] font-bold uppercase tracking-widest">
                                  No documents yet
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
             </TabsContent>
          </Tabs>
      </section>

      {/* Delete Document Confirm Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent className="max-w-md bg-card border-border/50 rounded-xl p-0 overflow-hidden shadow-sm">
          <DialogHeader className="p-6 pb-4 border-b border-border/10 bg-muted/5">
            <DialogTitle className="text-[15px] font-bold tracking-tight uppercase">
              Delete document
            </DialogTitle>
            <DialogDescription className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
              This will permanently remove the uploaded data from this knowledge base.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            {deleteTarget ? (
              <>
                <p className="text-[12px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                  Document
                </p>
                <p className="text-[14px] font-bold text-foreground break-all">
                  {deleteTarget.name}
                </p>
              </>
            ) : null}
          </div>
          <DialogFooter className="px-6 pb-6 pt-0 gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="h-10 px-6 rounded-xl text-[11px] font-bold uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deletingDoc || !deleteTarget}
              onClick={() => {
                if (!deleteTarget) return
                deleteDoc(
                  {
                    kbId: kbId,
                    kbDocumentId: deleteTarget.id,
                    filePath: deleteTarget.file_path,
                  },
                  {
                    onSettled: () => setDeleteTarget(null),
                  }
                )
              }}
              className="h-10 px-8 rounded-xl text-[11px] font-bold uppercase tracking-widest"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Document Dialog */}
      <Dialog
        open={!!previewTarget}
        onOpenChange={(open) => {
          if (!open) setPreviewTarget(null)
        }}
      >
        <DialogContent className="max-w-3xl bg-card border-border/50 rounded-xl p-0 overflow-hidden shadow-sm">
          <DialogHeader className="p-6 pb-4 border-b border-border/10 bg-muted/5">
            <DialogTitle className="text-[16px] font-bold tracking-tight uppercase">
              {previewTarget?.name ?? 'Document'}
            </DialogTitle>
            {previewTarget ? (
              <DialogDescription className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest mt-1">
                {formatDocType(String(previewTarget.type))} • {previewTarget.status}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="p-6 space-y-4">
            {previewTarget?.type === 'plain_text' ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Document Title
                  </p>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-12 bg-background border-border/50 rounded-xl px-5 font-bold text-[14px]"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Content
                    </p>
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-widest tabular-nums',
                        editContent.length > 60000 ? 'text-destructive' : 'text-muted-foreground/30'
                      )}
                    >
                      {editContent.length.toLocaleString()} / 60,000
                    </span>
                  </div>

                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[260px] max-h-[520px] bg-background border-border/50 rounded-none p-6 text-[14px] leading-relaxed resize-none font-medium overflow-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPreviewTarget(null)
                    }}
                    className="h-10 px-6 rounded-xl text-[11px] font-bold uppercase tracking-widest"
                    disabled={updatingPlainTextDoc}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      updatingPlainTextDoc ||
                      !editTitle.trim() ||
                      !editContent.trim() ||
                      editContent.length > 60000
                    }
                    onClick={() => {
                      const title = editTitle.trim()
                      const content = editContent.slice(0, 60000)
                      if (!title || !content.trim()) return

                      updatePlainTextDoc(
                        {
                          kbId,
                          kbDocumentId: previewTarget.id,
                          name: title,
                          content,
                        },
                        {
                          onSuccess: () => {
                            // Keep dialog open after save per UX requirement.
                          },
                        }
                      )
                    }}
                    className="h-10 px-8 rounded-xl text-[11px] font-bold uppercase tracking-widest"
                  >
                    {updatingPlainTextDoc ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-[13px] text-muted-foreground">
                <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                  File information
                </p>
                <div className="space-y-1 text-[12px]">
                  <p>
                    <span className="font-semibold text-foreground/80">Type:</span>{' '}
                    {formatDocType(String(previewTarget?.type))}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground/80">Status:</span>{' '}
                    {previewTarget?.status}
                  </p>
                  {previewTarget?.file_path ? (
                    <p className="break-all">
                      <span className="font-semibold text-foreground/80">Path:</span>{' '}
                      {previewTarget.file_path}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-muted-foreground/50 uppercase tracking-widest">
                    File preview & download wiring coming in v2. This entry confirms the file is
                    stored and ready for processing.
                  </p>
                </div>
              </div>
            )}
          </div>

          {previewTarget?.type !== 'plain_text' ? (
            <DialogFooter className="px-6 pb-5 pt-0">
              <Button
                variant="outline"
                className="h-10 px-6 rounded-xl text-[11px] font-bold uppercase tracking-widest"
                onClick={() => setPreviewTarget(null)}
              >
                Close
              </Button>
            </DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
