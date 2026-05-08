'use client'

import React, { useMemo, useState } from 'react'
import { Badge, Button } from '@aicaller/ui'
import { Book, Brain, Copy, AudioLines, MessageSquare, Phone, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@aicaller/ui/lib/utils'
import type { getAgent, getKnowledgeBases } from '@aicaller/supabase/queries'
import { ContextualSidebarToggleButton } from '@/components/layout/contextual-sidebar-toggle-button'
import { useAgent } from '@/hooks/use-agents'
import { StatusBadge } from '@/components/ui/status-badge'

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
      <header className="border-b border-border/70 bg-background/95 backdrop-blur sticky top-0 z-50 transition-colors">
        <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <ContextualSidebarToggleButton className="mr-1 shrink-0" />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-semibold text-foreground tracking-tight truncate leading-none">
                  {agentData.name}
                </h1>
                {agentData.is_default ? (
                  <StatusBadge tone="info">Default</StatusBadge>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 group cursor-pointer" onClick={handleCopyId}>
                <span className="text-xs font-mono text-muted-foreground transition-colors group-hover:text-primary">
                  {agentData.id}
                </span>
                <Copy className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary transition-opacity opacity-40 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 gap-2" asChild>
              <Link href={`/agents/${agent.id}/talk`}>
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                Talk
              </Link>
            </Button>

            <Button size="sm" className="h-8 gap-2" asChild>
              <Link href={`/agents/${agent.id}/chat`}>
                <MessageSquare className="h-3.5 w-3.5" />
                Chat
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex h-11 items-center gap-2 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center h-full px-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative h-11 px-4 flex items-center gap-2 transition-all group border-b-2 border-transparent whitespace-nowrap',
                    isActive ? 'text-foreground font-semibold border-primary' : 'text-muted-foreground hover:text-foreground font-medium'
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5 shrink-0 transition-opacity', isActive ? 'opacity-100 text-primary' : 'opacity-70 group-hover:opacity-100')} />
                  <span className="text-sm tracking-tight">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="max-w-6xl mx-auto px-5 py-6 pb-24 sm:px-6 lg:px-8">
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
