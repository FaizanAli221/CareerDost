const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const items = JSON.parse(fs.readFileSync('scripts/classified_articles_inventory.json', 'utf8'));
const outdated = items.filter(it => it.classification === 'OUTDATED');

console.log('Classifying 61 OUTDATED articles by depth:');
const short = [];
const solid = [];

outdated.forEach(it => {
  const r = db.prepare('SELECT id, slug, title, category_slug, last_date, content FROM articles WHERE slug = ?').get(it.slug);
  if (!r) return;
  let c = r.content;
  try {
    const p = JSON.parse(c);
    c = Array.isArray(p) ? p.join('\n\n') : c;
  } catch {}
  const words = c.split(/\s+/).filter(Boolean).length;
  if (words < 600) {
    short.push({ id: r.id, slug: r.slug, title: r.title, words, lastDate: r.last_date, cat: r.category_slug });
  } else {
    solid.push({ id: r.id, slug: r.slug, title: r.title, words, lastDate: r.last_date, cat: r.category_slug });
  }
});

console.log(`Solid (>=600 words): ${solid.length}`);
console.log(`Short (<600 words): ${short.length}`);
console.log('\nShort expired articles:');
short.forEach(s => console.log(`ID ${s.id} | Cat: ${s.cat} | Words: ${s.words} | Deadline: ${s.lastDate} | ${s.slug}`));
