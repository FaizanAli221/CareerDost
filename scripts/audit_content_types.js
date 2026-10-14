import Database from 'better-sqlite3';
import { listings } from '../src/data/listings.js';

const db = new Database('careerdost.sqlite');

const dbArticles = db.prepare('SELECT id, slug, title, category_slug, organization, job_type, qualification, positions, last_date, no_deadline FROM articles').all();
const dbUpdates = db.prepare('SELECT id, slug, title, category, organization, job_type, qualification, positions, deadline, no_deadline FROM daily_updates').all();

console.log(`listings.js count: ${listings.length}`);
console.log(`db articles count: ${dbArticles.length}`);
console.log(`db updates count: ${dbUpdates.length}`);

// Group by category
const catGroups = {};
for (const item of listings) {
  const cat = item.category || 'unknown';
  if (!catGroups[cat]) catGroups[cat] = [];
  catGroups[cat].push(item.slug);
}

console.log('\n--- Category breakdown in listings.js ---');
for (const [cat, items] of Object.entries(catGroups)) {
  console.log(`${cat}: ${items.length} items`);
}

// Check articles in government-schemes, admissions, results, career-guides, etc.
console.log('\n--- Non-job category articles in listings.js ---');
for (const item of listings) {
  if (['government-schemes', 'career-guides', 'results', 'admissions'].includes(item.category)) {
    console.log(`[${item.category}] ${item.slug} | Title: ${item.title.substring(0, 60)} | Qual: "${item.qualification || ''}" | Pos: "${item.positions || ''}" | LastDate: "${item.lastDate || ''}"`);
  }
}
