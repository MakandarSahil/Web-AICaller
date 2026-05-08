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
    <div className="space-y-6">
      
      {/* 1. Identity Section */}
      <section className="space-y-5 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1">
           <h3 className="text-base font-semibold text-foreground tracking-tight">Agent identity</h3>
           <p className="text-sm text-muted-foreground leading-relaxed">
             Basic identification for your AI assistant.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
              <Label>Agent name</Label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Front Desk Assistant"
                className="h-10"
              />
           </div>

           <div className="space-y-3">
              <Label>Persona</Label>
              <Input 
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                placeholder="e.g. A friendly and professional receptionist"
                className="h-10"
              />
           </div>
        </div>
      </section>

      {/* 2. Attached Numbers */}
      <section className="space-y-5 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Attached numbers
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Phone numbers currently routed to this agent.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label>Reassign number to this agent</Label>
            <Select value={phoneToAttach} onValueChange={setPhoneToAttach}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a number" />
              </SelectTrigger>
              <SelectContent>
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
            className="h-10 px-6"
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
                className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{line.number}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {line.number_type} • {line.is_active ? 'active' : 'inactive'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-6">
            <p className="text-sm text-muted-foreground">
              No numbers attached yet.
            </p>
            <Link href="/phone-numbers" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Manage in Phone Numbers
            </Link>
          </div>
        )}
      </section>

      {/* 2. Intelligence Section */}
      <section className="space-y-5 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1">
           <h3 className="text-base font-semibold text-foreground tracking-tight">System instructions</h3>
           <p className="text-sm text-muted-foreground leading-relaxed">
             This is the core logic that governs how your agent behaves and responds.
           </p>
        </div>

        <div className="rounded-lg border border-border/70 bg-background">
          <Textarea 
            ref={systemPromptRef}
            value={systemPrompt}
            onChange={(e) => {
              setSystemPrompt(e.target.value)
              autosizeSystemPrompt()
            }}
            placeholder="Introduce yourself and explain your purpose..."
            className="min-h-[200px] max-h-[520px] border-none bg-transparent resize-none text-sm leading-relaxed p-4 focus:ring-0 transition-all overflow-hidden"
          />
        </div>
      </section>

      <div className="flex justify-end">
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
          className="h-10 px-6 gap-2 disabled:opacity-50"
        >
          {updatingAgent ? 'Saving...' : 'Save agent'}
        </Button>
      </div>

    </div>
  )
}
