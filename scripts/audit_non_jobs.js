import Database from 'better-sqlite3';

const db = new Database('careerdost.sqlite');

console.log('--- ALL UNIQUE CATEGORIES IN DB ARTICLES ---');
const artCats = db.prepare('SELECT DISTINCT category_slug, count(*) as count FROM articles GROUP BY category_slug').all();
console.log(artCats);

console.log('--- ALL UNIQUE CATEGORIES IN DB UPDATES ---');
const updCats = db.prepare('SELECT DISTINCT category, count(*) as count FROM daily_updates GROUP BY category').all();
console.log(updCats);

console.log('\n--- ARTICLES WITH NON-JOB SCHEMES / NOTIFICATIONS / GUIDES / RESULTS ---');
const nonJobArticles = db.prepare(`
  SELECT id, slug, title, category_slug, organization, job_type, qualification, positions, last_date, no_deadline, official_link, apply_link
  FROM articles 
  WHERE category_slug IN ('government-schemes', 'results', 'career-guides', 'admissions')
     OR slug LIKE '%wage%' 
     OR slug LIKE '%petrol%' 
     OR slug LIKE '%barcode%' 
     OR slug LIKE '%section-144%'
     OR slug LIKE '%wheat%'
`).all();
console.log(`Found ${nonJobArticles.length} non-job or policy/notification articles in articles table:`);
for (const a of nonJobArticles) {
  console.log(`[${a.category_slug}] ${a.slug} | ${a.title.substring(0, 50)} | JobType: ${a.job_type}`);
}

const nonJobUpdates = db.prepare(`
  SELECT id, slug, title, category, organization, job_type, qualification, positions, deadline, no_deadline, official_link, apply_link
  FROM daily_updates 
  WHERE category IN ('Government Schemes', 'Results', 'Results / Test Updates', 'Career Guides', 'Admissions', 'Career News')
     OR slug LIKE '%wage%' 
     OR slug LIKE '%petrol%' 
     OR slug LIKE '%barcode%' 
     OR slug LIKE '%section-144%'
     OR slug LIKE '%wheat%'
`).all();
console.log(`\nFound ${nonJobUpdates.length} non-job updates in daily_updates table:`);
for (const u of nonJobUpdates) {
  console.log(`[${u.category}] ${u.slug} | ${u.title.substring(0, 50)} | JobType: ${u.job_type}`);
}
