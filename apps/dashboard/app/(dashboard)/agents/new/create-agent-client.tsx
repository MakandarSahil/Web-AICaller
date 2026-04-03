'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Plus,
  Sparkles,
  ShieldCheck,
  Cpu,
  Database,
  X,
} from 'lucide-react'
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@aicaller/ui'
import Link from 'next/link'
import { useCreateAgent, useSetAgentKnowledgeBases } from '@/hooks/use-agents'
import { useUser } from '@/providers/user-provider'
import type { getKnowledgeBases } from '@aicaller/supabase/queries'

type KnowledgeBasesList = NonNullable<Awaited<ReturnType<typeof getKnowledgeBases>>>

interface AgentCreateClientProps {
  initialKnowledgeBases: KnowledgeBasesList
}

export default function AgentCreateClient({ initialKnowledgeBases }: AgentCreateClientProps) {
  const router = useRouter()
  const { mutate: createAgent, isPending: creatingAgent } = useCreateAgent()
  const { mutate: setAgentKBs, isPending: settingKb } = useSetAgentKnowledgeBases()
  const { workspace } = useUser()

  const [formData, setFormData] = useState({
    name: '',
    persona: '',
    llm_model: 'llama-3.3-70b-versatile',
    llm_provider: 'groq',
  })

  const availableKBs = initialKnowledgeBases
  const kbById = useMemo(() => new Map(availableKBs.map((kb) => [kb.id, kb])), [availableKBs])

  const [kbToAttach, setKbToAttach] = useState<string>('')
  const [attachedKbIds, setAttachedKbIds] = useState<string[]>([])

  const handleAttachKb = () => {
    if (!kbToAttach) return
    if (attachedKbIds.includes(kbToAttach)) return
    setAttachedKbIds((prev) => [...prev, kbToAttach])
    setKbToAttach('')
  }

  const handleRemoveKb = (kbId: string) => {
    setAttachedKbIds((prev) => prev.filter((id) => id !== kbId))
  }

  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!workspace) return

    createAgent(
      {
        ...formData,
        workspace_id: workspace.id,
      },
      {
        onSuccess: (newAgent) => {
          if (attachedKbIds.length === 0) {
            router.push(`/agents/${newAgent.id}`)
            return
          }

          setAgentKBs(
            { agentId: newAgent.id, kbIds: attachedKbIds },
            {
              onSuccess: () => router.push(`/agents/${newAgent.id}`),
              onError: (err) =>
                setSubmitError(err instanceof Error ? err.message : 'Failed to attach knowledge bases'),
            }
          )
        },
        onError: (err) =>
          setSubmitError(err instanceof Error ? err.message : 'Failed to create agent'),
      }
    )
  }

  const selectableKBs = availableKBs.filter((kb) => !attachedKbIds.includes(kb.id))

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-background">
      <header className="page-header shrink-0 h-24 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-white/5 transition-all text-muted-foreground mr-2"
            asChild
          >
            <Link href="/agents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-bold text-foreground tracking-tight">Create New Assistant</h1>
            <p className="text-[12px] font-medium text-muted-foreground opacity-40 uppercase tracking-widest">
              Initialization Wizard
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-16 px-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-8">
            {/* Identity Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/30">
                  <ShieldCheck className="h-4 w-4 text-brand-500" />
                </div>
                <h2 className="text-[16px] font-bold text-foreground tracking-tight">Assistant Identity</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-muted-foreground tracking-tight">Assistant Name</Label>
                  <Input
                    required
                    placeholder="e.g., Sarah from Support"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 bg-white/2 border-border/40 rounded-2xl focus:ring-1 focus:ring-brand-500 font-bold transition-all text-[14px] text-foreground tracking-tight px-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-muted-foreground tracking-tight">Short Persona (Optional)</Label>
                  <Input
                    placeholder="e.g., Friendly and helpful customer service rep"
                    value={formData.persona}
                    onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                    className="h-12 bg-white/2 border-border/40 rounded-2xl focus:ring-1 focus:ring-brand-500 font-medium transition-all text-[14px] text-foreground tracking-tight px-4"
                  />
                </div>
              </div>
            </div>

            {/* Engine Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-t border-border/20 pt-10">
                <div className="h-8 w-8 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/30">
                  <Cpu className="h-4 w-4 text-brand-500" />
                </div>
                <h2 className="text-[16px] font-bold text-foreground tracking-tight">Intelligence Engine</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-muted-foreground tracking-tight">Base Model</Label>
                  <Select value={formData.llm_model} onValueChange={(val) => setFormData({ ...formData, llm_model: val })}>
                    <SelectTrigger className="h-12 bg-white/2 border-border/40 rounded-2xl focus:ring-1 focus:ring-brand-500 font-bold transition-all text-foreground tracking-tight px-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/40 rounded-2xl shadow-3xl">
                      <SelectItem value="llama-3.3-70b-versatile" className="py-2.5 rounded-xl font-bold">
                        Llama 3.3 70B
                      </SelectItem>
                      <SelectItem value="llama-3.1-8b-instant" className="py-2.5 rounded-xl font-bold">
                        Llama 3.1 8B
                      </SelectItem>
                      <SelectItem value="gpt-4o" className="py-2.5 rounded-xl font-bold">
                        GPT-4o (OpenAI)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-muted-foreground tracking-tight">Inference Provider</Label>
                  <Select value={formData.llm_provider} onValueChange={(val) => setFormData({ ...formData, llm_provider: val })}>
                    <SelectTrigger className="h-12 bg-white/2 border-border/40 rounded-2xl focus:ring-1 focus:ring-brand-500 font-bold transition-all text-foreground tracking-tight px-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/40 rounded-2xl shadow-3xl">
                      <SelectItem value="groq" className="py-2.5 rounded-xl font-bold">
                        Groq (Near-instant)
                      </SelectItem>
                      <SelectItem value="openai" className="py-2.5 rounded-xl font-bold">
                        OpenAI
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Knowledge Bases Attach */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-t border-border/20 pt-10">
                <div className="h-8 w-8 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/30">
                  <Database className="h-4 w-4 text-brand-500" />
                </div>
                <h2 className="text-[16px] font-bold text-foreground tracking-tight">Knowledge Bases</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select value={kbToAttach} onValueChange={setKbToAttach}>
                      <SelectTrigger className="h-12 bg-white/2 border-border/40 rounded-2xl focus:ring-1 focus:ring-brand-500 font-bold transition-all text-foreground tracking-tight px-4">
                        <SelectValue placeholder="Attach a knowledge base (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/40 rounded-2xl shadow-3xl">
                        {selectableKBs.length === 0 ? (
                          <SelectItem value="__no_kbs__" disabled className="py-2.5 rounded-xl font-bold opacity-40 italic">
                            No KBs available
                          </SelectItem>
                        ) : (
                          selectableKBs.map((kb) => (
                            <SelectItem key={kb.id} value={kb.id} className="py-2.5 rounded-xl font-bold">
                              {kb.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAttachKb}
                    disabled={!kbToAttach || settingKb}
                    className="h-12 px-6 rounded-xl font-bold text-[12px] uppercase tracking-widest gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Attach
                  </Button>
                </div>

                {attachedKbIds.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {attachedKbIds.map((kbId) => {
                      const kb = kbById.get(kbId)
                      return (
                        <Badge
                          key={kbId}
                          variant="secondary"
                          className="h-8 px-3 bg-background border-border/40 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                          <span className="max-w-[180px] truncate">{kb?.name ?? kbId}</span>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveKb(kbId)}
                            aria-label={`Remove ${kb?.name ?? kbId}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                    No Knowledge Bases attached (you can add later).
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col gap-4">
            <Button
              type="submit"
              disabled={creatingAgent || settingKb || !formData.name}
              className="h-14 bg-brand-500 hover:bg-brand-600 text-white font-bold text-[14px] rounded-2xl transition-all shadow-2xl shadow-brand-500/20 active:scale-95 gap-2 w-full disabled:opacity-50"
            >
              {creatingAgent ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Create Assistant
                </>
              )}
            </Button>
            {submitError ? (
              <p className="text-[11px] font-bold text-destructive/80 uppercase tracking-widest">
                {submitError}
              </p>
            ) : null}
            <p className="text-center text-[11px] font-bold text-muted-foreground opacity-30 uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" />
              Free to initialize • Pay per minute
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

