import { Card, CardContent, CardHeader, CardTitle } from '@aicaller/ui'
import { Button } from '@aicaller/ui'
import { Input } from '@aicaller/ui'
import { Label } from '@aicaller/ui'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Manage your profile and workspace</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-slate-200">
                Full Name
              </Label>
              <Input
                id="fullname"
                placeholder="Your name"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                disabled
                placeholder="your@email.com"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business" className="text-slate-200">
                Business Name
              </Label>
              <Input
                id="business"
                placeholder="Your business"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-slate-200">
                Industry
              </Label>
              <Input
                id="industry"
                placeholder="Your industry"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
