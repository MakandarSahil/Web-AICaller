import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Label } from '@aicaller/ui'
import { Input } from '@aicaller/ui'

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Agent Detail</h1>
        <p className="text-slate-400">Edit and manage agent {params.id}</p>
      </div>

      <Card className="bg-slate-800">
        <CardContent className="pt-6">
          <form className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Agent Name
              </Label>
              <Input
                id="name"
                placeholder="Agent name"
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-slate-200">
                System Prompt
              </Label>
              <textarea
                id="prompt"
                placeholder="System prompt"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white"
                rows={8}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline">
                Delete
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
