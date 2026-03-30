import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Label } from '@aicaller/ui'
import { Input } from '@aicaller/ui'

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Agent Detail</h1>
        <p className="text-muted-foreground">Edit and manage agent {params.id}</p>
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
                placeholder="Agent name"
                className="bg-muted/30 border-border/40 text-foreground placeholder:text-muted-foreground/40 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-foreground/80">
                System Prompt
              </Label>
              <textarea
                id="prompt"
                placeholder="System prompt"
                className="w-full rounded-lg border border-border/40 bg-muted/30 px-4 py-2 text-foreground placeholder:text-muted-foreground/40 focus:ring-1 focus:ring-primary/40 transition-all"
                rows={8}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white">Save Changes</Button>
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
}
