import fs from 'fs'
import Database from 'better-sqlite3'

const toml = fs.readFileSync('C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml', 'utf8')
const token = toml.match(/oauth_token\s*=\s*"([^"]+)"/)[1]
const d1Url = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query'

async function queryD1(sql, params = []) {
  const res = await fetch(d1Url, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params })
  })
  const json = await res.json()
  return json.result[0]
}

const idMapArticles = [
  { slug: 'chevening-scholarship-2027-28-pakistan', id: 305 },
  { slug: 'hec-jobs-2026', id: 304 },
  { slug: 'habib-university-admissions-2027', id: 303 },
  { slug: 'swiss-government-excellence-scholarships-2027-pakistan', id: 302 },
  { slug: 'hec-outstanding-research-awards-2026-27', id: 301 }
]

const idMapUpdates = [
  { slug: 'chevening-scholarship-2027-28-pakistan', id: 205 },
  { slug: 'hec-jobs-2026', id: 204 },
  { slug: 'habib-university-admissions-2027', id: 203 },
  { slug: 'swiss-government-excellence-scholarships-2027-pakistan', id: 202 },
  { slug: 'hec-outstanding-research-awards-2026-27', id: 201 }
]

// 1. Update remote D1
for (const item of idMapArticles) {
  await queryD1('UPDATE articles SET id = ? WHERE slug = ?', [item.id, item.slug])
}
for (const item of idMapUpdates) {
  await queryD1('UPDATE daily_updates SET id = ? WHERE slug = ?', [item.id, item.slug])
}

console.log('Remote D1 priority IDs updated!')

// Verify remote D1
const resArt = await queryD1('SELECT id, slug, title FROM articles ORDER BY publish_date DESC, id DESC LIMIT 5')
console.log('Top 5 Remote D1 Articles:')
console.log(resArt.results)

const resUpd = await queryD1('SELECT id, slug, title FROM daily_updates ORDER BY publish_date DESC, id DESC LIMIT 5')
console.log('Top 5 Remote D1 Daily Updates:')
console.log(resUpd.results)

// 2. Update local SQLite
const sqlite = new Database('careerdost.sqlite')
for (const item of idMapArticles) {
  sqlite.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(item.id, item.slug)
}
for (const item of idMapUpdates) {
  sqlite.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(item.id, item.slug)
}
console.log('Local SQLite priority IDs updated!')
