import Database from 'better-sqlite3';
import { listings } from '../src/data/listings.js';

const db = new Database('careerdost.sqlite');
const keywords = [
  'spsc', 'cce',
  'flood', 'sphf', 'eib',
  'ssgc', 'gasification', 'sanghar', 'shikarpur'
];

console.log('=== ARTICLES TABLE (careerdost.sqlite) ===');
keywords.forEach(kw => {
  const rows = db.prepare("SELECT id, slug, title, status, publish_date, last_date FROM articles WHERE slug LIKE ? OR title LIKE ?").all(`%${kw}%`, `%${kw}%`);
  console.log(`Keyword: "${kw}" (${rows.length})`);
  rows.forEach(r => console.log(`  [${r.id}] ${r.slug} | ${r.status} | ${r.publish_date} | ${r.last_date} | ${r.title}`));
});

console.log('\n=== DAILY UPDATES TABLE (careerdost.sqlite) ===');
keywords.forEach(kw => {
  const rows = db.prepare("SELECT id, slug, title, status, publish_date, deadline FROM daily_updates WHERE slug LIKE ? OR title LIKE ?").all(`%${kw}%`, `%${kw}%`);
  console.log(`Keyword: "${kw}" (${rows.length})`);
  rows.forEach(r => console.log(`  [${r.id}] ${r.slug} | ${r.status} | ${r.publish_date} | ${r.deadline} | ${r.title}`));
});

console.log('\n=== LISTINGS.JS ===');
keywords.forEach(kw => {
  const found = listings.filter(item => (item.slug + ' ' + item.title + ' ' + (item.organization || '')).toLowerCase().includes(kw));
  console.log(`Keyword: "${kw}" (${found.length})`);
  found.forEach(m => console.log(`  [${m.id}] ${m.slug} | ${m.publishDate} | ${m.lastDate} | ${m.title}`));
});
