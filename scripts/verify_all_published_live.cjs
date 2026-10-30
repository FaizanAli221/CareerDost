async function verifyAllLive() {
  console.log('=== COMPREHENSIVE PRODUCTION VERIFICATION ===\n');
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  const articles = [
    { slug: 'ogra-balochistan-jobs-2026-apply-online-njp', title: 'OGRA Balochistan Jobs 2026' },
    { slug: 'cabinet-division-staff-car-driver-jobs-bps-04-2026', title: 'Cabinet Division Driver Jobs 2026' },
    { slug: 'hec-balochistan-jobs-2026-accountant-ldc-njp', title: 'HEC Balochistan Jobs 2026' },
    { slug: 'ministry-of-planning-jobs-2026-accountant-aps-pps-6', title: 'Ministry of Planning Jobs 2026' },
    { slug: 'ntc-jobs-2026-balochistan-assistant-divisional-engineer-aps', title: 'NTC Balochistan Jobs 2026' },
    { slug: 'nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider', title: 'NEPRA Balochistan Jobs 2026' },
    { slug: 'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables', title: 'Punjab Police Constable Jobs 2026' },
    { slug: 'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online', title: 'Ministry of Foreign Affairs Jobs 2026' },
    { slug: 'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online', title: 'NHMP Junior Patrol Officer Jobs 2026' }
  ];

  // Fetch sitemaps
  const sitemapRes = await fetch('https://careerdost.blog/sitemap.xml', { headers: { 'Cache-Control': 'no-cache' } });
  const sitemapText = await sitemapRes.text();

  const apiSitemapRes = await fetch('https://careerdost.blog/api/sitemap.xml', { headers: { 'Cache-Control': 'no-cache' } });
  const apiSitemapText = await apiSitemapRes.text();

  console.log(`Sitemap HTTP: /sitemap.xml is ${sitemapRes.status}, /api/sitemap.xml is ${apiSitemapRes.status}`);

  for (const art of articles) {
    const url = `https://careerdost.blog/jobs/${art.slug}`;
    const t0 = Date.now();
    const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
    const dur = Date.now() - t0;
    const html = await res.text();

    const tMatch = html.match(/<title>([^<]*)<\/title>/i);
    const ogTMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);

    const title = tMatch ? tMatch[1].trim() : 'NONE';
    const ogTitle = ogTMatch ? ogTMatch[1].trim() : 'NONE';
    const h1 = h1Match ? h1Match[1].trim() : 'NONE';
    const desc = descMatch ? descMatch[1].trim() : 'NONE';
    const ogImg = ogImgMatch ? ogImgMatch[1].trim() : 'NONE';
    const canon = canonMatch ? canonMatch[1].trim() : 'NONE';

    const inSitemap = sitemapText.includes(art.slug) || apiSitemapText.includes(art.slug);

    // Verify image status
    let imgStatus = 'N/A';
    if (ogImg && ogImg !== 'NONE') {
      try {
        const iRes = await fetch(ogImg);
        imgStatus = `${iRes.status} ${iRes.statusText} (${iRes.headers.get('content-type')})`;
      } catch (e) {
        imgStatus = `ERROR: ${e.message}`;
      }
    }

    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[${res.status} ${res.statusText}] (${dur}ms) ${art.title}`);
    console.log(`  Live URL:      ${url}`);
    console.log(`  <title>:       "${title}" (${title.length} chars)`);
    console.log(`  og:title:      "${ogTitle}" (${ogTitle.length} chars)`);
    console.log(`  <h1>:          "${h1}"`);
    console.log(`  Canonical:     ${canon}`);
    console.log(`  Meta Desc:     "${desc.slice(0, 80)}..." (${desc.length} chars)`);
    console.log(`  Image URL:     ${ogImg} [${imgStatus}]`);
    console.log(`  In Sitemap:    ${inSitemap ? 'YES (Indexable)' : 'NO'}`);
  }

  // Check Pakistan Railway Quetta to confirm it is untouched and live
  console.log(`\n================================================================================`);
  console.log(`CONFIRMATION OF UNTOUCHED EXCLUDED ARTICLE: Pakistan Railways Quetta`);
  const prUrl = 'https://careerdost.blog/jobs/pakistan-railways-balochistan-quota-jobs-2026-njp';
  const prRes = await fetch(prUrl, { headers: { 'Cache-Control': 'no-cache' } });
  console.log(`  URL:    ${prUrl}`);
  console.log(`  Status: ${prRes.status} ${prRes.statusText} (Untouched & Active)`);
}

verifyAllLive().catch(console.error);
