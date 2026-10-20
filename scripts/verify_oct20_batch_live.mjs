async function verify() {
  console.log('=== VERIFYING 20 OCTOBER 2026 BATCH ON LIVE PRODUCTION (careerdost.blog) ===\n');

  const urls = [
    {
      name: 'HEC Commonwealth 2027-28',
      url: 'https://careerdost.blog/jobs/hec-uk-commonwealth-scholarships-2027-28',
      expected: ['Closing Today', '4:00 PM', '16:00 BST']
    },
    {
      name: 'Sindh Wheat Subsidy 2026',
      url: 'https://careerdost.blog/jobs/sindh-wheat-subsidy-benazir-hari-card-2026',
      expected: ['Rs. 4,000', 'Form-VII', '0311-1646111']
    },
    {
      name: 'GEPCO Jobs 2026',
      url: 'https://careerdost.blog/jobs/gepco-jobs-2026',
      expected: ['2610202', '23 October', 'Database Administration']
    },
    {
      name: 'NTS NAT-XI 2026 Guide',
      url: 'https://careerdost.blog/jobs/nts-nat-xi-2026-november-registration-guide',
      expected: ['NAT-XI', '26 October', '15 November', '1,510']
    },
    {
      name: 'Memon College of Nursing Karachi',
      url: 'https://careerdost.blog/jobs/memon-college-of-nursing-karachi-bsn-admissions-2026-27',
      expected: ['Memon College of Nursing', 'Batch-X', '30 October', 'DUHS']
    },
    {
      name: 'NIAHS Hyderabad BSN Nursing',
      url: 'https://careerdost.blog/jobs/niahs-hyderabad-bsn-nursing-admissions-2026-27',
      expected: ['National Institute of Allied Health Sciences', 'SMBBMU', '30 October']
    }
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
      });
      console.log(`[HTTP ${res.status}] ${item.name}`);
      const text = await res.text();
      for (const exp of item.expected) {
        const found = text.includes(exp);
        console.log(`  - Contains "${exp}": ${found ? 'PASS' : 'FAIL'}`);
      }
    } catch (e) {
      console.error(`  - Failed fetching ${item.url}:`, e.message);
    }
  }

  console.log('\n--- Checking Featured Images ---');
  const images = [
    'https://careerdost.blog/images/nts-nat-xi-november-2026.jpg',
    'https://careerdost.blog/images/memon-college-nursing-karachi-bsn-2026.jpg',
    'https://careerdost.blog/images/niahs-hyderabad-bsn-nursing-2026.jpg'
  ];

  for (const img of images) {
    const res = await fetch(img);
    console.log(`[HTTP ${res.status}] ${img} (Content-Type: ${res.headers.get('content-type')}, Size: ${res.headers.get('content-length')} bytes)`);
  }

  console.log('\n--- Checking Sitemap ---');
  const sitemapRes = await fetch('https://careerdost.blog/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  console.log(`[HTTP ${sitemapRes.status}] Sitemap length: ${sitemapText.length}`);
  const hasNat = sitemapText.includes('nts-nat-xi-2026-november-registration-guide');
  const hasMemon = sitemapText.includes('memon-college-of-nursing-karachi-bsn-admissions-2026-27');
  const hasNiahs = sitemapText.includes('niahs-hyderabad-bsn-nursing-admissions-2026-27');
  console.log(`  - Sitemap has NAT-XI: ${hasNat}`);
  console.log(`  - Sitemap has Memon: ${hasMemon}`);
  console.log(`  - Sitemap has NIAHS: ${hasNiahs}`);
}

verify();
