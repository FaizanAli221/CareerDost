const Database = require('better-sqlite3');
const db = new Database('careerdost.sqlite');

const rows = db.prepare("SELECT id, slug, title, category_slug, organization, last_date, no_deadline, content FROM articles WHERE status = 'published'").all();

const currentDate = new Date('2026-10-31');

const targets = [];

rows.forEach(r => {
  if (['career-guides', 'government-schemes', 'results'].includes(r.category_slug)) return;
  if (r.no_deadline) return;

  const d = new Date(r.last_date);
  if (isNaN(d.getTime()) || d >= currentDate) return;

  let c = r.content;
  try {
    const p = JSON.parse(c);
    c = Array.isArray(p) ? p.join('\n\n') : c;
  } catch {}

  const hasClosed = /application (has closed|deadline passed|closed|expired)|recruitment (closed|completed)|status:\s*closed|status notice/i.test(c);
  if (!hasClosed) {
    targets.push({ id: r.id, slug: r.slug, title: r.title, cat: r.category_slug, org: r.organization || 'Hiring Department', lastDate: r.last_date });
  }
});

console.log('Total published expired articles needing closed notice:', targets.length);
targets.forEach((t, i) => {
  console.log(`${i + 1}. [${t.cat}] ${t.slug} (Deadline: ${t.lastDate}, Org: ${t.org})`);
});
