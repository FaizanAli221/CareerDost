async function verifyFinalCorrections() {
  console.log('=== VERIFYING LIVE PRODUCTION: TARGETED CONTENT CORRECTIONS ===\n');
  console.log(`Verification Timestamp: ${new Date().toISOString()}\n`);

  const targets = [
    {
      slug: 'phsa-paramedic-general-list-2026',
      title: 'PHSA Paramedic General List',
      checks: [
        'General List - BS Paramedics - ZAB PGPI',
        'Institute: All Institutes',
        'Status: Returned for Correction, Document verified',
        '1 November 2026',
        'phsa.edu.pk/notice-details'
      ]
    },
    {
      slug: 'sindh-wheat-subsidy-benazir-hari-card-2026',
      title: 'Sindh Wheat Subsidy Benazir Hari Card',
      checks: [
        'Daily Times',
        '18 September 2026',
        'Rs. 4,000 per acre',
        '25 acres',
        'Rs. 2,000 per maund',
        'benazirharicard.gos.pk',
        'sindh.gov.pk'
      ]
    },
    {
      slug: 'bank-of-punjab-karachi-manager-jobs-2026',
      title: 'Bank of Punjab Karachi Manager',
      checks: [
        'Closing today — 29 October 2026',
        'bop.com.pk/Available-Jobs',
        'bop.rozee.pk'
      ]
    }
  ];

  for (const item of targets) {
    const url = `https://careerdost.blog/jobs/${item.slug}`;
    const t0 = Date.now();
    const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
    const duration = Date.now() - t0;
    const html = await res.text();

    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'MISSING';

    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                         html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["'][^>]*>/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : 'MISSING';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const desc = descMatch ? descMatch[1].trim() : 'MISSING';

    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
    const canon = canonMatch ? canonMatch[1].trim() : 'MISSING';

    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : 'MISSING';

    console.log(`[${res.status} ${res.statusText}] (${duration}ms) ${item.title}`);
    console.log(`  Live URL:       ${url}`);
    console.log(`  Canonical Tag:  ${canon}`);
    console.log(`  <title>:        "${title}" (${title.length} chars)`);
    console.log(`  og:title:       "${ogTitle}" (${ogTitle.length} chars)`);
    console.log(`  <h1>:           "${h1}"`);
    console.log(`  meta desc:      "${desc}" (${desc.length} chars)`);

    // Verify through public API endpoint
    const apiRes = await fetch(`https://careerdost.blog/api/articles/${item.slug}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    const apiJson = await apiRes.json();
    const apiArt = apiJson.data;
    const allContentText = Array.isArray(apiArt?.content) ? apiArt.content.join('\n') : '';

    console.log(`  API Status:     ${apiRes.status} (Article status: "${apiArt?.status}", lastDate: "${apiArt?.lastDate}")`);

    console.log('  Content Assertions:');
    for (const check of item.checks) {
      const inHtml = html.includes(check);
      const inApi = allContentText.includes(check);
      const pass = inHtml || inApi;
      console.log(`    - "${check}": ${pass ? 'PASSED' : 'FAILED'} (In HTML: ${inHtml}, In API: ${inApi})`);
    }
    console.log('');
  }
}

verifyFinalCorrections().catch(console.error);
