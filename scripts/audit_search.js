import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const ROOT_DIR = process.cwd();
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git', '.wrangler']);

const PATTERNS = [
  /careerdost\.pages\.dev/gi,
  /www\.careerdost\.pages\.dev/gi,
  /careerdost\.pk/gi,
  /careersdost\.pk/gi,
  /careersdost/gi,
  /carrerdost/gi,
  /carrerdost/gi,
  /career-dost/gi,
  /career\s+dost/gi,
];

console.log('--- AUDITING CODEBASE FILES ---');
function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile()) {
      if (entry.name === 'careerdost.sqlite' || entry.name === 'careerdost.sqlite-shm' || entry.name === 'careerdost.sqlite-wal') {
        continue;
      }
      if (entry.name === 'package-lock.json') continue; // lockfile
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          for (const pat of PATTERNS) {
            const matches = line.match(pat);
            if (matches) {
              console.log(`[FILE] ${relPath}:${idx + 1} -> matched "${matches[0]}" in: ${line.trim().substring(0, 140)}`);
            }
          }
        });
      } catch (err) {
        // Binary or unreadable file
      }
    }
  }
}

scanDir(ROOT_DIR);

console.log('\n--- AUDITING SQLITE DATABASE (careerdost.sqlite) ---');
try {
  const db = new Database(path.join(ROOT_DIR, 'careerdost.sqlite'), { readonly: true });
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
  for (const { name: tableName } of tables) {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
    for (const row of rows) {
      for (const col of columns) {
        const val = row[col.name];
        if (typeof val === 'string') {
          for (const pat of PATTERNS) {
            const matches = val.match(pat);
            if (matches) {
              console.log(`[DB table=${tableName} id=${row.id || row.slug || '?'} col=${col.name}] matched "${matches[0]}" -> text snippet: ${val.substring(0, 100).replace(/\n/g, ' ')}`);
            }
          }
        }
      }
    }
  }
} catch (err) {
  console.error('SQLite audit error:', err.message);
}
