const slugs = [
  'ogra-balochistan-jobs-2026-apply-online-njp',
  'pakistan-railways-balochistan-quota-jobs-2026-njp',
  'cabinet-division-staff-car-driver-jobs-bps-04-2026',
  'cabinet-division-stenotypist-jobs-bps-14-2026',
  'hec-balochistan-jobs-2026-accountant-ldc-njp',
  'ministry-of-planning-jobs-2026-accountant-aps-pps-6',
  'ntc-jobs-2026-balochistan-assistant-divisional-engineer-aps',
  'nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider',
  'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables',
  'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online',
  'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online'
];

async function checkLive() {
  console.log('=== CHECKING LIVE STATUS OF CANDIDATE ARTICLES ===\n');

  for (const slug of slugs) {
    const url = `https://careerdost.blog/jobs/${slug}`;
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
    const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);

    console.log(`[HTTP ${res.status}] ${slug}`);
    console.log(`  Title:  ${titleMatch ? titleMatch[1].trim() : 'NONE'}`);
    console.log(`  H1:     ${h1Match ? h1Match[1].trim() : 'NONE'}`);
    console.log(`  og:img: ${ogImgMatch ? ogImgMatch[1].trim() : 'NONE'}`);

    // Also check API
    const apiRes = await fetch(`https://careerdost.blog/api/articles/${slug}`);
    const apiJson = await apiRes.json();
    console.log(`  API:    HTTP ${apiRes.status} | status="${apiJson.data?.status}" | featuredImage="${apiJson.data?.featuredImage}"\n`);
  }
}

checkLive().catch(console.error);
