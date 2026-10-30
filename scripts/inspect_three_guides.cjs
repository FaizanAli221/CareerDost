const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const slugs = [
  'spsc-exam-preparation-screening-challan-guide',
  'fpsc-online-application-challan-form-32a-guide',
  'national-job-portal-njp-pakistan-application-guide'
];

slugs.forEach(slug => {
  const g = db.prepare('SELECT id, title, slug, content, official_link, apply_link FROM articles WHERE slug = ?').get(slug);
  console.log('====================================================');
  console.log(`GUIDE [ID ${g.id}]: ${g.title}`);
  console.log(`Slug: ${g.slug}`);
  console.log(`Official Link: ${g.official_link}`);
  console.log(`Apply Link: ${g.apply_link}`);
  console.log('CONTENT:\n', g.content);
  console.log('\n');
});
