const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/eba54489-3a17-4e85-a8c7-c1a1457d69b7';
const destDir = path.resolve('public/images');

const tasks = [
  {
    src: path.join(brainDir, 'bank_al_habib_jobs_2026_1792917736024.jpg'),
    dest: path.join(destDir, 'bank-al-habib-jobs-2026-karachi.webp'),
    name: 'Bank AL Habib Jobs 2026'
  },
  {
    src: path.join(brainDir, 'bop_jobs_sukkur_agri_rm_2026_1792917740920.jpg'),
    dest: path.join(destDir, 'bank-of-punjab-jobs-2026-sukkur-agri-rm.webp'),
    name: 'BOP Jobs Sukkur Agri RM 2026'
  },
  {
    src: path.join(brainDir, 'phsa_lhv_merit_list_2026_1792917747595.jpg'),
    dest: path.join(destDir, 'phsa-lhv-first-merit-list-2026.webp'),
    name: 'PHSA LHV Merit List 2026'
  }
];

async function processImages() {
  console.log('--- PROCESSING 25 OCTOBER 2026 FEATURED IMAGES ---');
  for (const t of tasks) {
    if (!fs.existsSync(t.src)) {
      console.error(`ERROR: Source file does not exist: ${t.src}`);
      continue;
    }
    await sharp(t.src)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(t.dest);

    const stat = fs.statSync(t.dest);
    const meta = await sharp(t.dest).metadata();
    console.log(`[SUCCESS] ${t.name}:`);
    console.log(`  File: ${t.dest}`);
    console.log(`  Format: ${meta.format} | Dimensions: ${meta.width}x${meta.height} | Size: ${(stat.size / 1024).toFixed(1)} KB`);
  }
}

processImages().catch(err => {
  console.error('Image processing failed:', err);
  process.exit(1);
});
