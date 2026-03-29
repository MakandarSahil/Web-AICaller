import { createServerSupabaseClient } from '@aicaller/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@aicaller/ui'
import { Bot, Book, Users, Phone, ArrowUpRight, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SignOutButton } from './components/SignOutButton'

export default async function DashboardOverviewPage() {
  const supabase = await createServerSupabaseClient()
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch Active Workspace
  const { data: workspaceRaw } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!workspaceRaw) {
    redirect('/onboarding')
  }

  const workspace = workspaceRaw as any;

  // 3. Fetch Dashboard Statistics
  const [
    { count: agentsCount },
    { count: kbCount },
    { count: callersCount },
    { count: numbersCount },
    { data: recentAgentsRaw }
  ] = await Promise.all([
    supabase.from('agents').select('*', { count: 'exact', head: true }).eq('workspace_id', workspace.id),
    supabase.from('knowledge_bases').select('*', { count: 'exact', head: true }).eq('workspace_id', workspace.id),
    supabase.from('callers').select('*', { count: 'exact', head: true }).eq('workspace_id', workspace.id),
    supabase.from('phone_numbers').select('*', { count: 'exact', head: true }).eq('workspace_id', workspace.id),
    supabase.from('agents').select('*').eq('workspace_id', workspace.id).order('created_at', { ascending: false }).limit(5)
  ])

  const recentAgents = recentAgentsRaw as any[] | null;

  const stats = [
    { label: 'Active Agents', value: agentsCount || 0, icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Knowledge Bases', value: kbCount || 0, icon: Book, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Callers', value: callersCount || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Phone Numbers', value: numbersCount || 0, icon: Phone, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8 pt-2 sm:pt-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            Profile
            <Badge variant="outline" className="font-normal text-sm bg-gray-50 border-gray-200 text-gray-600 hidden sm:inline-flex mt-1">
              {user.email}
            </Badge>
          </h1>
          <p className="mt-2 text-base text-gray-500">
            <span className="font-medium text-gray-800">{user.user_metadata?.full_name || 'User'}</span> at <span className="font-medium text-gray-800">{workspace.business_name || 'Workspace'}</span>
          </p>
          <div className="sm:hidden mt-2">
            <Badge variant="outline" className="font-normal text-xs bg-gray-50 border-gray-200 text-gray-600">
              {user.email}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <SignOutButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-gray-200 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="font-medium text-emerald-600">Active</span>
                <span className="ml-2 text-gray-400">across system</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Agents Table / Empty State */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Agents</CardTitle>
              <p className="text-sm text-gray-500">Your most recently created voice agents</p>
            </div>
            {recentAgents && recentAgents.length > 0 && (
              <Button variant="ghost" className="text-sm text-brand-600 hover:text-brand-700" asChild>
                <Link href="/agents">View all</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        
        {(!recentAgents || recentAgents.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
              <Sparkles className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No agents yet</h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Your workspace is fully set up. Create your first AI voice agent to start automating conversations.
            </p>
            <Link href="/agents/new">
              <Button className="mt-6 bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Create your first Agent
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="text-xs uppercase text-gray-500 hidden sm:table-cell w-12"></TableHead>
                <TableHead className="text-xs uppercase text-gray-500">Name / Persona</TableHead>
                <TableHead className="text-xs uppercase text-gray-500">Models</TableHead>
                <TableHead className="text-xs uppercase text-gray-500">Status</TableHead>
                <TableHead className="text-xs uppercase text-gray-500 text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAgents.map((agent) => (
                <TableRow key={agent.id} className="border-gray-100 transition-colors hover:bg-gray-50/50 group cursor-pointer">
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100">
                      <Bot className="h-5 w-5 text-indigo-600" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{agent.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{agent.persona || 'Default assistant persona'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="bg-white text-xs font-normal border-gray-200">{agent.llm_model}</Badge>
                      <Badge variant="outline" className="bg-white text-xs font-normal border-gray-200">{agent.stt_model}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-0 text-xs font-medium px-2 py-0.5 ${agent.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-gray-500">
                    {new Date(agent.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
