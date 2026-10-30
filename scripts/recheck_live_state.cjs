async function recheckLive() {
  console.log(`=== LIVE VERIFICATION RECHECK ===\nTimestamp: ${new Date().toISOString()}\n`);

  // 1. Sitemap checks
  const sitemapUrls = [
    'https://careerdost.blog/sitemap.xml',
    'https://careerdost.blog/api/sitemap.xml'
  ];

  for (const sUrl of sitemapUrls) {
    const t0 = Date.now();
    const res = await fetch(sUrl);
    const duration = Date.now() - t0;
    const text = await res.text();
    const count = (text.match(/<loc>/g) || []).length;
    const lastModifiedHeader = res.headers.get('last-modified') || res.headers.get('date') || 'N/A';
    const cfRay = res.headers.get('cf-ray') || 'N/A';
    console.log(`Endpoint: ${sUrl}`);
    console.log(`  HTTP Status:    ${res.status} ${res.statusText} (${duration}ms)`);
    console.log(`  URL Count:      ${count}`);
    console.log(`  Server Date:    ${lastModifiedHeader}`);
    console.log(`  CF-Ray:         ${cfRay}`);
    console.log(`  Contains 356:   ${text.includes('drap-medicine-barcode-requirements-2026')}`);
    console.log(`  Contains 515:   ${text.includes('spsc-cce-2026-examination-reforms-age-attempts-screening')}`);
    console.log(`  Contains 547:   ${text.includes('ministry-of-planning-jobs-2026-accountant-aps-pps-6')}`);
    console.log(`  Contains 523:   ${text.includes('ministry-of-planning-jobs-october-2026')}`);
    console.log(`  Contains 330:   ${text.includes('spsc-cce-2026-screening-test-date')}\n`);
  }

  // 2. Affected Public URLs
  const publicUrls = [
    { url: 'https://careerdost.blog/jobs/drap-medicine-barcode-requirements-2026', desc: 'Article 356 (Repaired, Published)' },
    { url: 'https://careerdost.blog/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening', desc: 'Article 515 (Reverted Draft)' },
    { url: 'https://careerdost.blog/daily-updates/spsc-cce-2026-examination-reforms-age-attempts-screening', desc: 'Update 386 (Companion Daily Update)' },
    { url: 'https://careerdost.blog/jobs/ministry-of-planning-jobs-2026-accountant-aps-pps-6', desc: 'Article 547 (Reverted Draft)' },
    { url: 'https://careerdost.blog/jobs/ministry-of-planning-jobs-october-2026', desc: 'Article 523 (Active Canonical)' },
    { url: 'https://careerdost.blog/jobs/spsc-cce-2026-screening-test-date', desc: 'Article 330 (Active Canonical)' }
  ];

  for (const item of publicUrls) {
    const t0 = Date.now();
    const res = await fetch(item.url, { redirect: 'manual' });
    const duration = Date.now() - t0;
    const loc = res.headers.get('location');
    const cfRay = res.headers.get('cf-ray') || 'N/A';
    console.log(`URL: ${item.url}`);
    console.log(`  Description:    ${item.desc}`);
    console.log(`  HTTP Status:    ${res.status} ${res.statusText} (${duration}ms)`);
    if (loc) console.log(`  Redirect To:    ${loc}`);
    console.log(`  CF-Ray:         ${cfRay}`);

    if (res.status === 200) {
      const html = await res.text();
      const title = html.match(/<title>([^<]+)<\/title>/i);
      const canon = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
      console.log(`  <title>:        ${title ? title[1].trim() : 'N/A'}`);
      console.log(`  Canonical Tag:  ${canon ? canon[1] : 'N/A'}`);
    }
    console.log('');
  }

  // 3. Inspect Article 356 API response for exact fields
  console.log('--- Inspecting Article 356 via public API ---');
  const art356Res = await fetch('https://careerdost.blog/api/articles/drap-medicine-barcode-requirements-2026');
  const art356Data = await art356Res.json();
  console.log(`  API Success:    ${art356Data.success}`);
  console.log(`  ID:             ${art356Data.data?.id}`);
  console.log(`  Title:          ${art356Data.data?.title}`);
  console.log(`  SEO Title:      ${art356Data.data?.seo_title || art356Data.data?.seoTitle}`);
  console.log(`  Last Date:      ${art356Data.data?.last_date || art356Data.data?.lastDate}`);
  console.log(`  Updated At:     ${art356Data.data?.updated_at || art356Data.data?.updatedAt}`);
  console.log(`  Status:         ${art356Data.data?.status}`);
}

recheckLive().catch(console.error);
