import Database from 'better-sqlite3';
import { oct22EditorialPackages, saveOct22EditorialPackages } from './save_oct22_editorial_packages.js';
import { syncOct22RemoteD1 } from './sync_oct22_remote_d1.js';

export async function publishOct22Packages() {
  console.log('=== PUBLISHING OCT 22 EDITORIAL PACKAGES IN CAREERDOST CMS ===\n');

  // 1. Update status to 'published' in local SQLite
  saveOct22EditorialPackages('published');

  // 2. Sync to remote Cloudflare D1 with status='published'
  await syncOct22RemoteD1('published');

  console.log('\nAll 3 packages marked as PUBLISHED in local SQLite and remote Cloudflare D1.');
}

if (process.argv[1] && process.argv[1].includes('publish_oct22_editorial_packages.js')) {
  publishOct22Packages().catch(err => {
    console.error('Error publishing packages:', err);
    process.exit(1);
  });
}
