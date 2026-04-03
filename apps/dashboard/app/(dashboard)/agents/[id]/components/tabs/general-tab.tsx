'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@aicaller/ui'
import type { getAgent } from '@aicaller/supabase/queries'
import { useUpdateAgent } from '@/hooks/use-agents'
import { Phone } from 'lucide-react'
import Link from 'next/link'
import { usePhoneNumbers, useUpdatePhoneNumber } from '@/hooks/use-phone-numbers'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>

interface GeneralTabProps {
  agent: Agent
}

export default function GeneralTab({ agent }: GeneralTabProps) {
  const [name, setName] = useState(agent.name)
  const [persona, setPersona] = useState(agent.persona ?? '')
  const [systemPrompt, setSystemPrompt] = useState(agent.system_prompt ?? '')

  const { mutate: updateAgent, isPending: updatingAgent } = useUpdateAgent()
  const { data: workspaceNumbers = [] } = usePhoneNumbers()
  const { mutate: reassignPhone, isPending: reassigningPhone } = useUpdatePhoneNumber()
  const [phoneToAttach, setPhoneToAttach] = useState('')

  useEffect(() => {
    setName(agent.name)
    setPersona(agent.persona ?? '')
    setSystemPrompt(agent.system_prompt ?? '')
  }, [agent.id])

  const isDirty = useMemo(() => {
    return (
      name.trim() !== agent.name ||
      (persona.trim() || '') !== (agent.persona ?? '') ||
      (systemPrompt.trim() || '') !== (agent.system_prompt ?? '')
    )
  }, [agent.id, agent.name, agent.persona, agent.system_prompt, name, persona, systemPrompt])

  const attachableNumbers = useMemo(
    () => workspaceNumbers.filter((line) => line.agent_id !== agent.id),
    [workspaceNumbers, agent.id]
  )

  const systemPromptRef = useRef<HTMLTextAreaElement | null>(null)

  const autosizeSystemPrompt = () => {
    const el = systemPromptRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    autosizeSystemPrompt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemPrompt])

  return (
    <div className="space-y-10">
      
      {/* 1. Identity Section */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">Agent Identity</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             Basic identification for your AI assistant.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Agent Name</Label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Front Desk Assistant"
                className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]"
              />
           </div>

           <div className="space-y-3">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Persona (Optional)</Label>
              <Input 
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="e.g. A friendly and professional receptionist"
                className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-1 focus:ring-primary/20 font-bold transition-all px-5 text-[14px]"
              />
           </div>
        </div>
      </section>

      {/* 2. Attached Numbers */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">
            Attached Numbers
          </h3>
          <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
            Phone numbers currently routed to this agent.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Reassign Number To This Agent
            </Label>
            <Select value={phoneToAttach} onValueChange={setPhoneToAttach}>
              <SelectTrigger className="h-11 rounded-none bg-muted/10 border-border/50">
                <SelectValue placeholder="Select a number" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border/50">
                {attachableNumbers.length === 0 ? (
                  <SelectItem value="__none__" disabled>
                    No other numbers available
                  </SelectItem>
                ) : (
                  attachableNumbers.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      {line.number}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={!phoneToAttach || reassigningPhone}
            className="h-11 rounded-none px-6 text-[11px] font-bold uppercase tracking-widest"
            onClick={() => {
              if (!phoneToAttach) return
              reassignPhone(
                { id: phoneToAttach, agentId: agent.id },
                {
                  onSuccess: () => setPhoneToAttach(''),
                }
              )
            }}
          >
            {reassigningPhone ? 'Attaching...' : 'Attach'}
          </Button>
        </div>

        {agent.phone_numbers?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agent.phone_numbers.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between p-4 border border-border/40 bg-muted/5 rounded-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-none bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/60 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{line.number}</p>
                    <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                      {line.number_type} • {line.is_active ? 'active' : 'inactive'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 border border-dashed border-border/50 bg-muted/5 rounded-none">
            <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-widest">
              No numbers attached yet.
            </p>
            <Link href="/phone-numbers" className="text-[11px] font-bold text-primary uppercase tracking-widest mt-2 inline-block">
              Manage in Phone Numbers
            </Link>
          </div>
        )}
      </section>

      {/* 2. Intelligence Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col gap-1">
           <h3 className="text-[14px] font-bold text-foreground tracking-tight uppercase">System Instructions</h3>
           <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
             This is the core logic that governs how your agent behaves and responds.
           </p>
        </div>

        <div className="p-1 rounded-none bg-gradient-to-b from-border/50 to-transparent">
          <Textarea 
            ref={systemPromptRef}
            value={systemPrompt}
            onChange={(e) => {
              setSystemPrompt(e.target.value)
              autosizeSystemPrompt()
            }}
            placeholder="Introduce yourself and explain your purpose..."
            className="min-h-[200px] max-h-[520px] bg-background border-none rounded-none resize-none text-[15px] leading-relaxed p-6 focus:ring-0 transition-all placeholder:text-muted-foreground/20 font-medium overflow-hidden"
          />
        </div>
      </section>

      <div className="pt-6 border-t border-border/40 flex justify-end">
        <Button
          onClick={() => {
            updateAgent({
              id: agent.id,
              payload: {
                name: name.trim(),
                persona: persona.trim() ? persona.trim() : null,
                system_prompt: systemPrompt.trim() ? systemPrompt.trim() : null,
              },
            })
          }}
          disabled={updatingAgent || !name.trim() || !isDirty}
          className="h-12 px-10 rounded-xl font-bold text-[11px] uppercase tracking-widest gap-3 shadow-lg shadow-primary/10 disabled:opacity-50"
        >
          {updatingAgent ? 'Saving...' : 'Save Agent'}
        </Button>
      </div>

    </div>
  )
}
