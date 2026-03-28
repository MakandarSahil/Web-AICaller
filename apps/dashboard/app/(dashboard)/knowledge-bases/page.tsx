import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'

export default function KnowledgeBasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Knowledge Bases</h1>
          <p className="text-slate-400">Upload and manage documents</p>
        </div>
        <Button>New Knowledge Base</Button>
      </div>

      <Card className="bg-slate-800">
        <CardContent className="pt-8">
          <p className="text-center text-slate-400">No knowledge bases yet. Create one to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}
