const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const rows = db.prepare("SELECT id, slug, title, category_slug, last_date, no_deadline, content, official_link FROM articles WHERE status = 'published'").all();

const shortArticles = [];

rows.forEach(r => {
  let c = r.content;
  try {
    const p = JSON.parse(c);
    c = Array.isArray(p) ? p.join('\n\n') : c;
  } catch {}
  const words = c.split(/\s+/).filter(Boolean).length;
  if (words < 400) {
    shortArticles.push({ id: r.id, slug: r.slug, title: r.title, words, cat: r.category_slug, lastDate: r.last_date });
  }
});

console.log('Published articles with < 400 words:', shortArticles.length);
shortArticles.forEach(s => console.log(`ID ${s.id} | Cat: ${s.cat} | Words: ${s.words} | ${s.slug}`));
