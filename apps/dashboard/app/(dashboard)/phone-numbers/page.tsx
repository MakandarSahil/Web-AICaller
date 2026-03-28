import { Card, CardContent } from '@aicaller/ui'
import { Button } from '@aicaller/ui'

export default function PhoneNumbersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Phone Numbers</h1>
          <p className="text-slate-400">Manage assigned phone numbers</p>
        </div>
        <Button>Request Number</Button>
      </div>

      <Card className="bg-slate-800">
        <CardContent className="pt-8">
          <p className="text-center text-slate-400">No phone numbers assigned yet.</p>
        </CardContent>
      </Card>
    </div>
  )
}
