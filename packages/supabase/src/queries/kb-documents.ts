import type { SupabaseClientType } from './_types'
import type { Tables, TablesInsert } from '../types'

type KBDocument = Tables<'kb_documents'>
type KBDocType = TablesInsert<'kb_documents'>['type']
type KBDocStatus = TablesInsert<'kb_documents'>['status']

export async function getKBDocuments(
  supabase: SupabaseClientType,
  kbId: string
): Promise<KBDocument[]> {
  const { data, error } = await supabase
    .from('kb_documents')
    .select('*')
    .eq('kb_id', kbId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createPlainTextKBDocument(
  supabase: SupabaseClientType,
  payload: {
    kbId: string
    name: string
    content: string
    /**
     * Optional explicit id (useful for deterministic storage paths).
     */
    id?: string
  }
): Promise<KBDocument> {
  const { data, error } = await supabase
    .from('kb_documents')
    .insert({
      id: payload.id,
      kb_id: payload.kbId,
      name: payload.name,
      type: 'plain_text' as KBDocType,
      content: payload.content,
      status: 'ready' as KBDocStatus,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

function inferKbDocTypeFromFilename(filename: string): KBDocType {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.pdf')) return 'pdf' as KBDocType
  if (lower.endsWith('.docx')) return 'docx' as KBDocType
  if (lower.endsWith('.txt')) return 'txt' as KBDocType

  // Schema v1 allowed types are restricted. Keep this hard-fail so we don't write invalid rows.
  throw new Error('Unsupported KB document file type. Use PDF, DOCX, or TXT.')
}

export async function uploadKBFileDocument(
  supabase: SupabaseClientType,
  payload: {
    workspaceId: string
    kbId: string
    name: string
    file: File
    /**
     * Optional explicit id (useful for deterministic storage paths).
     */
    docId?: string
  }
): Promise<KBDocument> {
  const docId = payload.docId ?? globalThis.crypto.randomUUID()
  const docType = inferKbDocTypeFromFilename(payload.file.name)

  // Matches schema/context: {workspace_id}/{kb_id}/{document_id}_{filename}
  const filePath = `${payload.workspaceId}/${payload.kbId}/${docId}_${payload.file.name}`

  const { error: uploadError } = await supabase.storage
    .from('knowledge-bases')
    .upload(filePath, payload.file, {
      contentType: payload.file.type || undefined,
      upsert: false,
    })

  if (uploadError) throw uploadError

  const { data, error: insertError } = await supabase
    .from('kb_documents')
    .insert({
      id: docId,
      kb_id: payload.kbId,
      name: payload.name,
      type: docType,
      file_path: filePath,
      file_size: payload.file.size,
      status: 'processing' as KBDocStatus,
    })
    .select('*')
    .single()

  if (insertError) throw insertError
  return data
}

export async function deleteKBDocument(
  supabase: SupabaseClientType,
  payload: { kbDocumentId: string; filePath?: string | null }
): Promise<void> {
  const filePath = payload.filePath ?? null

  if (filePath) {
    const { error: removeError } = await supabase.storage
      .from('knowledge-bases')
      .remove([filePath])

    if (removeError) throw removeError
  }

  const { error } = await supabase
    .from('kb_documents')
    .delete()
    .eq('id', payload.kbDocumentId)

  if (error) throw error
}

/**
 * Update a plain-text KB document (title + content).
 * File uploads keep their content immutable until v2 extraction editing is implemented.
 */
export async function updatePlainTextKBDocument(
  supabase: SupabaseClientType,
  payload: {
    kbId: string
    kbDocumentId: string
    name: string
    content: string
  }
): Promise<KBDocument> {
  const { data, error } = await supabase
    .from('kb_documents')
    .update({
      name: payload.name,
      content: payload.content,
    })
    .eq('id', payload.kbDocumentId)
    .eq('kb_id', payload.kbId)
    .eq('type', 'plain_text' as KBDocType)
    .select('*')
    .single()

  if (error) throw error
  return data
}

