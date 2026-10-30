const fs = require('fs');

async function analyze() {
  const data = JSON.parse(fs.readFileSync('scripts/fresh_http_results.json', 'utf8'));

  console.log('=================================================================');
  console.log('=== FORENSIC READ-ONLY ANALYSIS OF FRESH HTTP PRODUCTION DATA ===');
  console.log('=================================================================\n');

  // ==========================================
  // TARGET 1: PHSA
  // ==========================================
  console.log('-----------------------------------------------------------------');
  console.log('TARGET 1: PHSA Paramedic General List (phsa-paramedic-general-list-2026)');
  console.log('-----------------------------------------------------------------');
  const phsa = data['phsa-paramedic-general-list-2026'];
  console.log('Public HTML Status:', phsa.normal.status);
  console.log('Headers:');
  console.log('  Date:', phsa.normal.headers['date']);
  console.log('  CF-Ray:', phsa.normal.headers['cf-ray']);
  console.log('  CF-Cache-Status:', phsa.normal.headers['cf-cache-status']);
  console.log('  Cache-Control:', phsa.normal.headers['cache-control']);

  const phsaHtml = phsa.normal.html;
  const phsaApi = phsa.api.data;

  // Key phrases to check in public HTML
  const phsaChecks = [
    'General List - BS Paramedics - ZAB PGPI',
    'Institute: All Institutes',
    'Status: Returned for Correction, Document verified',
    '1 November 2026'
  ];

  console.log('\nPHSA Phrases Verification in Public HTML:');
  for (const phrase of phsaChecks) {
    const present = phsaHtml.includes(phrase);
    console.log(`  [${present ? 'PASS' : 'FAIL'}] "${phrase}" (in HTML: ${present})`);
  }

  // Extract the exact HTML excerpt of the 26 October notice
  const phsaNoticeIdx = phsaHtml.indexOf('BS Paramedics General List & Document Header Clarification');
  if (phsaNoticeIdx !== -1) {
    const excerpt = phsaHtml.slice(Math.max(0, phsaNoticeIdx - 60), phsaNoticeIdx + 1200);
    console.log('\nExact Public HTML Excerpt for PHSA 26 October Section:');
    console.log('```html\n' + excerpt + '\n```');
  } else {
    console.log('\n[FAIL] Section header not found in public HTML');
  }

  // Comparison with D1 / API
  console.log('\nComparison with Production D1 / API:');
  const phsaD1Content = phsa.d1.content;
  const phsaApiContent = phsaApi.content;
  console.log(`  D1 Content Sections Count: ${phsaD1Content.length}`);
  console.log(`  API Content Sections Count: ${phsaApiContent.length}`);
  console.log(`  D1 Section 3 Header: "${phsaD1Content[3]}"`);
  console.log(`  API Section 3 Header: "${phsaApiContent[3]}"`);
  const phsaSectionInHtml = phsaHtml.includes(phsaD1Content[3]);
  console.log(`  D1 Section 3 present in public HTML: ${phsaSectionInHtml}`);

  // ==========================================
  // TARGET 2: SINDH WHEAT SUBSIDY
  // ==========================================
  console.log('\n-----------------------------------------------------------------');
  console.log('TARGET 2: Sindh Wheat Subsidy (sindh-wheat-subsidy-benazir-hari-card-2026)');
  console.log('-----------------------------------------------------------------');
  const wheat = data['sindh-wheat-subsidy-benazir-hari-card-2026'];
  console.log('Public HTML Status:', wheat.normal.status);
  console.log('Headers:');
  console.log('  Date:', wheat.normal.headers['date']);
  console.log('  CF-Ray:', wheat.normal.headers['cf-ray']);
  console.log('  CF-Cache-Status:', wheat.normal.headers['cf-cache-status']);
  console.log('  Cache-Control:', wheat.normal.headers['cache-control']);

  const wheatHtml = wheat.normal.html;
  const wheatApi = wheat.api.data;

  // Extract meta desc, H1, etc.
  const wheatMetaDescMatch = wheatHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const wheatMetaDesc = wheatMetaDescMatch ? wheatMetaDescMatch[1] : 'NONE';

  const wheatH1Match = wheatHtml.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const wheatH1 = wheatH1Match ? wheatH1Match[1] : 'NONE';

  console.log('\n1. Meta Description:');
  console.log(`  Text: "${wheatMetaDesc}"`);
  console.log(`  Contains 4,000 / 4000: ${wheatMetaDesc.includes('4,000') || wheatMetaDesc.includes('4000')}`);
  console.log(`  Contains Daily Times attribution: ${wheatMetaDesc.includes('Daily Times')}`);

  console.log('\n2. H1 Heading:');
  console.log(`  Text: "${wheatH1}"`);
  console.log(`  Contains 4,000 / 4000: ${wheatH1.includes('4,000') || wheatH1.includes('4000')}`);
  console.log(`  Contains Daily Times attribution: ${wheatH1.includes('Daily Times')}`);

  console.log('\n3. Executive Summary (content[1]):');
  console.log(`  Text: "${wheatApi.content[1]}"`);
  console.log(`  Contains 4,000 / 4000: ${wheatApi.content[1].includes('4,000') || wheatApi.content[1].includes('4000')}`);

  console.log('\n4. Policy Highlights Callout / Summary Table (content[2]):');
  console.log(`  Text: "${wheatApi.content[2]}"`);
  console.log(`  Contains 4,000: ${wheatApi.content[2].includes('4,000')}`);
  console.log(`  Contains Daily Times: ${wheatApi.content[2].includes('Daily Times')}`);
  console.log(`  Contains 18 September 2026: ${wheatApi.content[2].includes('18 September 2026')}`);

  console.log('\n5. Main Body - Two Pillars (content[4]):');
  console.log(`  Text: "${wheatApi.content[4]}"`);
  console.log(`  Contains 4,000: ${wheatApi.content[4].includes('4,000')}`);
  console.log(`  Contains Daily Times: ${wheatApi.content[4].includes('Daily Times')}`);
  console.log(`  Contains 18 September 2026: ${wheatApi.content[4].includes('18 September 2026')}`);

  console.log('\n6. FAQ - Q1 (content[10]):');
  console.log(`  Text: "${wheatApi.content[10]}"`);
  console.log(`  Contains 4,000: ${wheatApi.content[10].includes('4,000')}`);
  console.log(`  Contains Daily Times: ${wheatApi.content[10].includes('Daily Times')}`);

  // Find ALL occurrences of 4,000 in public HTML and content
  console.log('\n--- SCANNING ALL OCCURRENCES OF 4,000 IN SINDH WHEAT SUBSIDY ---');
  let idx = 0;
  let count = 0;
  while ((idx = wheatHtml.indexOf('4,000', idx)) !== -1) {
    count++;
    const snippet = wheatHtml.slice(Math.max(0, idx - 100), Math.min(wheatHtml.length, idx + 150)).replace(/\n/g, ' ');
    console.log(`  Occurrence #${count} (pos ${idx}): ...${snippet}...`);
    idx += 5;
  }

  // ==========================================
  // TARGET 3: BANK OF PUNJAB
  // ==========================================
  console.log('\n-----------------------------------------------------------------');
  console.log('TARGET 3: Bank of Punjab (bank-of-punjab-karachi-manager-jobs-2026)');
  console.log('-----------------------------------------------------------------');
  const bop = data['bank-of-punjab-karachi-manager-jobs-2026'];
  console.log('Public HTML Status:', bop.normal.status);
  console.log('Headers:');
  console.log('  Date:', bop.normal.headers['date']);
  console.log('  CF-Ray:', bop.normal.headers['cf-ray']);
  console.log('  CF-Cache-Status:', bop.normal.headers['cf-cache-status']);
  console.log('  Cache-Control:', bop.normal.headers['cache-control']);

  const bopHtml = bop.normal.html;
  const bopApi = bop.api.data;

  console.log('\n1. Closing Date Displayed in HTML:');
  const bopDateMatch = bopHtml.match(/Closing today — 29 October 2026/g);
  console.log(`  Matches for "Closing today — 29 October 2026": ${bopDateMatch ? bopDateMatch.length : 0}`);

  console.log('\n2. Check for "before midnight tonight":');
  const midnightMatches = [];
  let mIdx = 0;
  while ((mIdx = bopHtml.indexOf('midnight', mIdx)) !== -1) {
    const snip = bopHtml.slice(Math.max(0, mIdx - 60), Math.min(bopHtml.length, mIdx + 80)).replace(/\n/g, ' ');
    midnightMatches.push(snip);
    mIdx += 8;
  }
  console.log(`  Occurrences of "midnight": ${midnightMatches.length}`);
  midnightMatches.forEach((m, i) => console.log(`    [${i + 1}] ...${m}...`));

  console.log('\n3. Official BOP Source Verification on "Midnight":');
  console.log(`  Official Link in Record: ${bopApi.officialLink}`);
  console.log(`  Apply Link in Record: ${bopApi.applyLink}`);
  console.log(`  Does official source state midnight? Investigating...`);
}

analyze().catch(console.error);
