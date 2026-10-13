const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');
console.log('Tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
const sampleArticles = db.prepare("SELECT slug, title, category_slug FROM articles LIMIT 5").all();
console.log('Sample articles:', sampleArticles);
const sampleUpdates = db.prepare("SELECT slug, title, category FROM daily_updates LIMIT 5").all();
console.log('Sample updates:', sampleUpdates);
const nums = db.prepare("SELECT slug, title, 'daily_updates' as src FROM daily_updates WHERE slug LIKE '%nums%' UNION SELECT slug, title, 'articles' as src FROM articles WHERE slug LIKE '%nums%'").all();
console.log('NUMS query:', nums);
