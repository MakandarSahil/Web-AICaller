import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Input } from '@aicaller/ui'
import { Label } from '@aicaller/ui'

export default function CreateAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Create Agent</h1>
        <p className="text-slate-400">Set up a new AI agent</p>
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
                placeholder="e.g., Support Bot"
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona" className="text-slate-200">
                Persona
              </Label>
              <Input
                id="persona"
                placeholder="e.g., Friendly customer service rep"
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-slate-200">
                System Prompt
              </Label>
              <textarea
                id="prompt"
                placeholder="Enter the system prompt for your agent"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white"
                rows={6}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit">Create Agent</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
