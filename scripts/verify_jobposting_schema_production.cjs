const chromeLauncher = require('chrome-launcher');
const http = require('http');

const TEST_PAGES = [
  {
    url: 'https://careerdost.blog/jobs/punjab-ophthalmology-college-jobs-2026',
    expectedSchemaType: 'JobPosting',
    label: 'GSC Affected Job Page 1 (Punjab Ophthalmology College Jobs 2026)',
  },
  {
    url: 'https://careerdost.blog/jobs/lums-nano-physics-research-associate-jobs-2026',
    expectedSchemaType: 'JobPosting',
    label: 'GSC Affected Job Page 2 (LUMS Nano Physics Research Associate Jobs 2026)',
  },
  {
    url: 'https://careerdost.blog/jobs/sindh-job-portal-2026-junior-clerk-jobs',
    expectedSchemaType: 'Article',
    label: 'Portal Guide Excluded from JobPosting (Sindh Job Portal Guide)',
  },
  {
    url: 'https://careerdost.blog/jobs/bank-alfalah-jobs-internships-2026',
    expectedSchemaType: 'Article',
    label: 'Multi-Track Career Guide Excluded from JobPosting (Bank Alfalah Guide)',
  },
  {
    url: 'https://careerdost.blog/jobs/security-papers-jobs-2026',
    expectedSchemaType: 'JobPosting',
    label: 'Official Numeric Salary Job Page (Security Papers Limited Jobs 2026)',
  },
  {
    url: 'https://careerdost.blog/jobs/10pearls-shine-virtual-internship-2026',
    expectedSchemaType: 'JobPosting',
    label: 'Remote Virtual Internship Page (10Pearls SHINE Internship 2026)',
  },
  {
    url: 'https://careerdost.blog/jobs/electricity-bills-november-2026-rs256-fuel-adjustment-explained',
    expectedSchemaType: 'Article',
    label: 'Public Advisory / Scheme Page (Electricity Bills November 2026)',
  },
  {
    url: 'https://careerdost.blog/category/government-jobs',
    expectedSchemaType: 'BreadcrumbList',
    label: 'Category Page (Government Jobs)',
  },
];

function validateGoogleJobPosting(jp) {
  const errors = [];
  const warnings = [];

  // Required fields per Google JobPosting Rich Results spec
  if (!jp.title) errors.push('Missing required field "title"');
  if (!jp.description) errors.push('Missing required field "description"');
  if (!jp.datePosted || !/^\d{4}-\d{2}-\d{2}/.test(jp.datePosted)) {
    errors.push('Missing or invalid required field "datePosted"');
  }
  if (!jp.hiringOrganization || !jp.hiringOrganization.name) {
    errors.push('Missing required field "hiringOrganization.name"');
  }
  if (!jp.jobLocation && jp.jobLocationType !== 'TELECOMMUTE') {
    errors.push('Missing required field "jobLocation"');
  }

  // Optional fields per Google JobPosting Rich Results spec
  if (!jp.employmentType) {
    warnings.push('Missing optional field "employmentType"');
  }
  if (!jp.validThrough) {
    warnings.push('Missing optional field "validThrough"');
  } else if (!/^\d{4}-\d{2}-\d{2}/.test(jp.validThrough)) {
    warnings.push(`Invalid ISO-8601 datetime in "validThrough": "${jp.validThrough}"`);
  }

  const addr = jp.jobLocation?.address || {};
  if (!addr.streetAddress) warnings.push('Missing optional field "streetAddress" (in "jobLocation.address")');
  if (!addr.addressLocality) warnings.push('Missing optional field "addressLocality" (in "jobLocation.address")');
  if (!addr.addressRegion) warnings.push('Missing optional field "addressRegion" (in "jobLocation.address")');
  if (!addr.postalCode) warnings.push('Missing optional field "postalCode" (in "jobLocation.address")');
  if (!addr.addressCountry) errors.push('Missing required field "addressCountry" (in "jobLocation.address")');

  if (!jp.baseSalary) {
    warnings.push('Missing optional field "baseSalary"');
  } else {
    const val = jp.baseSalary.value || {};
    const hasNumeric =
      typeof val.value === 'number' ||
      (typeof val.minValue === 'number' && typeof val.maxValue === 'number');
    if (!hasNumeric) {
      warnings.push('Non-numeric value in "baseSalary.value"');
    }
    if (!['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'].includes(val.unitText)) {
      warnings.push('Missing or invalid "unitText" (in "baseSalary.value")');
    }
  }

  return { errors, warnings };
}

