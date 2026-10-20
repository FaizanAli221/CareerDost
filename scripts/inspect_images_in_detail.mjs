import fs from 'fs';
import { queryD1 } from './audit_d1_investigation.mjs';

async function run() {
  console.log('=== FULL AUDIT OF ALL 166 ARTICLES IN D1 VS LOCAL VS LIVE ===\n');

  const articles = await queryD1("SELECT id, slug, title, featured_image, image_alt, last_date, no_deadline, publish_date FROM articles ORDER BY id DESC");
  
  const publicFiles = new Set(fs.readdirSync('public/images'));
  const distFiles = fs.existsSync('dist/images') ? new Set(fs.readdirSync('dist/images')) : new Set();

  console.log(`Loaded ${articles.length} articles from D1.`);
  console.log(`Files in public/images: ${publicFiles.size}`);
  console.log(`Files in dist/images: ${distFiles.size}`);

  const results = [];
  const brokenOrMissing = [];
  const svgImages = [];

  for (const a of articles) {
    const imgPath = a.featured_image || '';
    const filename = imgPath.replace(/^\/images\//, '');
    const inPublic = publicFiles.has(filename);
    const inDist = distFiles.has(filename);

    results.push({
      id: a.id,
      slug: a.slug,
      title: a.title,
      image: imgPath,
      filename,
      inPublic,
      inDist,
      isSvg: filename.endsWith('.svg')
    });

    if (!imgPath || (!inPublic && !imgPath.startsWith('http'))) {
      brokenOrMissing.push({
        id: a.id,
        slug: a.slug,
        title: a.title,
        image: imgPath,
        reason: !imgPath ? 'Empty image path' : 'File missing from public/images'
      });
    }

    if (filename.endsWith('.svg')) {
      svgImages.push({
        id: a.id,
        slug: a.slug,
        title: a.title,
        image: imgPath
      });
    }
  }

  console.log(`\nArticles with missing local files in public/images: ${brokenOrMissing.length}`);
  brokenOrMissing.forEach(b => console.log(`  [${b.id}] ${b.slug} | img: "${b.image}" | reason: ${b.reason}`));

  console.log(`\nArticles with SVG images in D1: ${svgImages.length}`);
  svgImages.forEach(s => console.log(`  [${s.id}] ${s.slug} | img: "${s.image}"`));

  // Now inspect the 14/16 recently replaced/supplied images
  const targetSlugs = [
    'bank-of-punjab-relationship-officer-transaction-banking-2026',
    'bank-of-punjab-relationship-manager-officer-cfc-jobs-2026',
    'memon-college-of-nursing-karachi-bsn-admissions-2026-27',
    'niahs-hyderabad-bsn-nursing-admissions-2026-27',
    'nts-nat-xi-2026-november-registration-guide',
    'gepco-jobs-2026',
    'hec-uk-commonwealth-scholarships-2027-28',
    'gwadar-shipyard-cfo-accounts-officer-jobs-2026',
    'imarat-finance-intern-jobs-2026',
    'gwadar-shipyard-assistant-jobs-2026',
    'hec-outstanding-research-awards-2026-27',
    'uajk-admissions-2026-deadline-extended',
    'petrol-price-reduced-pakistan-september-2026',
    'navttc-assistant-private-secretary-jobs-2026',
    'karachi-shipyard-technical-assistant-jobs-2026',
    'sbbu-affiliated-colleges-admissions-2026'
  ];

  console.log('\n=== INSPECTING THE RECENTLY REPLACED / SUPPLIED IMAGES ===');
  for (const slug of targetSlugs) {
    const art = articles.find(a => a.slug === slug);
    if (!art) {
      console.log(`\n[NOT FOUND IN D1] ${slug}`);
      continue;
    }

    const liveArticleUrl = `https://careerdost.blog/jobs/${slug}`;
    const liveImageUrl = `https://careerdost.blog${art.featured_image}`;

    let imgStatus = 0;
    let imgContentType = '';
    let imgLength = '';
    try {
      const res = await fetch(liveImageUrl, { method: 'HEAD' });
      imgStatus = res.status;
      imgContentType = res.headers.get('content-type') || '';
      imgLength = res.headers.get('content-length') || '';
    } catch (e) {
      imgStatus = e.message;
    }

    let articleStatus = 0;
    let renderedImageInHtml = 'NONE';
    let renderedOgImage = 'NONE';
    try {
      const aRes = await fetch(liveArticleUrl);
      articleStatus = aRes.status;
      const html = await aRes.text();
      const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
      renderedImageInHtml = imgMatch ? imgMatch[1] : 'NONE';
      renderedOgImage = ogMatch ? ogMatch[1] : 'NONE';
    } catch (e) {
      articleStatus = e.message;
    }

    console.log(`\nSlug: ${slug}`);
    console.log(`  Title: ${art.title}`);
    console.log(`  D1 featured_image: ${art.featured_image}`);
    console.log(`  Local file in public/images: ${publicFiles.has(art.featured_image.replace('/images/', '')) ? 'EXISTS' : 'MISSING'}`);
    console.log(`  Local file in dist/images: ${distFiles.has(art.featured_image.replace('/images/', '')) ? 'EXISTS' : 'MISSING'}`);
    console.log(`  Live image HTTP: ${imgStatus} (${imgContentType}, ${imgLength} bytes)`);
    console.log(`  Live article HTTP: ${articleStatus}`);
    console.log(`  Live HTML rendered <img>: ${renderedImageInHtml}`);
    console.log(`  Live HTML rendered og:image: ${renderedOgImage}`);
  }
}

run().catch(console.error);
