const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const items = JSON.parse(fs.readFileSync('scripts/classified_articles_inventory.json', 'utf8'));
const outdated = items.filter(it => it.classification === 'OUTDATED');

console.log('Inspecting 61 OUTDATED articles in local SQLite:\n');

let alreadyHasClosedNotice = 0;
let needsNotice = 0;

outdated.forEach((it, idx) => {
  const row = db.prepare('SELECT id, slug, title, category_slug, last_date, content, official_link, apply_link FROM articles WHERE slug = ?').get(it.slug);
  if (!row) {
    console.log(`[MISSING] ${it.slug}`);
    return;
  }
  let content = row.content;
  if (Array.isArray(content)) content = content.join('\n\n');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  
  // Check if content already mentions closed / expired / archived
  const hasClosedBanner = /application (has closed|deadline passed|closed|expired)|recruitment (closed|completed)|status:\s*closed/i.test(content);
  if (hasClosedBanner) {
    alreadyHasClosedNotice++;
  } else {
    needsNotice++;
  }
  console.log(`${idx + 1}. [${row.category_slug}] ${row.slug} | Words: ${wordCount} | Deadline: ${row.last_date} | ClosedNotice: ${hasClosedBanner}`);
});

console.log(`\nSummary: Already has notice: ${alreadyHasClosedNotice}, Needs notice: ${needsNotice}`);
