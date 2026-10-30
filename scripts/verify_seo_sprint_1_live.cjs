async function verifyLive() {
  console.log(`=== LIVE VERIFICATION: GSC SEO SPRINT 1 ===\nTimestamp: ${new Date().toISOString()}\n`);

  const targets = [
    { slug: 'phsa-paramedic-general-list-2026', desc: 'A. PHSA Paramedic General List' },
    { slug: 'ezy-business-applications-paid-internship-karachi-2026', desc: 'B. EZY Business Paid Internship' },
    { slug: 'nts-nat-xi-2026-november-registration-guide', desc: 'C. NTS NAT-XI November 2026' },
    { slug: 'memon-college-of-nursing-karachi-bsn-admissions-2026-27', desc: 'D. Memon College of Nursing' },
    { slug: 'bank-of-punjab-karachi-manager-jobs-2026', desc: 'E. Bank of Punjab Karachi Manager' },
    { slug: 'sindh-courts-bps-1-4-jobs-2026', desc: 'F. Sindh Courts BPS 1-4 Walk-in' },
    { slug: 'sindh-wheat-subsidy-benazir-hari-card-2026', desc: 'G. Sindh Wheat Subsidy Benazir Hari Card' },
    { slug: 'sindh-government-jobs-2026-spsc-sts-vacancies-apply-online', desc: 'H. Evergreen Sindh Govt Jobs Guide' }
  ];

  for (const item of targets) {
    const url = `https://careerdost.blog/jobs/${item.slug}`;
    const t0 = Date.now();
    const res = await fetch(url);
    const duration = Date.now() - t0;
    const html = await res.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'N/A';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const desc = descMatch ? descMatch[1].trim() : 'N/A';

    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    const canon = canonMatch ? canonMatch[1].trim() : 'N/A';

    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : 'N/A';

    console.log(`[${res.status} ${res.statusText}] (${duration}ms) ${item.desc}`);
    console.log(`  URL:         ${url}`);
    console.log(`  Title:       "${title}" (${title.length} chars)`);
    console.log(`  Meta Desc:   "${desc}" (${desc.length} chars)`);
    console.log(`  Canonical:   ${canon}`);
    console.log(`  H1:          "${h1}"\n`);
  }

  // Verify Sindh Courts /daily-updates/ redirect
  const courtRedirectUrl = 'https://careerdost.blog/daily-updates/sindh-courts-bps-1-4-jobs-2026';
  const redirectRes = await fetch(courtRedirectUrl, { redirect: 'manual' });
  console.log('--- Sindh Courts Mirror Redirect Verification ---');
  console.log(`  URL:         ${courtRedirectUrl}`);
  console.log(`  Status:      ${redirectRes.status} ${redirectRes.statusText}`);
  console.log(`  Location:    ${redirectRes.headers.get('location')}`);
}

verifyLive().catch(console.error);
