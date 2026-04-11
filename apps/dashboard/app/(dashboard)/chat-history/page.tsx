'use client'

import React from 'react'
import { ConversationHistoryView } from '../components/history/conversation-history-view'

export default function ChatHistoryPage() {
  return <ConversationHistoryView mode="chat" title="Chat History" subtitle="Monitor" />
}
