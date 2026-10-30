import Database from 'better-sqlite3';
import { oct21EditorialPackages, saveOct21EditorialPackages } from './save_oct21_editorial_packages.js';

export async function publishOct21Packages() {
  console.log('=== PUBLISHING OCT 21 EDITORIAL PACKAGES IN CAREERDOST CMS ===\n');

  // 1. Update status to 'published' in careerdost.sqlite
  await saveOct21EditorialPackages('published');

  console.log('\nAll 3 packages marked as PUBLISHED in local SQLite careerdost.sqlite.');
}

if (process.argv[1] && process.argv[1].includes('publish_oct21_editorial_packages.js')) {
  publishOct21Packages().catch(err => {
    console.error('Error publishing packages:', err);
    process.exit(1);
  });
}
