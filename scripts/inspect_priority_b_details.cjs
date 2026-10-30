const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const items = JSON.parse(fs.readFileSync('scripts/classified_articles_inventory.json', 'utf8'));
const needsImp = items.filter(it => it.classification === 'NEEDS_IMPROVEMENT');

console.log('Inspecting 41 NEEDS_IMPROVEMENT articles by SLUG in local SQLite:\n');

needsImp.forEach((it, idx) => {
  const row = db.prepare('SELECT id, slug, title, category_slug, last_date, content, official_link, apply_link FROM articles WHERE slug = ?').get(it.slug);
  if (!row) {
    console.log(`[MISSING IN DB] ${it.slug}`);
    return;
  }
  let content = row.content;
  if (Array.isArray(content)) content = content.join('\n\n');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  console.log(`${idx + 1}. [${row.category_slug}] ${row.slug} | Words: ${wordCount} | Deadline: ${row.last_date || 'None'}`);
});
