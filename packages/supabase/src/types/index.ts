export type {
    Database,
    Json,
    Tables,
    TablesInsert,
    TablesUpdate,
    Enums,
  } from './database.types'

// Re-export common types (if they exist in database types)
export type { Database as DatabaseSchema } from './database.types'