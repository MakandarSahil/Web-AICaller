'use client'

import React, { useMemo, useState } from 'react'
import { Badge, Button } from '@aicaller/ui'
import { Book, Brain, Copy, AudioLines, MessageSquare, Phone, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@aicaller/ui/lib/utils'
import type { getAgent, getKnowledgeBases } from '@aicaller/supabase/queries'
import { ContextualSidebarToggleButton } from '@/components/layout/contextual-sidebar-toggle-button'
import { useAgent } from '@/hooks/use-agents'

import GeneralTab from './tabs/general-tab'
import VoiceModelTab from './tabs/voice-model-tab'
import KnowledgeBasesTab from './tabs/knowledge-bases-tab'
import AdvancedTab from './tabs/advanced-tab'

type Agent = NonNullable<Awaited<ReturnType<typeof getAgent>>>
type KnowledgeBasesList = NonNullable<Awaited<ReturnType<typeof getKnowledgeBases>>>

interface AgentDetailMasterProps {
  agent: Agent
  knowledgeBases: KnowledgeBasesList
}

export function AgentDetailMaster({ agent, knowledgeBases }: AgentDetailMasterProps) {
  const [activeTab, setActiveTab] = useState<string>('general')
  const { data: liveAgent } = useAgent(agent.id, agent)
  const agentData = liveAgent ?? agent

  const tabs = useMemo(
    () => [
      { id: 'general', label: 'General', icon: Brain },
      { id: 'voice-model', label: 'Voice & Model', icon: AudioLines },
      { id: 'knowledge', label: 'Knowledge Bases', icon: Book },
      { id: 'advanced', label: 'Advanced', icon: ShieldCheck },
    ],
    []
  )

  const handleCopyId = () => {
    navigator.clipboard.writeText(agent.id)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
      <header className="px-4 md:px-10 border-b border-border bg-background sticky top-0 z-50 transition-colors h-auto md:h-28">
        <div className="flex flex-col md:flex-row md:h-16 md:items-center justify-between gap-4 py-4 md:py-0">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <ContextualSidebarToggleButton className="mr-1 shrink-0" />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] md:text-[20px] font-bold text-foreground tracking-tight truncate leading-none uppercase">
                  {agentData.name}
                </h1>
                {agentData.is_default ? (
                  <Badge variant="outline" className="h-5 px-2 text-[9px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                    Default
                  </Badge>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 group cursor-pointer" onClick={handleCopyId}>
                <span className="text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-primary">
                  {agentData.id}
                </span>
                <Copy className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary transition-opacity opacity-40 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl font-bold text-[12px] gap-2 border-border/60 hover:bg-muted transition-all active:scale-95 group" asChild>
              <Link href={`/agents/${agent.id}/talk`}>
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-foreground">Talk</span>
              </Link>
            </Button>

            <Button size="sm" className="h-10 px-5 rounded-xl font-bold text-[12px] gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95" asChild>
              <Link href={`/agents/${agent.id}/chat`}>
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 h-12">
          <nav className="flex items-center h-full px-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative h-12 px-5 flex items-center gap-2.5 transition-all group border-b-2 border-transparent whitespace-nowrap',
                    isActive ? 'text-foreground font-bold border-primary' : 'text-muted-foreground/60 hover:text-foreground font-medium'
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5 shrink-0 transition-opacity', isActive ? 'opacity-100 text-primary' : 'opacity-40 group-hover:opacity-100')} />
                  <span className="text-[12px] tracking-tight">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="max-w-6xl mx-auto px-10 py-12 pb-40">
            {activeTab === 'general' ? (
              <GeneralTab agent={agentData} />
            ) : activeTab === 'voice-model' ? (
              <VoiceModelTab agent={agentData} />
            ) : activeTab === 'knowledge' ? (
              <KnowledgeBasesTab agent={agentData} knowledgeBases={knowledgeBases} />
            ) : (
              <AdvancedTab agent={agentData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
