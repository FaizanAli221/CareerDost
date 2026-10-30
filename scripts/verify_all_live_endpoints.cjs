const endpoints = [
  { url: 'https://careerdost.blog/', expect: 200, check: 'CareerDost' },
  { url: 'https://careerdost.blog/about', expect: 200, check: 'Faizan Ali' },
  { url: 'https://careerdost.blog/contact', expect: 200, check: 'editor@careerdost.blog' },
  { url: 'https://careerdost.blog/category/career-guides', expect: 200, check: 'Career Guides' },
  { url: 'https://careerdost.blog/category/government-jobs', expect: 200, check: 'Government' },
  { url: 'https://careerdost.blog/jobs/spsc-exam-preparation-screening-challan-guide', expect: 200, check: 'SPSC' },
  { url: 'https://careerdost.blog/jobs/fpsc-online-application-challan-form-32a-guide', expect: 200, check: 'Challan Form 32-A' },
  { url: 'https://careerdost.blog/jobs/national-job-portal-njp-pakistan-application-guide', expect: 200, check: 'National Job Portal' },
  { url: 'https://careerdost.blog/jobs/comsats-university-jobs-faculty-staff-2026', expect: 200, check: 'COMSATS University' },
  { url: 'https://careerdost.blog/jobs/punjab-university-jobs-faculty-staff-2026', expect: 200, check: 'University of the Punjab' },
  { url: 'https://careerdost.blog/jobs/chevening-scholarship-2027-28-pakistan', expect: 200, check: 'Chevening Scholarship' },
  { url: 'https://careerdost.blog/jobs/devsinc-remote-qa-engineer', expect: 200, check: 'Devsinc' },
  { url: 'https://careerdost.blog/daily-updates/fpsc-consolidated-advertisement-09-2026-announced', expect: 200, check: 'FPSC Consolidated Advertisement' },
  { url: 'https://careerdost.blog/daily-updates/comsats-university-jobs-faculty-staff-2026', expect: 301, checkRedirect: '/jobs/comsats-university-jobs-faculty-staff-2026' }
];

async function verifyAll() {
  console.log('=== RUNNING COMPREHENSIVE LIVE ENDPOINT VERIFICATION ===\n');

  let passed = 0;
  for (const ep of endpoints) {
    const t0 = Date.now();
    try {
      const res = await fetch(ep.url, { redirect: 'manual' });
      const elapsed = Date.now() - t0;

      if (ep.expect === 301) {
        const loc = res.headers.get('location') || '';
        const isOk = res.status === 301 && loc.includes(ep.checkRedirect);
        console.log(`[${isOk ? 'PASS' : 'FAIL'}] ${ep.url} -> HTTP ${res.status} (${elapsed}ms) Redirect to: ${loc}`);
        if (isOk) passed++;
      } else {
        const text = await res.text();
        const hasCheck = ep.check ? text.includes(ep.check) : true;
        const isOk = res.status === ep.expect && hasCheck;
        console.log(`[${isOk ? 'PASS' : 'FAIL'}] ${ep.url} -> HTTP ${res.status} (${elapsed}ms) Contains "${ep.check}": ${hasCheck}`);
        if (isOk) passed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${ep.url} -> ${err.message}`);
    }
  }

  console.log(`\nVerification Score: ${passed}/${endpoints.length} endpoints passed.`);
}

verifyAll();
