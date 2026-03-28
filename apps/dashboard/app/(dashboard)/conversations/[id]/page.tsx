import { Card, CardContent, CardHeader, CardTitle } from '@aicaller/ui'
import { Button } from '@aicaller/ui'

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Conversation</h1>
        <p className="text-slate-400">Conversation ID: {params.id}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="bg-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Transcript</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-emerald-600 pl-4">
                <p className="text-sm text-slate-400">User</p>
                <p className="text-white">Hello, is there any availability?</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <p className="text-sm text-slate-400">Agent</p>
                <p className="text-white">Yes, we have availability next week.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-slate-400">Duration</p>
              <p className="text-white">2 min 34 sec</p>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <p className="text-white">Completed</p>
            </div>
            <div>
              <p className="text-slate-400">Messages</p>
              <p className="text-white">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white"
            rows={6}
            defaultValue="User inquired about availability. Agent confirmed next week slots available."
          />
          <Button>Save Summary</Button>
        </CardContent>
      </Card>
    </div>
  )
}
