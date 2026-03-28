import { Card, CardContent, CardHeader, CardTitle } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Input } from '@aicaller/ui'

export default function KnowledgeBaseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
        <p className="text-slate-400">Knowledge Base ID: {params.id}</p>
      </div>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-slate-400">Name</th>
                  <th className="text-left py-2 text-slate-400">Type</th>
                  <th className="text-left py-2 text-slate-400">Status</th>
                  <th className="text-left py-2 text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-3 text-white">No documents</td>
                  <td className="py-3 text-slate-400">-</td>
                  <td className="py-3 text-slate-400">-</td>
                  <td className="py-3 text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            className="bg-slate-700 border-slate-600"
          />
          <Button>Upload</Button>
        </CardContent>
      </Card>
    </div>
  )
}
