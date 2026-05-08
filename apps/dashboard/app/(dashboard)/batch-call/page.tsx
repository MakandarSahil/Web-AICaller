'use client'

import { Button } from '@aicaller/ui'
import { PhoneCall, Plus } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'

export default function BatchCallPage() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      <PageHeader
        title="Batch call"
        description="Create and schedule high-volume outbound campaigns"
        actions={
          <Button size="sm" className="h-8 gap-2">
            <Plus className="h-3.5 w-3.5" />
            New campaign
          </Button>
        }
      />
      <div className="p-5 sm:p-6 lg:p-8">
        <EmptyState
          icon={PhoneCall}
          title="Batch campaigns are coming soon"
          description="This workspace will support scheduled outbound call campaigns, imported contact lists, and campaign-level analytics."
        />
      </div>
    </div>
  )
}
