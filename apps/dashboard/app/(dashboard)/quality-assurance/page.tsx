'use client'

import { ShieldCheck } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'

export default function QualityAssurancePage() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <PageHeader
        title="AI quality assurance"
        description="Monitor policy checks, conversation quality, and model behavior"
      />
      <div className="p-5 sm:p-6 lg:p-8">
        <EmptyState
          icon={ShieldCheck}
          title="Quality scoring is coming soon"
          description="Conversation scoring, policy review, and quality signals will appear here as the V2 analytics pipeline expands."
        />
      </div>
    </div>
  )
}
