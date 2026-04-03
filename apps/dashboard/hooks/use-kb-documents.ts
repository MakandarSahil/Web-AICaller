'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@aicaller/supabase/client'
import {
  getKBDocuments,
  createPlainTextKBDocument,
  updatePlainTextKBDocument,
  uploadKBFileDocument,
  deleteKBDocument,
} from '@aicaller/supabase/queries'
import { knowledgeBaseKeys } from '@/lib/query-keys'

type GetKBDocumentsResult = Awaited<ReturnType<typeof getKBDocuments>>

export function useKBDocuments(kbId: string, initialData?: GetKBDocumentsResult) {
  const supabase = createClient()

  return useQuery({
    queryKey: knowledgeBaseKeys.documents(kbId),
    queryFn: () => getKBDocuments(supabase, kbId),
    enabled: !!kbId,
    initialData: initialData ?? undefined,
  })
}

export function useCreatePlainTextKBDocument() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: { kbId: string; name: string; content: string }) =>
      createPlainTextKBDocument(supabase, {
        kbId: payload.kbId,
        name: payload.name,
        content: payload.content,
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.documents(variables.kbId) })
    },
  })
}

export function useUploadKBFileDocument() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: { workspaceId: string; kbId: string; name: string; file: File; docId?: string }) =>
      uploadKBFileDocument(supabase, {
        workspaceId: payload.workspaceId,
        kbId: payload.kbId,
        name: payload.name,
        file: payload.file,
        docId: payload.docId,
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.documents(variables.kbId) })
    },
  })
}

export function useDeleteKBDocument() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: { kbId: string; kbDocumentId: string; filePath?: string | null }) =>
      deleteKBDocument(supabase, {
        kbDocumentId: payload.kbDocumentId,
        filePath: payload.filePath ?? null,
      }),
    onSuccess: (_void, variables) => {
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.documents(variables.kbId) })
    },
  })
}

export function useUpdatePlainTextKBDocument() {
  const supabase = createClient()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      kbId: string
      kbDocumentId: string
      name: string
      content: string
    }) =>
      updatePlainTextKBDocument(supabase, {
        kbId: payload.kbId,
        kbDocumentId: payload.kbDocumentId,
        name: payload.name,
        content: payload.content,
      }),
    onSuccess: (_doc, variables) => {
      qc.invalidateQueries({ queryKey: knowledgeBaseKeys.documents(variables.kbId) })
    },
  })
}

