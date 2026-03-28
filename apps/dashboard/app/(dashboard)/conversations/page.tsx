import { Card, CardContent } from '@aicaller/ui'
import { Input } from '@aicaller/ui'

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Conversations</h1>
        <p className="text-slate-400">View and manage conversations</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search conversations..."
            className="bg-slate-800 border-slate-600"
          />
          <select className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <Card className="bg-slate-800">
        <CardContent className="pt-8">
          <p className="text-center text-slate-400">No conversations yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
