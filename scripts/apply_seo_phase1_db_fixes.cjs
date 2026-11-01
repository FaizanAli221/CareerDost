const Database = require('better-sqlite3');
const fs = require('fs');

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml';
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query';

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8');
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  return tokenMatch ? tokenMatch[1] : null;
}

async function queryD1(sql, params = []) {
  const token = getToken();
  const res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params })
  });
  const data = await res.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  return data.result[0];
}

async function applyFixes() {
  console.log('=== APPLYING DATABASE FIXES TO LOCAL SQLITE & REMOTE D1 ===\n');

  const localDb = new Database('careerdost.sqlite');

  // Statements to run
  const stmts = [
    // 1. Broken 4xx links
    {
      desc: 'Fix MOFA article broken links to NEPRA & Cabinet Division',
      sql: `UPDATE articles SET content = replace(replace(content, '/jobs/nepra-support-staff-jobs-2026', '/jobs/nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider'), '/jobs/cabinet-division-driver-jobs-bps-04-2026', '/jobs/cabinet-division-staff-car-driver-jobs-bps-04-2026') WHERE slug = 'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online';`
    },
    {
      desc: 'Fix Askari Bank update broken link to Meezan Bank',
      sql: `UPDATE daily_updates SET content = replace(content, '/jobs/meezan-bank-jobs-october-2026', '/jobs/meezan-bank-transaction-associates-batch-01-jobs-2026') WHERE slug = 'askari-bank-jobs-october-2026-karachi';`
    },

    // 2. Internal 3xx redirecting links (target specific slugs to avoid D1 LIKE pattern complexity error)
    {
      desc: 'Replace redirecting pink-scooty link in articles (PM Chromebooks & Danish Schools)',
      sql: `UPDATE articles SET content = replace(content, '/jobs/sindh-pink-scooty-scheme-2026-online-registration-eligibility', '/jobs/sindh-govt-electric-scooty-scheme-2026-women') WHERE slug IN ('pm-youth-chromebooks-scheme-2026-eligibility-registration', 'danish-schools-expansion-sindh-2026');`
    },
    {
      desc: 'Replace redirecting pink-scooty link in daily_updates (Sindh Mamta Programme)',
      sql: `UPDATE daily_updates SET content = replace(content, '/jobs/sindh-pink-scooty-scheme-2026-online-registration-eligibility', '/jobs/sindh-govt-electric-scooty-scheme-2026-women') WHERE slug = 'sindh-mamta-programme-2026-october-dashboard';`
    },

    // 3. Duplicate Page Titles
    {
      desc: 'Set unique title for Ministry of Planning October 2026',
      sql: `UPDATE articles SET seo_title = 'Ministry of Planning Jobs October 2026: Project Directors & Specialists — CareerDost' WHERE slug = 'ministry-of-planning-jobs-october-2026';`
    },
    {
      desc: 'Set unique title for Ministry of Planning Accountant 2026',
      sql: `UPDATE articles SET seo_title = 'Ministry of Planning Jobs 2026: Accountant & APS (PPS-6) — CareerDost' WHERE slug = 'ministry-of-planning-jobs-2026-accountant-aps-pps-6';`
    },
    {
      desc: 'Set unique title for Engineering Development Board October 2026',
      sql: `UPDATE articles SET seo_title = 'Engineering Development Board (EDB) Jobs October 2026: GM & Management — CareerDost' WHERE slug = 'engineering-development-board-jobs-october-2026';`
    },
    {
      desc: 'Set unique title for Engineering Development Board Engineers 2026',
      sql: `UPDATE articles SET seo_title = 'Engineering Development Board Jobs 2026: Engineers & Technical Staff — CareerDost' WHERE slug = 'engineering-development-board-jobs-2026';`
    }
  ];

  for (const item of stmts) {
    console.log(`Executing: ${item.desc}...`);
    // Local SQLite
    localDb.exec(item.sql);

    // Remote D1
    const res = await queryD1(item.sql);
    console.log(`  -> Done. Changes in D1: ${res.meta.changes}`);
  }

  console.log('\nAll database fixes applied successfully to both SQLite and remote D1!');
}

applyFixes().catch(err => {
  console.error('Error applying fixes:', err);
  process.exit(1);
});
