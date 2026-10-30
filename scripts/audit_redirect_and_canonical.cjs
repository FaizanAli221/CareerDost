async function checkRedirect() {
  const url515 = 'https://careerdost.blog/jobs/spsc-cce-2026-examination-reforms-age-attempts-screening';
  const res1 = await fetch(url515, { redirect: 'manual' });
  console.log('--- 1. Request to /jobs/ version of 515 ---');
  console.log('Status:       ', res1.status, res1.statusText);
  console.log('Location:     ', res1.headers.get('location'));

  const destUrl = res1.headers.get('location') || 'https://careerdost.blog/daily-updates/spsc-cce-2026-examination-reforms-age-attempts-screening';
  const res2 = await fetch(destUrl);
  const html2 = await res2.text();
  console.log('\n--- 2. Request to Redirect Destination ---');
  console.log('Destination:  ', destUrl);
  console.log('Status:       ', res2.status, res2.statusText);
  const canonMatch = html2.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  console.log('Canonical tag:', canonMatch ? canonMatch[1] : 'NONE');
  const titleMatch = html2.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:        ', titleMatch ? titleMatch[1].trim() : 'NONE');

  const res330 = await fetch('https://careerdost.blog/jobs/spsc-cce-2026-screening-test-date');
  const html330 = await res330.text();
  console.log('\n--- 3. Canonical Article 330 Check ---');
  console.log('URL:          ', 'https://careerdost.blog/jobs/spsc-cce-2026-screening-test-date');
  console.log('Status:       ', res330.status, res330.statusText);
  const canon330 = html330.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  console.log('Canonical tag:', canon330 ? canon330[1] : 'NONE');
  const title330 = html330.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:        ', title330 ? title330[1].trim() : 'NONE');
}

checkRedirect().catch(console.error);
