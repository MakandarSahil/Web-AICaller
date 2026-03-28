import { Card, CardContent } from '@aicaller/ui'

export default function DashboardOverviewPage() {
  const stats = [
    { label: 'Active Agents', value: '3', color: 'bg-emerald-500' },
    { label: 'Total Calls', value: '128', color: 'bg-blue-500' },
    { label: 'Messages Today', value: '456', color: 'bg-purple-500' },
    { label: 'API Keys', value: '2', color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="text-slate-400">Dashboard overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-800">
            <CardContent className="pt-6">
              <div className={`mb-4 h-12 w-12 rounded-lg ${stat.color}`} />
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800">
        <CardContent className="pt-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
          <p className="text-slate-400">No recent activity yet</p>
        </CardContent>
      </Card>
    </div>
  )
}
