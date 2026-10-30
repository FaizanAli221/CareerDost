const https = require('https');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CareerDost-VisualAuditor/1.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, html: d }));
    }).on('error', reject);
  });
}

function verifyImageBinary(imgUrl) {
  return new Promise((resolve) => {
    const fullUrl = imgUrl.startsWith('http') ? imgUrl : `https://careerdost.blog${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
    const req = https.get(fullUrl, { headers: { 'User-Agent': 'CareerDost-VisualAuditor/1.0' } }, res => {
      const chunks = [];
      let totalBytes = 0;
      res.on('data', chunk => {
        chunks.push(chunk);
        totalBytes += chunk.length;
      });
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || '';
        const isImage = contentType.startsWith('image/');
        
        let width = null;
        let height = null;
        let format = 'unknown';

        // Extract dimension from WebP header
        if (buffer.length > 30 && buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP') {
          format = 'webp';
          if (buffer.slice(12, 16).toString() === 'VP8X') {
            width = 1 + buffer.readUIntLE(24, 3);
            height = 1 + buffer.readUIntLE(27, 3);
          } else if (buffer.slice(12, 16).toString() === 'VP8 ') {
            width = buffer.readUInt16LE(26) & 0x3fff;
            height = buffer.readUInt16LE(28) & 0x3fff;
          }
        } else if (buffer.length > 24 && buffer[0] === 0xff && buffer[1] === 0xd8) {
          format = 'jpeg';
          let offset = 2;
          while (offset < buffer.length) {
            const marker = buffer.readUInt16BE(offset);
            offset += 2;
            if (marker >= 0xffc0 && marker <= 0xffc3) {
              height = buffer.readUInt16BE(offset + 3);
              width = buffer.readUInt16BE(offset + 5);
              break;
            } else {
              offset += buffer.readUInt16BE(offset);
            }
          }
        }

        resolve({
          url: fullUrl,
          status: res.statusCode,
          contentType: contentType,
          isImage: isImage,
          bytes: totalBytes,
          format: format,
          dimensions: width && height ? `${width}x${height}` : 'unknown'
        });
      });
    });
    req.on('error', (err) => resolve({ url: imgUrl, status: 'ERR: ' + err.message, isImage: false, bytes: 0 }));
  });
}

async function runVisualAudit() {
  console.log('=== VISUAL IMAGE RENDERING & RELEVANCE AUDIT ===\n');

  const pagesToTest = [
    // 1. Homepage
    { url: 'https://careerdost.blog/', type: 'Homepage' },

    // 2. All 10 Categories
    { url: 'https://careerdost.blog/category/government-jobs', type: 'Category' },
    { url: 'https://careerdost.blog/category/private-jobs', type: 'Category' },
    { url: 'https://careerdost.blog/category/bank-jobs', type: 'Category' },
    { url: 'https://careerdost.blog/category/it-jobs', type: 'Category' },
    { url: 'https://careerdost.blog/category/scholarships', type: 'Category' },
    { url: 'https://careerdost.blog/category/internships', type: 'Category' },
    { url: 'https://careerdost.blog/category/admissions', type: 'Category' },
    { url: 'https://careerdost.blog/category/government-schemes', type: 'Category' },
    { url: 'https://careerdost.blog/category/results', type: 'Category' },
    { url: 'https://careerdost.blog/category/career-guides', type: 'Category' },

    // 3. Representative Sample of Articles
    { url: 'https://careerdost.blog/jobs/spsc-exam-preparation-screening-challan-guide', type: 'Career Guide' },
    { url: 'https://careerdost.blog/jobs/fpsc-online-application-challan-form-32a-guide', type: 'Career Guide' },
    { url: 'https://careerdost.blog/jobs/national-job-portal-njp-pakistan-application-guide', type: 'Career Guide' },
    { url: 'https://careerdost.blog/jobs/comsats-university-jobs-faculty-staff-2026', type: 'Article' },
    { url: 'https://careerdost.blog/jobs/punjab-university-jobs-faculty-staff-2026', type: 'Article' },
    { url: 'https://careerdost.blog/jobs/fpsc-assistant-director-2026', type: 'Article (Closed)' },
    { url: 'https://careerdost.blog/jobs/turkiye-burslari-scholarship-2026', type: 'Article (Scholarship)' },
    { url: 'https://careerdost.blog/jobs/devsinc-remote-qa-engineer', type: 'Article (IT)' },

    // 4. Daily Updates
    { url: 'https://careerdost.blog/daily-updates/fpsc-consolidated-advertisement-09-2026-announced', type: 'Daily Update' },
    { url: 'https://careerdost.blog/daily-updates/hec-fully-funded-phd-scholarships-2026-open', type: 'Daily Update' },
  ];

  let totalPagesChecked = 0;
  let totalImagesFound = 0;
  let totalImagesVerified = 0;
  let mismatchesOrBroken = [];

  for (const page of pagesToTest) {
    const res = await fetchHtml(page.url);
    totalPagesChecked++;
    if (res.status !== 200) {
      console.log(`[PAGE FAIL] ${page.url} returned HTTP ${res.status}`);
      mismatchesOrBroken.push({ url: page.url, issue: `HTTP ${res.status}` });
      continue;
    }

    // Extract images from rendered HTML
    const imgMatches = [...res.html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    const featuredImgMatches = imgMatches.filter(m => !m[1].includes('icon') && !m[1].includes('logo'));

    console.log(`[TESTING] ${page.type}: ${page.url}`);
    console.log(`  Found ${featuredImgMatches.length} content/featured image(s)`);

    for (const match of featuredImgMatches.slice(0, 3)) { // verify up to 3 images per page
      totalImagesFound++;
      const src = match[1];
      const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
      const altText = altMatch ? altMatch[1] : '';

      const binaryInfo = await verifyImageBinary(src);

      if (binaryInfo.status === 200 && binaryInfo.isImage && binaryInfo.bytes > 1000) {
        totalImagesVerified++;
        console.log(`    ✓ Image: ${src} | Format: ${binaryInfo.format} | Dims: ${binaryInfo.dimensions} | Size: ${(binaryInfo.bytes / 1024).toFixed(1)} KB | Alt: "${altText.slice(0, 35)}..."`);
      } else {
        console.log(`    ✗ BROKEN IMAGE: ${src} | Status: ${binaryInfo.status} | Content-Type: ${binaryInfo.contentType} | Bytes: ${binaryInfo.bytes}`);
        mismatchesOrBroken.push({ page: page.url, src, issue: `Status ${binaryInfo.status}, Bytes: ${binaryInfo.bytes}` });
      }
    }
    console.log('');
  }

  console.log('=== VISUAL AUDIT SUMMARY ===');
  console.log(`Total Pages Checked: ${totalPagesChecked}`);
  console.log(`Total Images Sampled & Verified: ${totalImagesVerified} / ${totalImagesFound}`);
  console.log(`Mismatches or Broken Images: ${mismatchesOrBroken.length}`);
}

runVisualAudit();
