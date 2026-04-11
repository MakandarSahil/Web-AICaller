'use client'

import React from 'react'
import { ConversationHistoryView } from '../components/history/conversation-history-view'

export default function CallHistoryPage() {
  return <ConversationHistoryView mode="voice" title="Call History" subtitle="Monitor" />
}