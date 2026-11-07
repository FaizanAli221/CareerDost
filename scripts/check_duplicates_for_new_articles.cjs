const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

console.log('=== CHECKING FOR DUPLICATES & RELATED ARTICLES ===\n');

// 1. Sindh checks
const sindhArticles = db.prepare(`
  SELECT id, slug, title, category_slug, status 
  FROM articles 
  WHERE slug LIKE '%sindh%' OR title LIKE '%sindh%' OR slug LIKE '%internship%' OR title LIKE '%internship%'
`).all();
console.log('Sindh/Internship articles in articles table:');
console.table(sindhArticles);

// 2. KP checks
const kpArticles = db.prepare(`
  SELECT id, slug, title, category_slug, status 
  FROM articles 
  WHERE slug LIKE '%kp%' OR slug LIKE '%khyber%' OR title LIKE '%kp%' OR title LIKE '%khyber%' OR title LIKE '%internship%'
`).all();
console.log('\nKP / Internship articles in articles table:');
console.table(kpArticles);

// 3. Cambridge / Scholarship checks
const schArticles = db.prepare(`
  SELECT id, slug, title, category_slug, status 
  FROM articles 
  WHERE slug LIKE '%cambridge%' OR slug LIKE '%gates%' OR title LIKE '%cambridge%' OR title LIKE '%gates%' OR category_slug = 'scholarships'
`).all();
console.log('\nCambridge / Scholarship articles in articles table:');
console.table(schArticles);

// 4. Daily Updates checks
const dailyUpdates = db.prepare(`
  SELECT id, slug, title, category, status 
  FROM daily_updates 
  WHERE slug LIKE '%sindh%' OR slug LIKE '%kp%' OR slug LIKE '%cambridge%' OR slug LIKE '%gates%' OR slug LIKE '%internship%'
`).all();
console.log('\nMatching Daily Updates:');
console.table(dailyUpdates);

const kp = db.prepare('SELECT id, slug, title, category_slug, canonical_url FROM articles WHERE slug = ?').get('kp-government-project-associate-internship-2026') 
  || db.prepare('SELECT id, slug, title, category FROM daily_updates WHERE slug = ?').get('kp-government-project-associate-internship-2026');
console.log('KP Project Associate article:', kp);

const jds = db.prepare('SELECT id, slug, title, category_slug, canonical_url FROM articles WHERE slug = ?').get('japan-jds-scholarship-2026-pakistan')
  || db.prepare('SELECT id, slug, title, category FROM daily_updates WHERE slug = ?').get('japan-jds-scholarship-2026-pakistan');
console.log('Japan JDS article:', jds);
