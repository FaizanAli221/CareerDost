const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const updates = db.prepare('SELECT id, slug, title, category, publish_date, content, official_link, apply_link FROM daily_updates ORDER BY id DESC').all();

console.log('Total daily updates:', updates.length);

const articleSlugs = new Set(db.prepare('SELECT slug FROM articles').all().map(r => r.slug));

let hasArticleCount = 0;
let standaloneCount = 0;
let shortStandalone = [];

updates.forEach(u => {
  const hasArticle = articleSlugs.has(u.slug);
  if (hasArticle) hasArticleCount++;
  else standaloneCount++;

  let text = u.content || '';
  if (Array.isArray(text)) text = text.join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;

  if (words < 120) {
    shortStandalone.push({ id: u.id, slug: u.slug, title: u.title, words, hasArticle, hasSource: Boolean(u.official_link) });
  }
});

console.log('Has corresponding full article:', hasArticleCount);
console.log('Standalone daily update (no matching article):', standaloneCount);
console.log('Short updates (<120 words):', shortStandalone.length);
console.log('\nBreakdown of short updates:');
shortStandalone.forEach(s => {
  console.log(`ID ${s.id} | Words: ${s.words} | HasArticle: ${s.hasArticle} | ${s.slug}`);
});
