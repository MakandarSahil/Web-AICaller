'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@aicaller/supabase/client'
import { useUser } from '@/providers/user-provider'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@aicaller/ui'
import { Bot, Book, Users, Phone, LogOut } from 'lucide-react'
import type { Tables } from '@aicaller/supabase'

interface OverviewClientProps {
  initialAgents: Tables<'agents'>[]
  agentsCount: number
  kbCount: number
  callersCount: number
  phoneNumbersCount: number
}

export function OverviewClient({
  initialAgents,
  agentsCount,
  kbCount,
  callersCount,
  phoneNumbersCount,
}: OverviewClientProps) {
  const { profile, workspace, email } = useUser()
  const router = useRouter()

  // Determine user display info
  const fullName = profile.full_name || 'User'
  const firstName = fullName.split(' ')[0]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex-1 space-y-8 p-8 max-w-7xl mx-auto w-full font-sans">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
            <Badge variant="outline" className="text-gray-500 font-normal py-1 border-gray-200 shadow-sm rounded-full">
              {email}
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">
            <span className="text-gray-900 font-medium">{firstName}</span> at{' '}
            <span className="text-gray-900 font-medium">{workspace.name || 'Workspace'}</span>
          </p>
        </div>
        <Button variant="outline" className="text-gray-700 shadow-sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Agents */}
        <Card className="shadow-sm border-gray-100 rounded-xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Active Agents</CardTitle>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-gray-900">{agentsCount ?? 0}</div>
            <p className="text-xs text-gray-500 mt-2 font-medium">In your workspace</p>
          </CardContent>
        </Card>

        {/* Knowledge Bases */}
        <Card className="shadow-sm border-gray-100 rounded-xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Knowledge Bases</CardTitle>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Book className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-gray-900">{kbCount ?? 0}</div>
            <p className="text-xs text-gray-500 mt-2 font-medium">In your workspace</p>
          </CardContent>
        </Card>

        {/* Total Callers */}
        <Card className="shadow-sm border-gray-100 rounded-xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Callers</CardTitle>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-gray-900">{callersCount ?? 0}</div>
            <p className="text-xs text-gray-500 mt-2 font-medium">In your workspace</p>
          </CardContent>
        </Card>

        {/* Phone Numbers */}
        <Card className="shadow-sm border-gray-100 rounded-xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Phone Numbers</CardTitle>
            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
              <Phone className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-gray-900">{phoneNumbersCount ?? 0}</div>
            <p className="text-xs text-gray-500 mt-2 font-medium">In your workspace</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Agents Section */}
      <Card className="shadow-sm border-gray-100 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Agents</CardTitle>
            <CardDescription className="text-gray-500">Your most recently created voice agents</CardDescription>
          </div>
          <Button variant="link" className="text-blue-600 font-medium px-0"> View all </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="text-xs uppercase font-medium text-gray-400 pl-6 h-10 tracking-wider">Name / Persona</TableHead>
                <TableHead className="text-xs uppercase font-medium text-gray-400 h-10 tracking-wider">Models</TableHead>
                <TableHead className="text-xs uppercase font-medium text-gray-400 h-10 tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase font-medium text-gray-400 text-right pr-6 h-10 tracking-wider">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialAgents && initialAgents.length > 0 ? (
                initialAgents.map((agent) => (
                  <TableRow key={agent.id} className="border-b border-gray-50 group hover:bg-gray-50/30 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Bot className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{agent.name}</span>
                          <span className="text-sm text-gray-500 mt-0.5 max-w-[300px] truncate" title={agent.persona ?? undefined}>
                            {agent.persona || 'No persona description available.'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100 font-medium shadow-none">
                          {agent.llm_model}
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100 font-medium shadow-none">
                          {agent.tts_model}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 shadow-none capitalize font-medium">
                        {agent.status || 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4 text-sm text-gray-500 font-medium tracking-tight">
                      {agent.created_at ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(agent.created_at)) : '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                    No recent agents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

