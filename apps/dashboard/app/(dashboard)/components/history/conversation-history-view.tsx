'use client'

import React, { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@aicaller/ui'
import { cn } from '@aicaller/ui/lib/utils'
import {
  Bot,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  MessageSquare,
  Phone,
  Search,
  User,
  X,
} from 'lucide-react'
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
import { useConversationMessages } from '@/hooks/use-conversations'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'

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

function formatMessageTime(value: string): string {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getIdentity(row: ConversationListRow): string {
  if (isCallChannel(row.channel)) return row.callers?.phone_number ?? row.caller_id ?? 'Unknown caller'
  if (row.visitor_id) return `Dashboard User ${row.visitor_id.slice(0, 8)}`
  return row.caller_id ?? 'Unknown chat user'
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

function getOutcomeTone(outcome: ConversationListRow['outcome']) {
  switch (outcome) {
    case 'resolved':
    case 'booked':
      return 'success' as const
    case 'transferred':
      return 'info' as const
    case 'unresolved':
    case 'hung_up':
      return 'warning' as const
    default:
      return 'default' as const
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
  const { data: allConversations = [] } = useConversations()
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'started_at', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 12 })
  const [selectedConversation, setSelectedConversation] = useState<ConversationListRow | null>(null)
  const [sheetWidth, setSheetWidth] = useState<'sm' | 'md' | 'lg'>('lg')
  const { data: detailMessages = [], isLoading: isMessagesLoading } = useConversationMessages(selectedConversation?.id ?? '')

  const scopedRows = useMemo(
    () => allConversations.filter((row) => (mode === 'voice' ? isCallChannel(row.channel) : !isCallChannel(row.channel))),
    [allConversations, mode]
  )

  const statusOptions = useMemo(() => {
    const values = Array.from(new Set(scopedRows.map((row) => row.status).filter(Boolean)))
    return values.sort((a, b) => a.localeCompare(b))
  }, [scopedRows])

  const outcomeOptions = useMemo(() => {
    const values = Array.from(new Set(scopedRows.map((row) => row.outcome).filter(Boolean)))
    return values.sort((a, b) => String(a).localeCompare(String(b)))
  }, [scopedRows])

  const currentStatusFilter = (columnFilters.find((f) => f.id === 'status')?.value as string) ?? 'all'
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
        id: 'agent',
        accessorFn: (row) => row.agents?.name ?? 'Unknown Agent',
        header: 'Agent',
        cell: ({ row }) => <span className="text-sm font-semibold text-foreground/90">{row.original.agents?.name ?? 'Unknown Agent'}</span>,
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
        id: 'outcome',
        accessorKey: 'outcome',
        header: 'Outcome',
        filterFn: (row, id, value) => {
          if (!value || value === 'all') return true
          return String(row.getValue(id) ?? '') === String(value)
        },
        cell: ({ row }) => (
          <StatusBadge tone={getOutcomeTone(row.original.outcome)}>
            {getOutcomeLabel(row.original.outcome)}
          </StatusBadge>
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
          <StatusBadge
            tone={
              row.original.status === 'active'
                ? 'success'
                : row.original.status === 'failed'
                  ? 'danger'
                  : 'default'
            }
          >
            {row.original.status}
          </StatusBadge>
        ),
      },
      ...(mode === 'voice'
        ? [
            {
              id: 'duration',
              header: 'Duration',
              accessorFn: (row: ConversationListRow) => formatDuration(row.started_at, row.ended_at),
              cell: ({ row }: { row: { original: ConversationListRow } }) => (
                <span className="text-sm font-semibold text-foreground/80">{formatDuration(row.original.started_at, row.original.ended_at)}</span>
              ),
            },
          ]
        : []),
    ],
    [mode]
  )

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
        row.original.status ?? '',
        row.original.outcome ?? '',
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
      <PageHeader title={title} description={subtitle} />

      <div className="flex w-full flex-wrap items-center justify-start gap-2 border-b border-border/70 px-4 py-3 sm:px-6 lg:px-8">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              placeholder={`Search ${mode === 'voice' ? 'calls' : 'chats'}...`}
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-9 pl-9 bg-background border-border/70 rounded-lg text-sm"
            />
          </div>
          <Select
            value={currentStatusFilter}
            onValueChange={(value) =>
              table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9 w-[calc(50%-4px)] sm:w-36 rounded-lg border-border/70 bg-background text-sm">
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
            value={currentOutcomeFilter}
            onValueChange={(value) =>
              table.getColumn('outcome')?.setFilterValue(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="h-9 w-[calc(50%-4px)] sm:w-40 rounded-lg border-border/70 bg-background text-sm">
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
            <SelectTrigger className="h-9 w-24 rounded-lg border-border/70 bg-background text-sm">
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

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        <div className="rounded-xl border border-border/70 bg-card shadow-sm overflow-hidden h-full flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full border-collapse min-w-[920px]">
              <thead className="sticky top-0 z-10 bg-muted/30">
                {table.getHeaderGroups().map((group) => (
                  <tr key={group.id} className="border-b border-border/40">
                    {group.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-5 py-3.5 text-left text-xs font-medium text-muted-foreground"
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
                      onClick={() => setSelectedConversation(row.original)}
                      className="cursor-pointer transition-colors hover:bg-muted/20"
                    >
                      {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-5 py-4 align-middle">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <EmptyState
                        icon={mode === 'voice' ? Phone : MessageSquare}
                        title={`No ${mode === 'voice' ? 'calls' : 'chats'} found`}
                        description="Adjust your search or filters to see more conversation records."
                        className="min-h-[240px]"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border/70 px-5 py-3 flex items-center justify-between gap-3 bg-muted/20">
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

      <Sheet
        open={Boolean(selectedConversation)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedConversation(null)
        }}
      >
        <SheetContent
          side="right"
          className={cn(
            'w-full p-0 border-l border-border/50',
            sheetWidth === 'sm' ? 'sm:max-w-2xl' : sheetWidth === 'md' ? 'sm:max-w-3xl' : 'sm:max-w-5xl'
          )}
        >
          <SheetHeader className="px-6 py-5 border-b border-border/70 bg-background/95 backdrop-blur-sm text-left">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <SheetTitle className="text-sm font-semibold tracking-tight text-foreground">
                  {mode === 'voice' ? 'Call Detail' : 'Chat Detail'}
                </SheetTitle>
              </div>
              <div className="flex items-center gap-3">
                <Select value={sheetWidth} onValueChange={(value) => setSheetWidth(value as 'sm' | 'md' | 'lg')}>
                  <SelectTrigger className="hidden sm:flex h-8 w-32 rounded-lg border-border/70 bg-background text-xs">
                    <SelectValue placeholder="Width" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setSelectedConversation(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {selectedConversation ? (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-xs font-semibold text-foreground/90">{formatDateTime(selectedConversation.started_at)}</p>
                </div>
                {mode === 'voice' ? (
                  <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-xs font-semibold text-foreground/90">{formatDuration(selectedConversation.started_at, selectedConversation.ended_at)}</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Messages</p>
                    <p className="text-xs font-semibold text-foreground/90">{selectedConversation.message_count}</p>
                  </div>
                )}
                <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Agent</p>
                  <p className="text-xs font-semibold text-foreground/90">{selectedConversation.agents?.name ?? 'Unknown Agent'}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground">{mode === 'voice' ? 'Caller' : 'Identity'}</p>
                  <p className="text-xs font-semibold text-foreground/90">{getIdentity(selectedConversation)}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-xs font-semibold text-foreground/90">{selectedConversation.status}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Outcome</p>
                  <StatusBadge tone={getOutcomeTone(selectedConversation.outcome)} className="mt-1">
                    {getOutcomeLabel(selectedConversation.outcome)}
                  </StatusBadge>
                </div>
              </div>
            ) : null}
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-230px)] px-6 py-6">
            {selectedConversation ? (
              <div className="space-y-6">
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Summary</h3>
                  <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-3">
                    <p className="text-sm leading-relaxed text-foreground/85">
                      {selectedConversation.summary || 'No summary available for this conversation.'}
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Transcript</h3>
                  {isMessagesLoading ? (
                    <p className="text-sm text-muted-foreground/70">Loading messages...</p>
                  ) : detailMessages.length ? (
                    <div className="space-y-3">
                      {detailMessages.map((message) => {
                        const isAssistant = message.role === 'assistant'
                        return (
                          <div key={message.id} className={cn('flex gap-3', isAssistant ? 'justify-start' : 'justify-end')}>
                            {isAssistant ? (
                              <div className="h-8 w-8 shrink-0 rounded-lg border border-border/70 bg-muted/20 text-muted-foreground/70 flex items-center justify-center">
                                <Bot className="h-4 w-4" />
                              </div>
                            ) : null}
                            <div className={cn('max-w-[85%] rounded-xl px-4 py-3 text-sm', isAssistant ? 'bg-muted/20 border border-border/70 text-foreground/85' : 'bg-primary text-primary-foreground')}>
                              <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              <p className={cn('mt-2 text-xs font-medium', isAssistant ? 'text-muted-foreground/70' : 'text-primary-foreground/70')}>
                                {formatMessageTime(message.created_at)}
                              </p>
                            </div>
                            {!isAssistant ? (
                              <div className="h-8 w-8 shrink-0 rounded-lg border border-primary/30 bg-primary/10 text-primary flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4">
                      <p className="text-sm text-muted-foreground/70">No transcript messages available.</p>
                    </div>
                  )}
                </section>
              </div>
            ) : null}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
