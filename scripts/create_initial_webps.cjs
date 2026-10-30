const fs = require('fs');
const sharp = require('sharp');

async function createPlaceholders() {
  const images = [
    {
      file: 'public/images/pseb-creative-lead-jobs-2026.webp',
      jpg: 'public/images/pseb-creative-lead-jobs-2026.jpg',
      title: 'PSEB CREATIVE LEAD JOBS 2026',
      sub: 'PPS-8 | Apply by 5 November'
    },
    {
      file: 'public/images/ministry-of-planning-jobs-october-2026.webp',
      jpg: 'public/images/ministry-of-planning-jobs-october-2026.jpg',
      title: 'MINISTRY OF PLANNING JOBS 2026',
      sub: 'Accountant &amp; APS | PPS-6'
    }
  ];

  for (const img of images) {
    if (!fs.existsSync(img.file)) {
      const svg = `
      <svg width="1536" height="864" viewBox="0 0 1536 864" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="50%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
        </defs>
        <rect width="1536" height="864" fill="url(#bg)" />
        <rect x="80" y="80" width="1376" height="704" rx="24" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
        <text x="768" y="380" font-family="Arial, sans-serif" font-weight="bold" font-size="56" fill="#ffffff" text-anchor="middle">${img.title}</text>
        <text x="768" y="460" font-family="Arial, sans-serif" font-weight="bold" font-size="36" fill="#34d399" text-anchor="middle">${img.sub}</text>
        <text x="768" y="540" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">careerdost.blog</text>
      </svg>`;
      await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(img.file);
      await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(img.jpg);
      console.log('Created placeholder WebP & JPG:', img.file);
    } else {
      console.log('File already exists:', img.file);
    }
  }
}

createPlaceholders().catch(console.error);
