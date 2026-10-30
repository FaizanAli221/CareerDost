const fs = require('fs');
const sharp = require('sharp');

async function createPoliceImage() {
  const img = {
    webp: 'public/images/punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables.webp',
    jpg: 'public/images/punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables.jpg',
    title: 'PUNJAB POLICE CONSTABLE RECRUITMENT 2026',
    sub: 'Rajanpur &amp; Rahim Yar Khan | 1,170 Vacancies | BPS-07'
  };

  const svg = `
  <svg width="1536" height="864" viewBox="0 0 1536 864" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#091b29" />
        <stop offset="50%" stop-color="#0f2b48" />
        <stop offset="100%" stop-color="#1e3a8a" />
      </linearGradient>
    </defs>
    <rect width="1536" height="864" fill="url(#bg)" />
    <rect x="80" y="80" width="1376" height="704" rx="24" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
    <circle cx="768" cy="240" r="64" fill="#1e3a8a" stroke="#3b82f6" stroke-width="4" />
    <text x="768" y="258" font-family="Arial, sans-serif" font-weight="bold" font-size="44" fill="#60a5fa" text-anchor="middle">PP</text>
    <text x="768" y="380" font-family="Arial, sans-serif" font-weight="bold" font-size="52" fill="#ffffff" text-anchor="middle">${img.title}</text>
    <text x="768" y="460" font-family="Arial, sans-serif" font-weight="bold" font-size="34" fill="#38bdf8" text-anchor="middle">${img.sub}</text>
    <text x="768" y="530" font-family="Arial, sans-serif" font-size="28" fill="#e2e8f0" text-anchor="middle">Deadline: 31 October 2026 • Matric (Pass/50%) • In-Person at Police Lines</text>
    <text x="768" y="600" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8" text-anchor="middle">Official CareerDost Verified Guide • careerdost.blog</text>
  </svg>`;

  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(img.webp);
  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(img.jpg);
  console.log('Created WebP & JPG for Punjab Police:', img.webp, img.jpg);
}

createPoliceImage().catch(console.error);
