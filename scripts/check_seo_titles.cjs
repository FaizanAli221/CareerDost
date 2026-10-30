const fs = require('fs');

async function checkSeoTitles() {
  const slugs = [
    'ogra-balochistan-jobs-2026-apply-online-njp',
    'cabinet-division-staff-car-driver-jobs-bps-04-2026',
    'hec-balochistan-jobs-2026-accountant-ldc-njp',
    'ministry-of-planning-jobs-2026-accountant-aps-pps-6',
    'ntc-jobs-2026-balochistan-assistant-divisional-engineer-aps',
    'nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider',
    'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables',
    'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online',
    'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online'
  ];

  console.log('=== CHECKING SEO TITLES & HEADINGS ACROSS ARTICLES ===\n');

  for (const s of slugs) {
    const res = await fetch(`https://careerdost.blog/jobs/${s}`);
    const html = await res.text();
    const tMatch = html.match(/<title>([^<]*)<\/title>/i);
    const ogTMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);

    const title = tMatch ? tMatch[1].trim() : 'NONE';
    const ogTitle = ogTMatch ? ogTMatch[1].trim() : 'NONE';
    const h1 = h1Match ? h1Match[1].trim() : 'NONE';
    const desc = descMatch ? descMatch[1].trim() : 'NONE';

    console.log(`[${s}]`);
    console.log(`  <title>:    "${title}" (${title.length} chars)`);
    console.log(`  og:title:   "${ogTitle}" (${ogTitle.length} chars)`);
    console.log(`  H1:         "${h1}"`);
    console.log(`  Meta Desc:  "${desc.slice(0, 80)}..." (${desc.length} chars)`);
    console.log(`  Has FAQs:   ${html.includes('Frequently Asked Questions') || html.includes('FAQs')}`);
    console.log(`  Has Table:  ${html.includes('<table') || html.includes('|')}`);
    console.log(`  Internal L: ${html.includes('/jobs/')}\n`);
  }
}

checkSeoTitles().catch(console.error);
