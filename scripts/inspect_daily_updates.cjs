const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const rows = db.prepare('SELECT id, slug, title, category, publish_date, length(content) as content_len, content, official_link FROM daily_updates ORDER BY id DESC').all();
console.log('Total daily updates in SQLite:', rows.length);

const shortUpdates = [];
rows.forEach(r => {
  let text = r.content || '';
  if (Array.isArray(text)) text = text.join('\n\n');
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 120 || !r.official_link) {
    shortUpdates.push({ id: r.id, slug: r.slug, title: r.title, words, hasSource: Boolean(r.official_link) });
  }
});

console.log('Daily updates with <120 words or missing official_link:', shortUpdates.length);
shortUpdates.slice(0, 15).forEach(u => console.log(u));
