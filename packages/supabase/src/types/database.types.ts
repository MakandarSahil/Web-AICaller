export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_knowledge_bases: {
        Row: {
          agent_id: string
          attached_at: string
          id: string
          kb_id: string
        }
        Insert: {
          agent_id: string
          attached_at?: string
          id?: string
          kb_id: string
        }
        Update: {
          agent_id?: string
          attached_at?: string
          id?: string
          kb_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_knowledge_bases_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_knowledge_bases_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_tools: {
        Row: {
          agent_id: string
          config: Json
          created_at: string
          display_name: string
          filler_phrase: string | null
          id: string
          is_active: boolean
          tool_type: Database["public"]["Enums"]["agent_tool_type"]
          trigger_intents: string[]
        }
        Insert: {
          agent_id: string
          config?: Json
          created_at?: string
          display_name: string
          filler_phrase?: string | null
          id?: string
          is_active?: boolean
          tool_type: Database["public"]["Enums"]["agent_tool_type"]
          trigger_intents?: string[]
        }
        Update: {
          agent_id?: string
          config?: Json
          created_at?: string
          display_name?: string
          filler_phrase?: string | null
          id?: string
          is_active?: boolean
          tool_type?: Database["public"]["Enums"]["agent_tool_type"]
          trigger_intents?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "agent_tools_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_usage: {
        Row: {
          agent_id: string
          id: string
          last_active_at: string | null
          total_calls: number
          total_messages: number
        }
        Insert: {
          agent_id: string
          id?: string
          last_active_at?: string | null
          total_calls?: number
          total_messages?: number
        }
        Update: {
          agent_id?: string
          id?: string
          last_active_at?: string | null
          total_calls?: number
          total_messages?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_usage_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: true
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string
          embedding_model: string | null
          embedding_provider: string | null
          greeting_enabled: boolean
          greeting_template: string | null
          id: string
          is_default: boolean
          llm_model: string
          llm_provider: string
          name: string
          persona: string | null
          rag_provider: string
          rag_top_k: number
          status: Database["public"]["Enums"]["agent_status"]
          stt_model: string
          stt_provider: string
          system_prompt: string | null
          tool_calling_enabled: boolean
          tts_model: string
          tts_provider: string
          tts_voice: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          embedding_model?: string | null
          embedding_provider?: string | null
          greeting_enabled?: boolean
          greeting_template?: string | null
          id?: string
          is_default?: boolean
          llm_model?: string
          llm_provider?: string
          name: string
          persona?: string | null
          rag_provider?: string
          rag_top_k?: number
          status?: Database["public"]["Enums"]["agent_status"]
          stt_model?: string
          stt_provider?: string
          system_prompt?: string | null
          tool_calling_enabled?: boolean
          tts_model?: string
          tts_provider?: string
          tts_voice?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          embedding_model?: string | null
          embedding_provider?: string | null
          greeting_enabled?: boolean
          greeting_template?: string | null
          id?: string
          is_default?: boolean
          llm_model?: string
          llm_provider?: string
          name?: string
          persona?: string | null
          rag_provider?: string
          rag_top_k?: number
          status?: Database["public"]["Enums"]["agent_status"]
          stt_model?: string
          stt_provider?: string
          system_prompt?: string | null
          tool_calling_enabled?: boolean
          tts_model?: string
          tts_provider?: string
          tts_voice?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      callers: {
        Row: {
          call_count: number
          first_seen_at: string
          id: string
          last_seen_at: string
          phone_number: string
          workspace_id: string
        }
        Insert: {
          call_count?: number
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          phone_number: string
          workspace_id: string
        }
        Update: {
          call_count?: number
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          phone_number?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "callers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_analytics: {
        Row: {
          analysed_at: string
          conversation_id: string
          entities_mentioned: Json | null
          id: string
          key_phrases: string[] | null
          outcome: Database["public"]["Enums"]["conv_outcome"] | null
          overall_intent: string | null
          resolution_turns: number | null
          sentiment_arc: Json | null
          sentiment_end: Database["public"]["Enums"]["sentiment_type"] | null
          sentiment_start: Database["public"]["Enums"]["sentiment_type"] | null
          tool_calls_made: Json | null
          topics: string[] | null
        }
        Insert: {
          analysed_at?: string
          conversation_id: string
          entities_mentioned?: Json | null
          id?: string
          key_phrases?: string[] | null
          outcome?: Database["public"]["Enums"]["conv_outcome"] | null
          overall_intent?: string | null
          resolution_turns?: number | null
          sentiment_arc?: Json | null
          sentiment_end?: Database["public"]["Enums"]["sentiment_type"] | null
          sentiment_start?: Database["public"]["Enums"]["sentiment_type"] | null
          tool_calls_made?: Json | null
          topics?: string[] | null
        }
        Update: {
          analysed_at?: string
          conversation_id?: string
          entities_mentioned?: Json | null
          id?: string
          key_phrases?: string[] | null
          outcome?: Database["public"]["Enums"]["conv_outcome"] | null
          overall_intent?: string | null
          resolution_turns?: number | null
          sentiment_arc?: Json | null
          sentiment_end?: Database["public"]["Enums"]["sentiment_type"] | null
          sentiment_start?: Database["public"]["Enums"]["sentiment_type"] | null
          tool_calls_made?: Json | null
          topics?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_analytics_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent_id: string
          caller_id: string | null
          channel: Database["public"]["Enums"]["conv_channel"]
          ended_at: string | null
          had_tool_call: boolean
          id: string
          kb_snapshot_ids: string[]
          message_count: number
          outcome: Database["public"]["Enums"]["conv_outcome"] | null
          session_id: string
          started_at: string
          status: Database["public"]["Enums"]["conv_status"]
          summary: string | null
          summary_edited: boolean
          visitor_id: string | null
        }
        Insert: {
          agent_id: string
          caller_id?: string | null
          channel: Database["public"]["Enums"]["conv_channel"]
          ended_at?: string | null
          had_tool_call?: boolean
          id?: string
          kb_snapshot_ids?: string[]
          message_count?: number
          outcome?: Database["public"]["Enums"]["conv_outcome"] | null
          session_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["conv_status"]
          summary?: string | null
          summary_edited?: boolean
          visitor_id?: string | null
        }
        Update: {
          agent_id?: string
          caller_id?: string | null
          channel?: Database["public"]["Enums"]["conv_channel"]
          ended_at?: string | null
          had_tool_call?: boolean
          id?: string
          kb_snapshot_ids?: string[]
          message_count?: number
          outcome?: Database["public"]["Enums"]["conv_outcome"] | null
          session_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["conv_status"]
          summary?: string | null
          summary_edited?: boolean
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_caller_id_fkey"
            columns: ["caller_id"]
            isOneToOne: false
            referencedRelation: "callers"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          embedding: string | null
          id: string
          kb_document_id: string
          kb_id: string
          metadata: Json | null
          token_count: number | null
          ts_vector: unknown
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          kb_document_id: string
          kb_id: string
          metadata?: Json | null
          token_count?: number | null
          ts_vector?: unknown
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          kb_document_id?: string
          kb_id?: string
          metadata?: Json | null
          token_count?: number | null
          ts_vector?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "kb_document_chunks_kb_document_id_fkey"
            columns: ["kb_document_id"]
            isOneToOne: false
            referencedRelation: "kb_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_document_chunks_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_documents: {
        Row: {
          content: string | null
          created_at: string
          file_path: string | null
          file_size: number | null
          id: string
          kb_id: string
          name: string
          rag_document_id: string | null
          rag_kb_id: string | null
          rag_status: Database["public"]["Enums"]["rag_status_type"]
          status: Database["public"]["Enums"]["kb_doc_status"]
          type: Database["public"]["Enums"]["kb_doc_type"]
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          kb_id: string
          name: string
          rag_document_id?: string | null
          rag_kb_id?: string | null
          rag_status?: Database["public"]["Enums"]["rag_status_type"]
          status?: Database["public"]["Enums"]["kb_doc_status"]
          type: Database["public"]["Enums"]["kb_doc_type"]
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_path?: string | null
          file_size?: number | null
          id?: string
          kb_id?: string
          name?: string
          rag_document_id?: string | null
          rag_kb_id?: string | null
          rag_status?: Database["public"]["Enums"]["rag_status_type"]
          status?: Database["public"]["Enums"]["kb_doc_status"]
          type?: Database["public"]["Enums"]["kb_doc_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_documents_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_bases: {
        Row: {
          chunk_overlap: number | null
          chunk_size: number | null
          created_at: string
          description: string | null
          embedding_model: string | null
          embedding_provider: string | null
          id: string
          index_status: Database["public"]["Enums"]["index_status_type"]
          indexed_at: string | null
          name: string
          rag_kb_id: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          chunk_overlap?: number | null
          chunk_size?: number | null
          created_at?: string
          description?: string | null
          embedding_model?: string | null
          embedding_provider?: string | null
          id?: string
          index_status?: Database["public"]["Enums"]["index_status_type"]
          indexed_at?: string | null
          name: string
          rag_kb_id?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          chunk_overlap?: number | null
          chunk_size?: number | null
          created_at?: string
          description?: string | null
          embedding_model?: string | null
          embedding_provider?: string | null
          id?: string
          index_status?: Database["public"]["Enums"]["index_status_type"]
          indexed_at?: string | null
          name?: string
          rag_kb_id?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_bases_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["message_role"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      number_pool: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          is_assigned: boolean
          number: string
          provider: string
          provider_sid: string | null
          webhook_configured: boolean
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          is_assigned?: boolean
          number: string
          provider?: string
          provider_sid?: string | null
          webhook_configured?: boolean
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          is_assigned?: boolean
          number?: string
          provider?: string
          provider_sid?: string | null
          webhook_configured?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "number_pool_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_numbers: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          is_active: boolean
          number: string
          number_type: Database["public"]["Enums"]["number_type"]
          provider: string
          provider_sid: string | null
          telephony_provider_id: string | null
          webhook_url: string | null
          workspace_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          number: string
          number_type: Database["public"]["Enums"]["number_type"]
          provider?: string
          provider_sid?: string | null
          telephony_provider_id?: string | null
          webhook_url?: string | null
          workspace_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          number?: string
          number_type?: Database["public"]["Enums"]["number_type"]
          provider?: string
          provider_sid?: string | null
          telephony_provider_id?: string | null
          webhook_url?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_telephony_provider_id_fkey"
            columns: ["telephony_provider_id"]
            isOneToOne: false
            referencedRelation: "workspace_telephony_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tool_executions: {
        Row: {
          conversation_id: string
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          input: Json | null
          invocation_path: string | null
          message_id: string | null
          output: Json | null
          success: boolean
          tool_id: string
          tool_type: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input?: Json | null
          invocation_path?: string | null
          message_id?: string | null
          output?: Json | null
          success: boolean
          tool_id: string
          tool_type: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input?: Json | null
          invocation_path?: string | null
          message_id?: string | null
          output?: Json | null
          success?: boolean
          tool_id?: string
          tool_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_executions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_executions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_executions_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "agent_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      turn_signals: {
        Row: {
          conversation_id: string
          created_at: string
          entities: Json | null
          id: string
          intent: string | null
          message_id: string | null
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
          tier: Database["public"]["Enums"]["signal_tier_type"]
          topic: string | null
          urgency: Database["public"]["Enums"]["urgency_type"]
        }
        Insert: {
          conversation_id: string
          created_at?: string
          entities?: Json | null
          id?: string
          intent?: string | null
          message_id?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          tier: Database["public"]["Enums"]["signal_tier_type"]
          topic?: string | null
          urgency?: Database["public"]["Enums"]["urgency_type"]
        }
        Update: {
          conversation_id?: string
          created_at?: string
          entities?: Json | null
          id?: string
          intent?: string | null
          message_id?: string | null
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          tier?: Database["public"]["Enums"]["signal_tier_type"]
          topic?: string | null
          urgency?: Database["public"]["Enums"]["urgency_type"]
        }
        Relationships: [
          {
            foreignKeyName: "turn_signals_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turn_signals_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_telephony_providers: {
        Row: {
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          is_verified: boolean
          provider: string
          provider_type: Database["public"]["Enums"]["telephony_provider_type"]
          vault_secret_id: string | null
          verified_at: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          provider: string
          provider_type: Database["public"]["Enums"]["telephony_provider_type"]
          vault_secret_id?: string | null
          verified_at?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          provider?: string
          provider_type?: Database["public"]["Enums"]["telephony_provider_type"]
          vault_secret_id?: string | null
          verified_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_telephony_providers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          business_name: string | null
          created_at: string
          id: string
          industry: string | null
          name: string
          owner_id: string
          size: Database["public"]["Enums"]["workspace_size"] | null
          status: Database["public"]["Enums"]["workspace_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          owner_id: string
          size?: Database["public"]["Enums"]["workspace_size"] | null
          status?: Database["public"]["Enums"]["workspace_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          business_name?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          owner_id?: string
          size?: Database["public"]["Enums"]["workspace_size"] | null
          status?: Database["public"]["Enums"]["workspace_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hybrid_search: {
        Args: {
          kb_ids: string[]
          keyword_weight?: number
          match_count?: number
          query_embedding: string
          query_text: string
          vector_weight?: number
        }
        Returns: {
          content: string
          id: string
          kb_id: string
          similarity: number
        }[]
      }
      my_workspace_id: { Args: never; Returns: string }
    }
    Enums: {
      account_type: "individual" | "business"
      agent_status: "active" | "inactive" | "suspended"
      agent_tool_type:
        | "booking"
        | "call_transfer"
        | "send_sms"
        | "custom_webhook"
      conv_channel: "twilio" | "text_api" | "websocket"
      conv_outcome:
        | "resolved"
        | "unresolved"
        | "transferred"
        | "booked"
        | "hung_up"
      conv_status: "active" | "completed" | "failed"
      index_status_type: "unindexed" | "indexing" | "indexed" | "error"
      kb_doc_status: "processing" | "ready" | "error"
      kb_doc_type: "pdf" | "docx" | "txt" | "plain_text"
      message_role: "user" | "assistant"
      number_type: "platform" | "own"
      rag_status_type: "pending" | "indexed" | "error"
      sentiment_type: "positive" | "neutral" | "negative" | "frustrated"
      signal_tier_type: "rule_based" | "llm"
      telephony_provider_type: "platform" | "own"
      urgency_type: "low" | "medium" | "high"
      workspace_size: "xs" | "sm" | "md" | "lg" | "xl"
      workspace_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["individual", "business"],
      agent_status: ["active", "inactive", "suspended"],
      agent_tool_type: [
        "booking",
        "call_transfer",
        "send_sms",
        "custom_webhook",
      ],
      conv_channel: ["twilio", "text_api", "websocket"],
      conv_outcome: [
        "resolved",
        "unresolved",
        "transferred",
        "booked",
        "hung_up",
      ],
      conv_status: ["active", "completed", "failed"],
      index_status_type: ["unindexed", "indexing", "indexed", "error"],
      kb_doc_status: ["processing", "ready", "error"],
      kb_doc_type: ["pdf", "docx", "txt", "plain_text"],
      message_role: ["user", "assistant"],
      number_type: ["platform", "own"],
      rag_status_type: ["pending", "indexed", "error"],
      sentiment_type: ["positive", "neutral", "negative", "frustrated"],
      signal_tier_type: ["rule_based", "llm"],
      telephony_provider_type: ["platform", "own"],
      urgency_type: ["low", "medium", "high"],
      workspace_size: ["xs", "sm", "md", "lg", "xl"],
      workspace_status: ["active", "inactive", "suspended"],
    },
  },
} as const
