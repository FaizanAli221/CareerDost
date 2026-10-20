import fs from 'fs';
import path from 'path';
import { queryD1 } from './audit_d1_investigation.mjs';

async function backup() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve('backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  console.log('Backing up local SQLite database...');
  const localSqlite = path.resolve('careerdost.sqlite');
  const localBackup = path.join(backupDir, `careerdost_backup_${ts}.sqlite`);
  if (fs.existsSync(localSqlite)) {
    fs.copyFileSync(localSqlite, localBackup);
    console.log('Local SQLite backup created at:', localBackup);
  } else {
    console.log('Local SQLite not found at:', localSqlite);
  }

  console.log('Backing up Cloudflare D1 tables...');
  const articles = await queryD1('SELECT * FROM articles');
  const dailyUpdates = await queryD1('SELECT * FROM daily_updates');
  const d1BackupPath = path.join(backupDir, `d1_backup_${ts}.json`);
  fs.writeFileSync(d1BackupPath, JSON.stringify({ timestamp: ts, articles, dailyUpdates }, null, 2), 'utf8');
  console.log(`D1 backup created at: ${d1BackupPath} (${articles.length} articles, ${dailyUpdates.length} daily updates)`);
}

backup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
