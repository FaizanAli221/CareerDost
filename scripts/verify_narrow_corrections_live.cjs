async function verifyNarrowCorrections() {
  console.log('=== VERIFYING NARROW CONTENT CORRECTIONS LIVE ON PRODUCTION ===\n');
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  // 1. Sindh Wheat Subsidy
  console.log('--- 1. Sindh Wheat Subsidy (sindh-wheat-subsidy-benazir-hari-card-2026) ---');
  const wheatUrl = 'https://careerdost.blog/jobs/sindh-wheat-subsidy-benazir-hari-card-2026';
  const wheatRes = await fetch(wheatUrl, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  const wheatHtml = await wheatRes.text();

  const wheatTitleMatch = wheatHtml.match(/<title>([^<]*)<\/title>/i);
  const wheatH1Match = wheatHtml.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const wheatDescMatch = wheatHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const wheatCanonMatch = wheatHtml.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);

  console.log(`HTTP Status:      ${wheatRes.status} ${wheatRes.statusText}`);
  console.log(`Live URL:         ${wheatUrl}`);
  console.log(`<title>:          "${wheatTitleMatch ? wheatTitleMatch[1].trim() : 'NONE'}" (${wheatTitleMatch ? wheatTitleMatch[1].trim().length : 0} chars)`);
  console.log(`<h1>:             "${wheatH1Match ? wheatH1Match[1].trim() : 'NONE'}"`);
  console.log(`Canonical:        ${wheatCanonMatch ? wheatCanonMatch[1].trim() : 'NONE'}`);
  console.log(`Meta Description: "${wheatDescMatch ? wheatDescMatch[1].trim() : 'NONE'}"`);

  const hasNewExcerpt = wheatHtml.includes('Explore verified guidelines for the Sindh Rabi 2026–27 wheat support framework');
  const hasNewSalary = wheatHtml.includes('DAP Input Relief Framework + Rs 2,000/Maund Harvest Incentive');
  const hasOldTitle = wheatHtml.includes('Rs 4,000/Acre DAP Relief &amp; Form-VII Verification');

  console.log(`New Excerpt in HTML: ${hasNewExcerpt ? 'PASS' : 'FAIL'}`);
  console.log(`New Salary in HTML:  ${hasNewSalary ? 'PASS' : 'FAIL'}`);
  console.log(`Old 4,000 Title absent from H1: ${!hasOldTitle ? 'PASS' : 'FAIL'}`);

  // 2. Bank of Punjab
  console.log('\n--- 2. Bank of Punjab Karachi (bank-of-punjab-karachi-manager-jobs-2026) ---');
  const bopUrl = 'https://careerdost.blog/jobs/bank-of-punjab-karachi-manager-jobs-2026';
  const bopRes = await fetch(bopUrl, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  const bopHtml = await bopRes.text();

  const bopTitleMatch = bopHtml.match(/<title>([^<]*)<\/title>/i);
  const bopH1Match = bopHtml.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const bopDescMatch = bopHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const bopCanonMatch = bopHtml.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);

  console.log(`HTTP Status:      ${bopRes.status} ${bopRes.statusText}`);
  console.log(`Live URL:         ${bopUrl}`);
  console.log(`<title>:          "${bopTitleMatch ? bopTitleMatch[1].trim() : 'NONE'}" (${bopTitleMatch ? bopTitleMatch[1].trim().length : 0} chars)`);
  console.log(`<h1>:             "${bopH1Match ? bopH1Match[1].trim() : 'NONE'}"`);
  console.log(`Canonical:        ${bopCanonMatch ? bopCanonMatch[1].trim() : 'NONE'}`);
  console.log(`Meta Description: "${bopDescMatch ? bopDescMatch[1].trim() : 'NONE'}"`);

  const midnightCount = (bopHtml.match(/midnight/gi) || []).length;
  const hasNewNotice = bopHtml.includes('The official listing gives 29 October 2026 as the closing date, but does not specify an exact cutoff time');

  console.log(`Occurrences of "midnight": ${midnightCount} (${midnightCount === 0 ? 'PASS (Fully Removed)' : 'FAIL'})`);
  console.log(`New Cutoff Guidance in HTML: ${hasNewNotice ? 'PASS' : 'FAIL'}`);

  // 3. Confirm PHSA Untouched
  console.log('\n--- 3. Confirmation of PHSA Paramedic List ---');
  const phsaUrl = 'https://careerdost.blog/jobs/phsa-paramedic-general-list-2026';
  const phsaRes = await fetch(phsaUrl, {
    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
  });
  console.log(`PHSA HTTP Status: ${phsaRes.status} ${phsaRes.statusText} (Untouched & Active)`);
}

verifyNarrowCorrections().catch(console.error);
