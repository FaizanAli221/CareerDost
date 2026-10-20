async function verify() {
  try {
    const res = await fetch('https://careerdost.blog/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
    });
    console.log('Homepage status:', res.status);
    const html = await res.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    console.log('Meta Desc:', descMatch ? descMatch[1] : 'NOT FOUND');

    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log('H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'NOT FOUND');

    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'NOT FOUND');

    const scripts = [...html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
    console.log('Found JSON-LD script tags:', scripts.length);
    for (let i = 0; i < scripts.length; i++) {
      try {
        const data = JSON.parse(scripts[i][1]);
        const types = data['@type'] || (data['@graph'] ? data['@graph'].map(n => n['@type']) : 'unknown');
        console.log(`Script ${i + 1} type:`, types);
        if (data['@graph']) {
          for (const node of data['@graph']) {
            if (node['@type'] === 'WebSite') {
              console.log('WebSite Schema name:', node.name, '| alternateName:', node.alternateName);
            }
            if (node['@type'] === 'Organization') {
              console.log('Organization Schema name:', node.name, '| logo:', node.logo);
            }
          }
        }
      } catch (e) {
        console.log(`Script ${i + 1} parse error:`, e.message);
      }
    }

    const logoRes = await fetch('https://careerdost.blog/logo.png');
    console.log('logo.png status:', logoRes.status, 'Content-Type:', logoRes.headers.get('content-type'), 'Length:', logoRes.headers.get('content-length'));

    const appleTouchRes = await fetch('https://careerdost.blog/apple-touch-icon.png');
    console.log('apple-touch-icon.png status:', appleTouchRes.status, 'Content-Type:', appleTouchRes.headers.get('content-type'));

    // Check key article and category
    const jobRes = await fetch('https://careerdost.blog/jobs/samba-bank-relationship-associate-jobs-2026');
    console.log('Sample Job Article status:', jobRes.status);

    const catRes = await fetch('https://careerdost.blog/category/jobs');
    console.log('Category Jobs status:', catRes.status);
  } catch (err) {
    console.error('Verification failed:', err);
  }
}

verify();
