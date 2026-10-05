import Database from 'better-sqlite3'
import path from 'path'
import { seedDatabase } from '../server/seed.js'

const dbPath = path.resolve('careerdost.sqlite')
const sqlite = new Database(dbPath)

// Wrap better-sqlite3 in the D1-like interface that server/db.js uses
const db = {
  exec: async (sql) => sqlite.exec(sql),
  prepare: (sql) => ({
    bind: (...params) => ({
      all: async () => ({ results: sqlite.prepare(sql).all(...params) }),
      first: async () => sqlite.prepare(sql).get(...params),
      run: async () => {
        const info = sqlite.prepare(sql).run(...params)
        return { success: true, meta: { changes: info.changes, last_row_id: info.lastInsertRowid } }
      }
    }),
    all: async () => ({ results: sqlite.prepare(sql).all() }),
    first: async () => sqlite.prepare(sql).get(),
    run: async () => {
      const info = sqlite.prepare(sql).run()
      return { success: true, meta: { changes: info.changes, last_row_id: info.lastInsertRowid } }
    }
  })
}

await seedDatabase(db)
console.log('Successfully seeded local careerdost.sqlite database!')
