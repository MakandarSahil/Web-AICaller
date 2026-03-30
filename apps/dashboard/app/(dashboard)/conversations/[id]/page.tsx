import { Card, CardContent, CardHeader, CardTitle } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex flex-col flex-1 min-w-0 bg-background h-full p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conversation</h1>
          <p className="text-muted-foreground">Conversation ID: {params.id}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="bg-card border border-border/40">
              <CardHeader>
                <CardTitle className="text-foreground">Transcript</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-sm text-muted-foreground/70">User</p>
                  <p className="text-foreground">Hello, is there any availability?</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="text-sm text-muted-foreground/70">Agent</p>
                  <p className="text-foreground">Yes, we have availability next week.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border border-border/40">
            <CardHeader>
              <CardTitle className="text-foreground">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground/70">Duration</p>
                <p className="text-foreground">2 min 34 sec</p>
              </div>
              <div>
                <p className="text-muted-foreground/70">Status</p>
                <p className="text-foreground">Completed</p>
              </div>
              <div>
                <p className="text-muted-foreground/70">Messages</p>
                <p className="text-foreground">12</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border border-border/40">
          <CardHeader>
            <CardTitle className="text-foreground">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full rounded-lg border border-border/40 bg-muted/30 px-4 py-2 text-foreground placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/40 transition-all"
              rows={6}
              defaultValue="User inquired about availability. Agent confirmed next week slots available."
            />
            <Button className="bg-brand-500 hover:bg-brand-600 text-white">Save Summary</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

