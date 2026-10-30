const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/eba54489-3a17-4e85-a8c7-c1a1457d69b7';
const destDir = path.resolve('public/images');

const tasks = [
  {
    source: path.join(brainDir, 'irsa_telemetry_jobs_2026_1792851539539.jpg'),
    target: 'irsa-jobs-2026-nts-telemetry-engineers-supervisors'
  },
  {
    source: path.join(brainDir, 'cpwb_jobs_2026_featured_banner_1792851552313.jpg'),
    target: 'punjab-child-protection-welfare-bureau-cpwb-jobs-2026'
  },
  {
    source: path.join(brainDir, 'nts_gat_general_viii_2026_featured_1792851565546.jpg'),
    target: 'nts-gat-general-viii-2026-registration-schedule-eligibility'
  }
];

async function run() {
  console.log('=== OPTIMIZING 3 NEW FEATURED IMAGES (WebP & JPG) ===\n');

  for (const t of tasks) {
    if (!fs.existsSync(t.source)) {
      throw new Error(`Source not found: ${t.source}`);
    }

    const targetJpg = path.join(destDir, `${t.target}.jpg`);
    const targetWebp = path.join(destDir, `${t.target}.webp`);

    await sharp(t.source)
      .resize(1536, 864, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(targetJpg);

    await sharp(t.source)
      .resize(1536, 864, { fit: 'cover', position: 'center' })
      .webp({ quality: 90 })
      .toFile(targetWebp);

    const jpgStat = fs.statSync(targetJpg);
    const webpStat = fs.statSync(targetWebp);

    console.log(`✓ Processed: ${t.target}`);
    console.log(`   JPG:  ${jpgStat.size} bytes -> ${targetJpg}`);
    console.log(`   WebP: ${webpStat.size} bytes -> ${targetWebp}`);
  }

  console.log('\nAll 3 new featured images successfully optimized and placed into public/images/.');
}

run().catch(console.error);
