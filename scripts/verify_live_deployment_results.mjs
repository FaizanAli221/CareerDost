import fs from 'fs';

const TARGET_ARTICLES = [
  {
    slug: 'bank-of-punjab-relationship-officer-transaction-banking-2026',
    image: '/images/bop-relationship-officer-transaction-banking-2026.webp'
  },
  {
    slug: 'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026',
    image: '/images/bop-relationship-manager-officer-cfc-2026.webp'
  },
  {
    slug: 'memon-college-of-nursing-karachi-bsn-admissions-2026-27',
    image: '/images/memon-college-nursing-karachi-bsn-2026.webp'
  },
  {
    slug: 'niahs-hyderabad-bsn-nursing-admissions-2026-27',
    image: '/images/niahs-hyderabad-bsn-nursing-2026.webp'
  },
  {
    slug: 'nts-nat-xi-2026-november-registration-guide',
    image: '/images/nts-nat-xi-november-2026.webp'
  },
  {
    slug: 'gepco-jobs-2026',
    image: '/images/gepco-jobs-2026.webp'
  },
  {
    slug: 'hec-uk-commonwealth-scholarships-2027-28',
    image: '/images/hec-commonwealth-scholarship-2027.webp'
  },
  {
    slug: 'gwadar-shipyard-cfo-accounts-officer-jobs-2026',
    image: '/images/gwadar-shipyard-cfo-accounts-officer-2026.webp'
  },
  {
    slug: 'imarat-finance-intern-jobs-2026',
    image: '/images/imarat-finance-intern-2026.webp'
  },
  {
    slug: 'gwadar-shipyard-assistant-jobs-2026',
    image: '/images/gwadar-shipyard-assistant-pps5-2026.webp'
  },
  {
    slug: 'hec-outstanding-research-awards-2026-27',
    image: '/images/hec-outstanding-research-awards-2026-27.webp'
  },
  {
    slug: 'uajk-admissions-2026-deadline-extended',
    image: '/images/uajk-admissions-2026-deadline-extended.webp'
  },
  {
    slug: 'petrol-price-reduced-pakistan-september-2026',
    image: '/images/petrol-price-reduced-pakistan-2026.webp'
  },
  {
    slug: 'navttc-assistant-private-secretary-jobs-2026',
    image: '/images/navttc-assistant-private-secretary-2026.webp'
  },
  {
    slug: 'karachi-shipyard-technical-assistant-jobs-2026',
    image: '/images/karachi-shipyard-technical-assistant-2026.webp'
  },
  {
    slug: 'sbbu-affiliated-colleges-admissions-2026',
    image: '/images/sbbu-affiliated-colleges-admissions-2026.webp'
  },
  // Replaced SVG articles
  {
    slug: 'cbd-punjab-paid-internship-2026-youth-career-program',
    image: '/images/cbd-punjab-youth-career-program-2026.webp'
  },
  {
    slug: 'sindh-pink-scooty-scheme-2026-online-registration-eligibility',
    image: '/images/sindh-electric-scooty-scheme-2026.webp'
  },
  {
    slug: 'virtual-university-admissions-2026-deadline-tomorrow',
    image: '/images/virtual-university-fall-2026-admissions.webp'
  },
  // NJP PIDCL Article 73
  {
    slug: 'httpswwwnjpgovpk',
    image: '/images/pidcl-site-engineer-jobs-2026.webp'
  }
];

const BASE_URL = 'https://careerdost.blog';

async function verifyAll() {
  console.log(`=== VERIFYING PRODUCTION DEPLOYMENT AT ${BASE_URL} ===\n`);
  let passedImages = 0;
  let passedArticles = 0;

  for (const item of TARGET_ARTICLES) {
    const imageUrl = `${BASE_URL}${item.image}`;
    const articleUrl = `${BASE_URL}/jobs/${item.slug}`;

    // 1. Verify Image HTTP status, content-type and size
    try {
      const imgRes = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const ct = imgRes.headers.get('content-type') || '';
      const cl = imgRes.headers.get('content-length') || '';
      const cfCache = imgRes.headers.get('cf-cache-status') || 'DYNAMIC';

      if (imgRes.status === 200 && ct.includes('image/webp')) {
        console.log(`✓ IMAGE [200 OK]: ${item.image} (${ct}, ${cl} bytes, CF-Cache: ${cfCache})`);
        passedImages++;
      } else {
        console.error(`✗ IMAGE FAIL: ${item.image} Status: ${imgRes.status}, Content-Type: ${ct}`);
      }
    } catch (e) {
      console.error(`✗ IMAGE ERROR: ${imageUrl} - ${e.message}`);
    }

    // 2. Verify Article HTML & OG Image
    try {
      const artRes = await fetch(articleUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36',
          'Cache-Control': 'no-cache'
        }
      });
      if (artRes.status === 200) {
        const html = await artRes.text();
        const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
        const ogImage = ogMatch ? ogMatch[1] : 'NOT FOUND';
        const hasWebpInHtml = html.includes(item.image);
        console.log(`  └─ ARTICLE [200 OK]: /jobs/${item.slug}`);
        console.log(`     og:image -> ${ogImage}`);
        console.log(`     html references webp -> ${hasWebpInHtml}`);
        passedArticles++;
      } else {
        console.error(`  └─ ARTICLE FAIL [${artRes.status}]: ${articleUrl}`);
      }
    } catch (e) {
      console.error(`  └─ ARTICLE ERROR: ${articleUrl} - ${e.message}`);
    }
    console.log('');
  }

  // 3. Verify Article 73 Deadline status
  console.log('=== VERIFYING ARTICLE 73 DEADLINE STATUS ===');
  const njpRes = await fetch(`${BASE_URL}/jobs/httpswwwnjpgovpk`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const njpHtml = await njpRes.text();
  console.log('Article 73 contains 2026-10-11:', njpHtml.includes('2026-10-11'));
  console.log('Article 73 contains njp.gov.pk:', njpHtml.includes('https://njp.gov.pk/'));

  // 4. Verify /daily-updates and /sitemap.xml
  console.log('\n=== VERIFYING DAILY UPDATES AND SITEMAP ===');
  const dailyRes = await fetch(`${BASE_URL}/daily-updates`, { headers: { 'Cache-Control': 'no-cache' } });
  console.log('/daily-updates Status:', dailyRes.status, 'Content-Type:', dailyRes.headers.get('content-type'));

  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`, { headers: { 'Cache-Control': 'no-cache' } });
  console.log('/sitemap.xml Status:', sitemapRes.status, 'Content-Type:', sitemapRes.headers.get('content-type'));

  console.log(`\n=== SUMMARY: ${passedImages}/${TARGET_ARTICLES.length} images verified, ${passedArticles}/${TARGET_ARTICLES.length} articles verified ===`);
}

verifyAll().catch(console.error);
