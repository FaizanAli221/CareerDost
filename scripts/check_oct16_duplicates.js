import Database from 'better-sqlite3'
import { listings } from '../src/data/listings.js'

const db = new Database('careerdost.sqlite')
const terms = ['10pearls', 'shine', 'mcb', 'infosec', 'alfalah', 'sessi', 'ignite', 'un-women', 'un women', 'kp-gov', 'project-associate']

console.log('=== Checking SQLite articles table ===')
for (const t of terms) {
  const rows = db.prepare('SELECT id, slug, title, category_slug, status, last_date, publish_date FROM articles WHERE slug LIKE ? OR title LIKE ?').all(`%${t}%`, `%${t}%`)
  if (rows.length > 0) {
    console.log(`Term: ${t} (${rows.length} results)`)
    for (const r of rows) {
      console.log(`  [${r.id}] ${r.slug} | ${r.title} | ${r.status} | Deadline: ${r.last_date} | Pub: ${r.publish_date}`)
    }
  }
}

console.log('\n=== Checking listings.js ===')
for (const t of terms) {
  const matched = listings.filter(l => l.slug.includes(t) || l.title.toLowerCase().includes(t))
  if (matched.length > 0) {
    console.log(`Listings Term: ${t} (${matched.length} results)`)
    for (const m of matched) {
      console.log(`  ${m.slug} | ${m.title} | Deadline: ${m.lastDate} | Pub: ${m.publishDate}`)
    }
  }
}
