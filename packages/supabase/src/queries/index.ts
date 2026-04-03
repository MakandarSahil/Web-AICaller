/**
 * Query functions barrel export.
 *
 * Add exports here as new query files are created.
 * DO NOT import these directly in components — always go through hooks/.
 * Server Components may import directly for SSR fetches.
 *
 * Build order:
 *  Phase 1 (now): workspace, profile, agents
 *  Phase 2:       knowledge-bases, conversations, phone-numbers
 *  Phase 3:       api-keys, callers
 *  Phase 4:       (RAG queries — internal only, no UI)
 */
export * from './workspace'
export * from './profile'
export * from './agents'
export * from './knowledge-bases'
export * from './conversations'
export * from './kb-documents'
export * from './phone-numbers'
// export * from './phone-numbers'     // add when phone numbers page is built
// export * from './api-keys'          // add when API keys page is built
// export * from './callers'           // add when callers page is built