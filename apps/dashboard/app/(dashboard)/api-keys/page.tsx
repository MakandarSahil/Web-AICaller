import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Keys</h1>
          <p className="text-slate-400">Manage API keys for external integrations</p>
        </div>
        <Button>Create API Key</Button>
      </div>

      <Card className="bg-slate-800">
        <CardContent className="pt-8">
          <p className="text-center text-slate-400">No API keys yet. Create one to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}
