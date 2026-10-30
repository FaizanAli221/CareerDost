const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

function base64UrlEncode(b) {
  return Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function jwt(admin, secret) {
  const h = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const p = base64UrlEncode(JSON.stringify({ ...admin, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 }));
  const s = base64UrlEncode(crypto.createHmac('sha256', secret).update(h + '.' + p).digest());
  return h + '.' + p + '.' + s;
}

async function polishSeoTitlesAndSync() {
  console.log('=== POLISHING TRUNCATED SEO TITLES & ENSURING LOCAL SQLITE PARITY ===\n');

  const env = fs.readFileSync('.env.local', 'utf8');
  const secret = env.match(/ADMIN_JWT_SECRET=(.+)/)[1].trim();
  const token = jwt({ id: 2, username: '4330426358809', role: 'superadmin' }, secret);

  const res = await fetch('https://careerdost.blog/api/admin/articles', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const allD1 = (await res.json()).data;
  const localDb = new Database('careerdost.sqlite');

  const titleFixes = [
    {
      slug: 'ogra-balochistan-jobs-2026-apply-online-njp',
      newSeoTitle: 'OGRA Balochistan Jobs 2026: 6 Vacancies — CareerDost',
      newOgTitle: 'OGRA Balochistan Jobs 2026: 6 Vacancies — CareerDost'
    },
    {
      slug: 'cabinet-division-staff-car-driver-jobs-bps-04-2026',
      newSeoTitle: 'Cabinet Division Driver Jobs 2026 — CareerDost',
      newOgTitle: 'Cabinet Division Driver Jobs 2026 — CareerDost'
    },
    {
      slug: 'hec-balochistan-jobs-2026-accountant-ldc-njp',
      newSeoTitle: 'HEC Balochistan Jobs 2026: Accountant & LDC — CareerDost',
      newOgTitle: 'HEC Balochistan Jobs 2026: Accountant & LDC — CareerDost'
    },
    {
      slug: 'ntc-jobs-2026-balochistan-assistant-divisional-engineer-aps',
      newSeoTitle: 'NTC Jobs 2026: ADE & Private Secretary — CareerDost',
      newOgTitle: 'NTC Jobs 2026: ADE & Private Secretary — CareerDost'
    },
    {
      slug: 'nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider',
      newSeoTitle: 'NEPRA Balochistan Jobs 2026: Support Staff — CareerDost',
      newOgTitle: 'NEPRA Balochistan Jobs 2026: Support Staff — CareerDost'
    }
  ];

  for (const fix of titleFixes) {
    const art = allD1.find(a => a.slug === fix.slug);
    if (!art) {
      console.log(`Could not find ${fix.slug} in D1`);
      continue;
    }

    console.log(`Updating SEO title for: ${fix.slug}`);
    console.log(`  Old: "${art.seoTitle}"`);
    console.log(`  New: "${fix.newSeoTitle}" (${fix.newSeoTitle.length} chars)`);

    const payload = {
      title: art.title,
      slug: art.slug,
      category: art.categorySlug || art.category,
      organization: art.organization,
      jobType: art.jobType,
      location: art.location,
      qualification: art.qualification,
      salary: art.salary,
      experience: art.experience,
      positions: art.positions,
      lastDate: art.lastDate,
      noDeadline: art.noDeadline,
      publishDate: art.publishDate,
      officialLink: art.officialLink,
      applyLink: art.applyLink,
      isVerified: art.isVerified,
      featured: art.featured,
      logoInitial: art.logoInitial,
      featuredImage: art.featuredImage,
      imageAlt: art.imageAlt,
      excerpt: art.excerpt,
      content: art.content,
      seoTitle: fix.newSeoTitle,
      metaDescription: art.metaDescription,
      focusKeyword: art.focusKeyword,
      canonicalUrl: art.canonicalUrl,
      ogTitle: fix.newOgTitle,
      ogDescription: art.ogDescription,
      status: 'published'
    };

    const updateRes = await fetch(`https://careerdost.blog/api/admin/articles/${fix.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(payload)
    });

    const updateJson = await updateRes.json();
    if (!updateRes.ok || !updateJson.success) {
      console.error(`Failed to update ${fix.slug}:`, updateJson);
    } else {
      console.log(`  ✓ Updated in D1`);
    }

    // Update Local SQLite
    localDb.prepare(`
      UPDATE articles SET
        seo_title = ?,
        og_title = ?,
        status = 'published',
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(fix.newSeoTitle, fix.newOgTitle, fix.slug);
    console.log(`  ✓ Synchronized in Local SQLite`);
  }

  // Ensure published status parity in SQLite for other recently published articles
  const otherSlugs = [
    'ministry-of-planning-jobs-2026-accountant-aps-pps-6',
    'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables',
    'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online',
    'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online'
  ];

  for (const s of otherSlugs) {
    localDb.prepare(`
      UPDATE articles SET
        status = 'published',
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `).run(s);
    console.log(`✓ Synchronized status='published' in Local SQLite for: ${s}`);
  }

  console.log('\n=== POLISHING AND SYNCHRONIZATION COMPLETE ===');
}

polishSeoTitlesAndSync().catch(console.error);
