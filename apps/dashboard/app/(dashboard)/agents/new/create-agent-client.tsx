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
import { PageHeader } from '@/components/ui/page-header'

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
      <PageHeader
        title="Create assistant"
        description="Configure identity, model, and optional knowledge sources"
        leading={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            asChild
          >
            <Link href="/agents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="max-w-3xl mx-auto py-8 px-5 sm:px-6 lg:px-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            {/* Identity Section */}
            <section className="space-y-5 border-b border-border/70 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <ShieldCheck className="h-4 w-4 text-brand-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground tracking-tight">Assistant identity</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Name the assistant and define how it should behave.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Assistant name</Label>
                  <Input
                    required
                    placeholder="e.g., Sarah from Support"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short persona</Label>
                  <Input
                    placeholder="e.g., Friendly and helpful customer service rep"
                    value={formData.persona}
                    onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
            </section>

            {/* Engine Section */}
            <section className="space-y-5 border-b border-border/70 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <Cpu className="h-4 w-4 text-brand-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground tracking-tight">Intelligence engine</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose the provider and model for the assistant.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Base model</Label>
                  <Select value={formData.llm_model} onValueChange={(val) => setFormData({ ...formData, llm_model: val })}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama-3.3-70b-versatile">
                        Llama 3.3 70B
                      </SelectItem>
                      <SelectItem value="llama-3.1-8b-instant">
                        Llama 3.1 8B
                      </SelectItem>
                      <SelectItem value="gpt-4o">
                        GPT-4o (OpenAI)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Inference provider</Label>
                  <Select value={formData.llm_provider} onValueChange={(val) => setFormData({ ...formData, llm_provider: val })}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groq">
                        Groq (Near-instant)
                      </SelectItem>
                      <SelectItem value="openai">
                        OpenAI
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Knowledge Bases Attach */}
            <section className="space-y-5 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <Database className="h-4 w-4 text-brand-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground tracking-tight">Knowledge bases</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Attach existing knowledge sources now or add them later.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Select value={kbToAttach} onValueChange={setKbToAttach}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Attach a knowledge base (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectableKBs.length === 0 ? (
                          <SelectItem value="__no_kbs__" disabled>
                            No KBs available
                          </SelectItem>
                        ) : (
                          selectableKBs.map((kb) => (
                            <SelectItem key={kb.id} value={kb.id}>
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
                    className="h-10 gap-2 shrink-0"
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
                          className="h-8 px-3 bg-muted/40 border-border/40 text-sm font-medium flex items-center gap-2"
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
                  <p className="text-sm text-muted-foreground">
                    No knowledge bases attached. You can add them later.
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              disabled={creatingAgent || settingKb || !formData.name}
              className="h-11 gap-2 w-full"
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
              <p className="text-sm font-medium text-destructive">
                {submitError}
              </p>
            ) : null}
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3" />
              Free to initialize. Pay per minute.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
