import Database from 'better-sqlite3'

const db = new Database('careerdost.sqlite')
const queries = ['zarkhez', 'zarai', 'qarza', 'agricultural', 'worker', 'solar', 'housing', 'shsfd', 'sphf', 'ssep', 'hari']

console.log('--- Checking SQLite articles ---')
for (const q of queries) {
  const rows = db.prepare('SELECT id, slug, title, category_slug, status, publish_date FROM articles WHERE slug LIKE ? OR title LIKE ?').all(`%${q}%`, `%${q}%`)
  if (rows.length > 0) {
    console.log(`=== Query: ${q} (${rows.length} results) ===`)
    for (const r of rows) {
      console.log(`[${r.id}] ${r.slug} | ${r.title} | ${r.category_slug} | ${r.status} | ${r.publish_date}`)
    }
  }
}
