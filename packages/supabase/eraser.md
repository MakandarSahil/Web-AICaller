title CallMind — Database Schema v3

// ── ROW 1: Auth & Identity ────────────────────────────────────────────────────

users [icon: user, color: blue] {
  id uuid pk
  email string
  created_at timestamp
}

profiles [icon: user-circle, color: blue] {
  id uuid pk fk > users.id
  full_name string
  phone string
  avatar_url string
  account_type enum (individual, business)
  is_admin boolean
  created_at timestamp
  updated_at timestamp
}

workspaces [icon: briefcase, color: blue] {
  id uuid pk
  owner_id uuid fk > profiles.id
  name string
  business_name string
  industry string
  website string
  size enum (xs, sm, md, lg, xl)
  status enum (active, inactive, suspended)
  created_at timestamp
  updated_at timestamp
}

api_keys [icon: key, color: blue] {
  id uuid pk
  workspace_id uuid fk > workspaces.id
  created_by uuid fk > profiles.id
  name string
  key_hash string
  key_prefix string
  is_active boolean
  created_at timestamp
  last_used_at timestamp
}

// ── ROW 2: Knowledge Base ─────────────────────────────────────────────────────

knowledge_bases [icon: book, color: green] {
  id uuid pk
  workspace_id uuid fk > workspaces.id
  name string
  description string
  rag_kb_id string
  created_at timestamp
  updated_at timestamp
}

kb_documents [icon: file-text, color: green] {
  id uuid pk
  kb_id uuid fk > knowledge_bases.id
  name string
  type enum (pdf, docx, txt, plain_text)
  content string
  file_path string
  file_size integer
  status enum (processing, ready, error)
  rag_document_id string
  rag_kb_id string
  rag_status enum (pending, indexed, error)
  created_at timestamp
  updated_at timestamp
}

// ── ROW 2: Agents (same row as KB — connected via join table) ─────────────────

agents [icon: cpu, color: purple] {
  id uuid pk
  workspace_id uuid fk > workspaces.id
  name string
  persona string
  system_prompt string
  stt_provider string
  stt_model string
  tts_provider string
  tts_model string
  tts_voice string
  llm_provider string
  llm_model string
  rag_provider string
  status enum (active, inactive, suspended)
  is_default boolean
  created_at timestamp
  updated_at timestamp
}

agent_knowledge_bases [icon: link, color: green] {
  id uuid pk
  agent_id uuid fk > agents.id
  kb_id uuid fk > knowledge_bases.id
  attached_at timestamp
}

agent_usage [icon: bar-chart, color: purple] {
  id uuid pk
  agent_id uuid fk > agents.id
  total_calls integer
  total_messages integer
  last_active_at timestamp
}

// ── ROW 3: Telephony ──────────────────────────────────────────────────────────

number_pool [icon: phone, color: orange] {
  id uuid pk
  number string
  provider string
  provider_sid string
  is_assigned boolean
  assigned_to uuid fk > workspaces.id
  webhook_configured boolean
  created_at timestamp
}

phone_numbers [icon: phone-call, color: orange] {
  id uuid pk
  workspace_id uuid fk > workspaces.id
  agent_id uuid fk > agents.id
  number string
  number_type enum (platform, own)
  provider string
  provider_sid string
  webhook_url string
  is_active boolean
  created_at timestamp
}

callers [icon: users, color: yellow] {
  id uuid pk
  workspace_id uuid fk > workspaces.id
  phone_number string
  first_seen_at timestamp
  last_seen_at timestamp
  call_count integer
}

// ── ROW 4: Conversations & Messages ──────────────────────────────────────────

conversations [icon: message-square, color: red] {
  id uuid pk
  agent_id uuid fk > agents.id
  caller_id uuid fk > callers.id
  session_id string
  channel enum (twilio, text_api, websocket)
  status enum (active, completed, failed)
  visitor_id string
  kb_snapshot_ids uuid[]
  summary string
  summary_edited boolean
  message_count integer
  started_at timestamp
  ended_at timestamp
}

messages [icon: message-circle, color: red] {
  id uuid pk
  conversation_id uuid fk > conversations.id
  role enum (user, assistant)
  content string
  created_at timestamp
}

// =============================================================================
// RELATIONSHIPS
// =============================================================================

// Identity chain (left to right: users → profiles → workspaces)
users.id - profiles.id
profiles.id < workspaces.owner_id

// Workspace → everything it owns
workspaces.id < knowledge_bases.workspace_id
workspaces.id < agents.workspace_id
workspaces.id < phone_numbers.workspace_id
workspaces.id < callers.workspace_id
workspaces.id < api_keys.workspace_id
workspaces.id < number_pool.assigned_to

// KB chain
knowledge_bases.id < kb_documents.kb_id

// Agent ↔ KB join
agents.id < agent_knowledge_bases.agent_id
knowledge_bases.id < agent_knowledge_bases.kb_id

// Agent → usage (1-to-1)
agents.id - agent_usage.agent_id

// Agent → phone numbers
agents.id < phone_numbers.agent_id

// Conversation chain
agents.id < conversations.agent_id
callers.id < conversations.caller_id
conversations.id < messages.conversation_id

// API key creator
profiles.id < api_keys.created_by
