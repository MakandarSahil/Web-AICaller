'use client'

import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  MessageSquare,
  Phone,
  Search,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'

import type { ConversationListRow } from '@aicaller/supabase/queries'
import { useConversations } from '@/hooks/use-conversations'

type Mode = 'voice' | 'chat'

function isCallChannel(channel: string): boolean {
  return channel === 'twilio'
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(startedAt: string, endedAt: string | null): string {
  const start = new Date(startedAt)
  const end = endedAt ? new Date(endedAt) : new Date()
  const seconds = Math.max(Math.floor((end.getTime() - start.getTime()) / 1000), 0)
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

function getIdentity(row: ConversationListRow): string {
  if (isCallChannel(row.channel)) return row.callers?.phone_number ?? row.caller_id ?? 'Unknown caller'
  if (row.visitor_id) return `Dashboard User ${row.visitor_id.slice(0, 8)}`
  return row.caller_id ?? 'Unknown chat user'
}

function getSource(row: ConversationListRow): string {
  if (isCallChannel(row.channel)) return 'Call'
  if (row.channel === 'text_api') return row.visitor_id ? 'Dashboard Chat' : 'Text API'
  if (row.channel === 'websocket') return 'Web Widget'
  return 'Chat'
}

function getSourceKey(row: ConversationListRow): string {
  if (isCallChannel(row.channel)) return 'call'
  if (row.channel === 'text_api') return row.visitor_id ? 'dashboard_chat' : 'text_api'
  if (row.channel === 'websocket') return 'web_widget'
  return 'chat'
}

function getOutcomeLabel(outcome: ConversationListRow['outcome']): string {
  if (!outcome) return 'Unknown'
  return outcome.replaceAll('_', ' ')
}

function getOutcomeStyle(outcome: ConversationListRow['outcome']): string {
  switch (outcome) {
    case 'resolved':
    case 'booked':
      return 'bg-emerald-500/10 text-emerald-500'
    case 'transferred':
      return 'bg-sky-500/10 text-sky-500'
    case 'unresolved':
    case 'hung_up':
      return 'bg-amber-500/10 text-amber-500'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function ConversationHistoryView({
  mode,
  title,
  subtitle,
}: {
  mode: Mode
  title: string
  subtitle: string
}) {
  const router = useRouter()
  const { data: allConversations = [] } = useConversations()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'started_at', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 12 })

  const scopedRows = useMemo(
    () => allConversations.filter((row) => (mode === 'voice' ? isCallChannel(row.channel) : !isCallChannel(row.channel))),
    [allConversations, mode]
  )

  const statusOptions = useMemo(() => {
    const values = Array.from(new Set(scopedRows.map((row) => row.status).filter(Boolean)))
    return values.sort((a, b) => a.localeCompare(b))
  }, [scopedRows])

  const sourceOptions = useMemo(() => {
    const values = Array.from(new Set(scopedRows.map((row) => getSourceKey(row))))
    return values.sort((a, b) => a.localeCompare(b))
  }, [scopedRows])

  const outcomeOptions = useMemo(() => {
    const values = Array.from(new Set(scopedRows.map((row) => row.outcome).filter(Boolean)))
    return values.sort((a, b) => String(a).localeCompare(String(b)))
  }, [scopedRows])

  const currentStatusFilter = (columnFilters.find((f) => f.id === 'status')?.value as string) ?? 'all'
  const currentSourceFilter = (columnFilters.find((f) => f.id === 'sourceKey')?.value as string) ?? 'all'
  const currentOutcomeFilter = (columnFilters.find((f) => f.id === 'outcome')?.value as string) ?? 'all'

  const columns = useMemo<ColumnDef<ConversationListRow>[]>(
    () => [
      {
        id: 'started_at',
        accessorKey: 'started_at',
        header: 'Time',
        sortingFn: 'datetime',
        cell: ({ row }) => <span className="text-sm font-semibold text-foreground/90">{formatDateTime(row.original.started_at)}</span>,
      },
      {
        id: 'duration',
        header: 'Duration',
        accessorFn: (row) => formatDuration(row.started_at, row.ended_at),
        cell: ({ row }) => <span className="text-sm font-semibold text-foreground/80">{formatDuration(row.original.started_at, row.original.ended_at)}</span>,
      },
      {
        id: 'agent',
        accessorFn: (row) => row.agents?.name ?? 'Unknown Agent',
        header: 'Agent',
        cell: ({ row }) => <span className="text-sm font-semibold text-foreground/90">{row.original.agents?.name ?? 'Unknown Agent'}</span>,
      },
      {
        id: 'sourceKey',
        accessorFn: (row) => getSourceKey(row),
        filterFn: (row, id, value) => {
          if (!value || value === 'all') return true
          return row.getValue(id) === value
        },
      },
      {
        id: 'source',
        accessorFn: (row) => getSource(row),
        header: 'Source',
        cell: ({ row }) => (
          <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
            {getSource(row.original)}
          </Badge>
        ),
      },
      {
        id: 'identity',
        accessorFn: (row) => getIdentity(row),
        header: mode === 'voice' ? 'Caller' : 'User',
        cell: ({ row }) => <span className="text-sm text-foreground/80">{getIdentity(row.original)}</span>,
      },
      {
        id: 'messages',
        accessorKey: 'message_count',
        header: 'Messages',
        cell: ({ row }) => <span className="text-sm font-semibold text-foreground/80">{row.original.message_count}</span>,
      },
      {
        id: 'tool_call',
        accessorFn: (row) => (row.had_tool_call ? 'yes' : 'no'),
        header: 'Tool Call',
        cell: ({ row }) => (
          <Badge variant="outline" className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest', row.original.had_tool_call ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
            {row.original.had_tool_call ? 'Yes' : 'No'}
          </Badge>
        ),
      },
      {
        id: 'outcome',
        accessorKey: 'outcome',
        header: 'Outcome',
        filterFn: (row, id, value) => {
          if (!value || value === 'all') return true
          return String(row.getValue(id) ?? '') === String(value)
        },
        cell: ({ row }) => (
          <Badge variant="outline" className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest', getOutcomeStyle(row.original.outcome))}>
            {getOutcomeLabel(row.original.outcome)}
          </Badge>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        filterFn: (row, id, value) => {
          if (!value || value === 'all') return true
          return String(row.getValue(id)) === String(value)
        },
        cell: ({ row }) => (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest',
              row.original.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-500'
                : row.original.status === 'failed'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    [mode]
  )

  const filteredColumns = useMemo(() => columns.filter((column) => column.id !== 'sourceKey'), [columns])

  const table = useReactTable({
    data: scopedRows,
    columns,
    state: { globalFilter, sorting, columnFilters, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, value) => {
      const term = String(value).trim().toLowerCase()
      if (!term) return true
      return [
        row.original.id,
        row.original.agents?.name ?? '',
        row.original.summary ?? '',
        row.original.callers?.phone_number ?? '',
        row.original.caller_id ?? '',
        row.original.visitor_id ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background h-screen overflow-hidden">
      <header className="h-16 px-10 border-b border-border/40 bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-[15px] font-bold tracking-tight text-foreground uppercase">{title}</h1>
          <div className="h-4 w-px bg-border/40" />
          <span className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">{subtitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/30" />
            <Input
              placeholder={`Search ${mode === 'voice' ? 'calls' : 'chats'}...`}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-10 pl-9 bg-muted/10 border-border/40 rounded-xl text-[12px] font-medium"
            />
          </div>
          <Select
            value={currentStatusFilter}
            onValueChange={(value) =>
              table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-10 w-36 rounded-xl border-border/40 bg-background text-[11px] font-bold uppercase tracking-widest">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all">All</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentSourceFilter}
            onValueChange={(value) =>
              table.getColumn('sourceKey')?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-10 w-40 rounded-xl border-border/40 bg-background text-[11px] font-bold uppercase tracking-widest">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all">All Sources</SelectItem>
              {sourceOptions.map((source) => (
                <SelectItem key={source} value={source}>
                  {source.replaceAll('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentOutcomeFilter}
            onValueChange={(value) =>
              table.getColumn('outcome')?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-10 w-40 rounded-xl border-border/40 bg-background text-[11px] font-bold uppercase tracking-widest">
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="all">All Outcomes</SelectItem>
              {outcomeOptions.map((outcome) => (
                <SelectItem key={String(outcome)} value={String(outcome)}>
                  {getOutcomeLabel(outcome)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-10 w-24 rounded-xl border-border/40 bg-background text-[11px] font-bold uppercase tracking-widest">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 px-10 py-6 overflow-hidden">
        <div className="rounded-[28px] border border-border/40 bg-background shadow-sm overflow-hidden h-full flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full border-collapse min-w-[1040px]">
              <thead className="sticky top-0 z-10 bg-muted/30">
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id} className="border-b border-border/40">
                    {group.headers
                      .filter((header) => header.id !== 'sourceKey')
                      .map((header) => (
                        <th
                          key={header.id}
                          className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40"
                        >
                          {header.column.getCanSort() ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-2 select-none"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </th>
                      ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border/20">
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => router.push(`/conversations/${row.original.id}`)}
                      className="cursor-pointer transition-colors hover:bg-muted/20"
                    >
                      {row
                        .getVisibleCells()
                        .filter((cell) => cell.column.id !== 'sourceKey')
                        .map((cell) => (
                          <td key={cell.id} className="px-5 py-4 align-middle">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="space-y-2">
                        {mode === 'voice' ? (
                          <Phone className="mx-auto h-7 w-7 text-muted-foreground/30" />
                        ) : (
                          <MessageSquare className="mx-auto h-7 w-7 text-muted-foreground/30" />
                        )}
                        <p className="text-sm font-medium text-foreground/80">No {mode === 'voice' ? 'calls' : 'chats'} match current filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border/40 px-5 py-3 flex items-center justify-between gap-3 bg-muted/10">
            <p className="text-xs text-muted-foreground/70">
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} rows
            </p>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-xs font-semibold text-foreground/80">
                Page {table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
