import Link from 'next/link'
import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agents</h1>
          <p className="text-slate-400">Manage your AI agents</p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button>Create Agent</Button>
        </Link>
      </div>

      <Card className="bg-slate-800">
        <CardContent className="pt-8">
          <p className="text-center text-slate-400">No agents yet. Create one to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}
