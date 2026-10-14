import Database from 'better-sqlite3';
const db = new Database('careerdost.sqlite');

const a = db.prepare("SELECT * FROM articles WHERE slug LIKE '%minimum-wage%'").all();
console.log('Article in articles table:', a.length);
if (a.length > 0) {
  console.log(JSON.stringify(a[0], null, 2));
}

const u = db.prepare("SELECT * FROM daily_updates WHERE slug LIKE '%minimum-wage%'").all();
console.log('Update in daily_updates table:', u.length);
if (u.length > 0) {
  console.log(JSON.stringify(u[0], null, 2));
}
