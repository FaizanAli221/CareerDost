import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const items = [
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/d2716482-38ca-41cd-a389-40279e51c226/sindh_graduate_internship_banner_1794065501622.jpg',
    target: 'sindh-government-graduate-internship-program-2026',
    tag: 'GOVERNMENT OF SINDH • INTERNSHIP UPDATE',
    title: 'SINDH GRADUATE INTERNSHIP PROGRAM 2026',
    subtitle: 'Registration, Eligibility & I Work for Sindh Portal Updates',
    meta: 'Degree Holders • Fresh Graduates • Awaiting Official Notification',
    badgeColor: '#10b981', // emerald
  },
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/d2716482-38ca-41cd-a389-40279e51c226/kp_paid_internships_2026_banner_1794065504043.jpg',
    target: 'kp-government-20000-paid-internships-2026',
    tag: 'GOVERNMENT OF KHYBER PAKHTUNKHWA • NEW PROGRAM',
    title: 'KP GOVERNMENT 20,000 PAID INTERNSHIPS',
    subtitle: 'Rs. 30,000 Monthly Stipend • 3 Months Duration',
    meta: '50% Women Quota • Private Sector Placements • Rs. 2 Billion Initiative',
    badgeColor: '#06b6d4', // cyan
  },
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/d2716482-38ca-41cd-a389-40279e51c226/gates_cambridge_scholarship_banner_1794065513016.jpg',
    target: 'gates-cambridge-scholarship-2027',
    tag: 'UNIVERSITY OF CAMBRIDGE • GATES CAMBRIDGE TRUST',
    title: 'GATES CAMBRIDGE SCHOLARSHIP 2027',
    subtitle: 'Fully Funded Postgraduate Scholarship for Pakistani Students',
    meta: 'Full Fees + Maintenance Allowance + Airfare • Course Deadlines: Dec 2026 & Jan 2027',
    badgeColor: '#f59e0b', // amber / gold
  }
];

const destDir = path.resolve('public/images');

async function processImages() {
  console.log('=== PROCESSING FEATURED IMAGES WITH SHARP (1200x675 16:9 WebP & JPG) ===\n');

  for (const item of items) {
    if (!fs.existsSync(item.src)) {
      throw new Error(`Source image missing: ${item.src}`);
    }

    const baseBuffer = await sharp(item.src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .toBuffer();

    const tagEscaped = escapeXml(item.tag);
    const titleEscaped = escapeXml(item.title);
    const subtitleEscaped = escapeXml(item.subtitle);
    const metaEscaped = escapeXml(item.meta);

    const overlaySvg = `
    <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scrim-${item.target}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#020617" stop-opacity="0.45" />
          <stop offset="40%" stop-color="#020617" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#020617" stop-opacity="0.96" />
        </linearGradient>
      </defs>
      
      <!-- Gradient overlay -->
      <rect width="1200" height="675" fill="url(#scrim-${item.target})" />
      
      <!-- Border card frame -->
      <rect x="36" y="36" width="1128" height="603" rx="16" fill="none" stroke="rgba(255, 255, 255, 0.16)" stroke-width="2" />
      
      <!-- Tag Pill -->
      <rect x="64" y="68" width="${item.tag.length * 10 + 36}" height="36" rx="8" fill="rgba(15, 23, 42, 0.88)" stroke="${item.badgeColor}" stroke-width="1.5" />
      <text x="${64 + (item.tag.length * 10 + 36) / 2}" y="92" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="13" fill="${item.badgeColor}" text-anchor="middle" letter-spacing="1.5">${tagEscaped}</text>
      
      <!-- Title -->
      <text x="64" y="270" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="0.5">
        ${titleEscaped}
      </text>
      
      <!-- Subtitle -->
      <text x="64" y="335" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="26" fill="#e2e8f0">
        ${subtitleEscaped}
      </text>
      
      <!-- Meta Details Card -->
      <rect x="64" y="380" width="1072" height="74" rx="12" fill="rgba(30, 41, 59, 0.72)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />
      <text x="94" y="426" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="20" fill="${item.badgeColor}">
        ${metaEscaped}
      </text>
      
      <!-- Brand Footer -->
      <circle cx="80" cy="590" r="14" fill="${item.badgeColor}" />
      <text x="80" y="595" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="14" fill="#0f172a" text-anchor="middle">CD</text>
      <text x="108" y="596" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#ffffff">CareerDost</text>
      <text x="220" y="596" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="15" fill="#94a3b8">| Authentic Opportunity &amp; Career Updates for Pakistan • careerdost.blog</text>
    </svg>`;

    const targetJpg = path.join(destDir, `${item.target}.jpg`);
    const targetWebp = path.join(destDir, `${item.target}.webp`);

    await sharp(baseBuffer)
      .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(targetJpg);

    await sharp(baseBuffer)
      .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
      .webp({ quality: 88 })
      .toFile(targetWebp);

    const statJpg = fs.statSync(targetJpg);
    const statWebp = fs.statSync(targetWebp);

    console.log(`✓ Processed: ${item.target}`);
    console.log(`   JPG:  ${statJpg.size} bytes (${targetJpg})`);
    console.log(`   WebP: ${statWebp.size} bytes (${targetWebp})`);
  }

  console.log('\nAll 3 featured images successfully generated and saved in public/images/!');
}

processImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
