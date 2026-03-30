import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Input } from '@aicaller/ui'
import { Label } from '@aicaller/ui'

export default function CreateAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Agent</h1>
        <p className="text-muted-foreground">Set up a new AI agent</p>
      </div>

      <Card className="bg-card border border-border/40">
        <CardContent className="pt-6">
          <form className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">
                Agent Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Support Bot"
                className="bg-muted/30 border-border/40 text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona" className="text-foreground/80">
                Persona
              </Label>
              <Input
                id="persona"
                placeholder="e.g., Friendly customer service rep"
                className="bg-muted/30 border-border/40 text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-foreground/80">
                System Prompt
              </Label>
              <textarea
                id="prompt"
                placeholder="Enter the system prompt for your agent"
                className="w-full rounded-lg border border-border/40 bg-muted/30 px-4 py-2 text-foreground placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/40 transition-all"
                rows={6}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white">Create Agent</Button>
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
