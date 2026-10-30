const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');
console.log('Categories:', db.prepare('SELECT id, label, slug FROM categories').all());
