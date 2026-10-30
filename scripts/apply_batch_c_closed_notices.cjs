const fs = require('fs');
const Database = require('better-sqlite3');
const localDb = new Database('careerdost.sqlite');
const crypto = require('crypto');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

const env = fs.readFileSync('.env.local', 'utf8');
const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

function isHttpUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

function formatDate(dStr) {
  if (!dStr) return 'October 2026';
  const clean = String(dStr).split(' ')[0].split('T')[0];
  const d = new Date(clean + 'T00:00:00');
  if (isNaN(d.getTime())) return dStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function generateNotice(item) {
  const org = item.organization || item.org || 'Hiring Department';
  const dateFormatted = formatDate(item.last_date || item.lastDate);

  if (item.category_slug === 'admissions' || item.category === 'admissions') {
    return `> [!NOTE]\n> **Admissions Status Notice (Intake Concluded):**\n> - **Institution:** ${org}.\n> - **Application Deadline:** The admission deadline for this cycle closed on **${dateFormatted}**.\n> - **Current Selection Status:** Entrance test evaluation, departmental merit lists, and fee voucher verification underway. Prospective candidates should review eligibility rules and past merit thresholds below for upcoming academic sessions.`;
  }

  if (item.category_slug === 'scholarships' || item.category === 'scholarships') {
    return `> [!NOTE]\n> **Scholarship Status Notice (Application Window Closed):**\n> - **Awarding Authority:** ${org}.\n> - **Closing Date:** Official online registrations closed on **${dateFormatted}**.\n> - **Selection Stage:** Candidate dossier scrutiny, aptitude test ranking, and interview shortlisting by the scholarship committee. Complete guidelines and criteria are maintained below for candidate reference.`;
  }

  if (item.category_slug === 'internships' || item.category === 'internships') {
    return `> [!NOTE]\n> **Internship Status Notice (Applications Closed):**\n> - **Host Organization:** ${org}.\n> - **Application Deadline:** The application window closed on **${dateFormatted}**.\n> - **Placement Stage:** Candidate profile screening and placement interview scheduling. Program specifications and eligibility requirements are preserved below for reference and future cycles.`;
  }

  return `> [!NOTE]\n> **Recruitment Status Notice (Application Window Closed):**\n> - **Hiring Authority:** ${org}.\n> - **Closing Date:** Online applications closed on **${dateFormatted}**.\n> - **Current Selection Stage:** Scrutiny of applicant profiles, screening test scheduling, or interview shortlisting by the recruitment committee. Historical eligibility criteria, syllabus details, and job descriptions are preserved below for candidate reference.`;
}

async function applyBatchC() {
  console.log('=== STARTING PRIORITY C: EXPIRED ARTICLES CLOSED NOTICES ===');
  console.log('Fetching live articles from D1...');

  const resAll = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!resAll.ok) throw new Error(`Failed to fetch articles: ${resAll.status}`);
  const allArticles = (await resAll.json()).data;
  console.log(`Live articles count: ${allArticles.length}`);

  const currentDate = new Date('2026-10-31');
  const targetArticles = [];

  for (const art of allArticles) {
    if (['career-guides', 'government-schemes', 'results'].includes(art.category)) continue;
    if (art.noDeadline || art.no_deadline) continue;

    const deadline = art.lastDate || art.last_date;
    const d = new Date(deadline);
    if (isNaN(d.getTime()) || d >= currentDate) continue;

    let contentStr = '';
    if (Array.isArray(art.content)) contentStr = art.content.join('\n\n');
    else contentStr = String(art.content || '');

    const hasClosed = /application (has closed|deadline passed|closed|expired)|recruitment (closed|completed)|status:\s*closed|status notice/i.test(contentStr);
    if (!hasClosed) {
      targetArticles.push(art);
    }
  }

  console.log(`Identified ${targetArticles.length} expired articles needing closed notice.\n`);

  let successCount = 0;

  for (const existing of targetArticles) {
    const notice = generateNotice(existing);
    let updatedContent;
    if (Array.isArray(existing.content)) {
      updatedContent = [notice, ...existing.content];
    } else {
      updatedContent = [notice, String(existing.content || '')];
    }

    const officialUrl = isHttpUrl(existing.officialLink) ? existing.officialLink : (isHttpUrl(existing.official_link) ? existing.official_link : 'https://careerdost.blog');
    const applyUrl = isHttpUrl(existing.applyLink) ? existing.applyLink : (isHttpUrl(existing.apply_link) ? existing.apply_link : officialUrl);

    const payload = {
      ...existing,
      content: updatedContent,
      category: existing.category || existing.category_slug || 'government-jobs',
      officialLink: officialUrl,
      applyLink: applyUrl,
      status: 'published'
    };

    console.log(`Updating [${existing.slug}] ...`);

    const putRes = await fetch(`https://careerdost.blog/api/admin/articles/${existing.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    const json = await putRes.json();
    if (!putRes.ok || !json.success) {
      console.error(`FAILED to update ${existing.slug}:`, json);
      continue;
    }

    // Update local SQLite
    localDb.prepare(`
      UPDATE articles SET
        content = ?,
        official_link = ?,
        apply_link = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(
      JSON.stringify(updatedContent),
      officialUrl,
      applyUrl,
      existing.slug
    );

    successCount++;
    console.log(`  -> SUCCESS [${successCount}/${targetArticles.length}]: D1 + SQLite updated for ${existing.slug}`);
  }

  console.log(`\n=== PRIORITY C COMPLETE: ${successCount} articles updated with closed notices ===`);
}

applyBatchC().catch(err => {
  console.error('Fatal error in applyBatchC:', err);
  process.exit(1);
});