async function run() {
  console.log('=== 1. Verifying Live Production Edge SSR JSON-LD ===');
  for (const item of TEST_PAGES) {
    const res = await fetch(item.url);
    const html = await res.text();
    const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
      JSON.parse(m[1])
    );

    const allNodes = [];
    for (const s of scripts) {
      if (Array.isArray(s['@graph'])) allNodes.push(...s['@graph']);
      else allNodes.push(s);
    }

    const jobNodes = allNodes.filter((n) => n['@type'] === 'JobPosting');
    const articleNodes = allNodes.filter((n) => n['@type'] === 'Article');

    console.log(`\n[${res.status}] ${item.label}`);
    console.log(`  URL: ${item.url}`);
    if (item.expectedSchemaType === 'JobPosting') {
      if (jobNodes.length !== 1) {
        console.error(`  FAIL: Expected 1 JobPosting node, found ${jobNodes.length}`);
        process.exitCode = 1;
      } else {
        const jp = jobNodes[0];
        const { errors, warnings } = validateGoogleJobPosting(jp);
        console.log(`  PASS: Emits @type="JobPosting" (0 invalid errors, ${warnings.length} honest optional-field warnings)`);
        console.log(`  PostalAddress:`, JSON.stringify(jp.jobLocation?.address));
        console.log(`  baseSalary:`, jp.baseSalary ? JSON.stringify(jp.baseSalary) : '(omitted - not officially specified as numeric)');
        console.log(`  validThrough:`, jp.validThrough || '(omitted)');
        if (errors.length > 0) {
          console.error(`  ERRORS:`, errors);
          process.exitCode = 1;
        }
        console.log(`  Remaining Optional Warnings (${warnings.length}):`, warnings);
      }
    } else {
      if (jobNodes.length > 0) {
        console.error(`  FAIL: Non-job/guide page emitted JobPosting!`);
        process.exitCode = 1;
      } else {
        console.log(`  PASS: Does NOT emit JobPosting (emits ${articleNodes.length > 0 ? 'Article' : 'BreadcrumbList'})`);
      }
    }
  }

  console.log('\n=== 2. Verifying Client Hydration Parity via Headless Chrome ===');
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox'],
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });

  const getJson = (path) =>
    new Promise((resolve, reject) => {
      http
        .get({ host: '127.0.0.1', port: chrome.port, path }, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(JSON.parse(data)));
        })
        .on('error', reject);
    });

  try {
    const targets = await getJson('/json/list');
    const pageTarget = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });

    await new Promise((res) => (ws.onopen = res));
    await send('Page.enable');
    await send('Runtime.enable');

    for (const item of TEST_PAGES.slice(0, 4)) {
      await send('Page.navigate', { url: item.url });
      await new Promise((r) => setTimeout(r, 3500));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent));
          const nodes = scripts.flatMap(s => s['@graph'] || [s]);
          return {
            title: document.title,
            h1: document.querySelector('h1')?.innerText,
            types: nodes.map(n => n['@type']),
            jobPosting: nodes.find(n => n['@type'] === 'JobPosting') || null
          };
        })()`,
        returnByValue: true,
      });
      const val = evalRes.result.value;
      console.log(`\n[Hydrated DOM] ${item.url}`);
      console.log(`  H1: ${val.h1}`);
      console.log(`  Schema Types: ${val.types.join(', ')}`);
      if (val.jobPosting) {
        console.log(`  Hydrated JobPosting Address:`, JSON.stringify(val.jobPosting.jobLocation?.address));
      }
    }
  } finally {
    await chrome.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
