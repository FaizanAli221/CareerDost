import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('careerdost.sqlite');

console.log('Columns in articles:', db.prepare("PRAGMA table_info(articles)").all().map(c => c.name));
console.log('Columns in daily_updates:', db.prepare("PRAGMA table_info(daily_updates)").all().map(c => c.name));

const articles = db.prepare(`SELECT * FROM articles`).all();
console.log(`\nTotal articles in DB: ${articles.length}`);
for (const a of articles) {
  console.log(`[${a.id}] ${a.slug} | Cat: ${a.category_slug} | Org: ${a.organization} | LastDate: ${a.last_date}`);
}

const updates = db.prepare(`SELECT * FROM daily_updates`).all();
console.log(`\nTotal updates in DB: ${updates.length}`);
for (const u of updates) {
  console.log(`[${u.id}] ${u.slug} | Cat: ${u.category} | Org: ${u.organization} | Deadline: ${u.deadline}`);
}
