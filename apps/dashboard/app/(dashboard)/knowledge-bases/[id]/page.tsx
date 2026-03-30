import { Card, CardContent, CardHeader, CardTitle } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Input } from '@aicaller/ui'

export default function KnowledgeBaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
        <p className="text-muted-foreground">Knowledge Base ID: {params.id}</p>
      </div>

      <Card className="bg-card border border-border/40">
        <CardHeader>
          <CardTitle className="text-foreground">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 text-muted-foreground/70">Name</th>
                  <th className="text-left py-2 text-muted-foreground/70">Type</th>
                  <th className="text-left py-2 text-muted-foreground/70">Status</th>
                  <th className="text-left py-2 text-muted-foreground/70">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-3 text-foreground">No documents</td>
                  <td className="py-3 text-muted-foreground/70">-</td>
                  <td className="py-3 text-muted-foreground/70">-</td>
                  <td className="py-3 text-muted-foreground/70">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border/40">
        <CardHeader>
          <CardTitle className="text-foreground">Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            className="bg-muted/30 border-border/40 text-foreground focus:ring-primary/40 focus:border-primary transition-all"
          />
          <Button className="bg-brand-500 hover:bg-brand-600 text-white">Upload</Button>
        </CardContent>
      </Card>
    </div>
  )
}
