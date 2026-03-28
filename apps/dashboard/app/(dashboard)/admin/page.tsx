import { Card, CardContent, CardHeader, CardTitle } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Input } from '@aicaller/ui'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        <p className="text-slate-400">Manage platform resources</p>
      </div>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Number Pool</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2 text-slate-400">Number</th>
                <th className="text-left py-2 text-slate-400">Status</th>
                <th className="text-left py-2 text-slate-400">Assigned To</th>
                <th className="text-left py-2 text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-700">
                <td className="py-3 text-white">+91-XXXX-XXXXXX</td>
                <td className="py-3">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                    Available
                  </span>
                </td>
                <td className="py-3 text-slate-400">-</td>
                <td className="py-3">
                  <button className="text-emerald-400 hover:underline">Assign</button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Add New Number</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4 max-w-md">
            <Input
              placeholder="+91-XXXX-XXXXXX"
              className="bg-slate-700 border-slate-600"
            />
            <select className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white">
              <option>Twilio</option>
            </select>
            <Button>Add Number</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
