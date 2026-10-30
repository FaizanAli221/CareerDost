const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processDraftImages() {
  const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/6a8c4187-9d65-449f-bea9-1646a275ea1e';
  const destDir = path.resolve('public/images');

  // Let's find latest generated images in brainDir
  const files = fs.readdirSync(brainDir);
  const mofaFiles = files.filter(f => f.startsWith('mofa_jobs_2026') && f.endsWith('.jpg')).sort();
  const nhmpFiles = files.filter(f => f.startsWith('nhmp_jobs_2026') && f.endsWith('.jpg')).sort();

  console.log('MOFA candidate files:', mofaFiles);
  console.log('NHMP candidate files:', nhmpFiles);

  if (mofaFiles.length > 0) {
    const src = path.join(brainDir, mofaFiles[mofaFiles.length - 1]);
    const webpPath = path.join(destDir, 'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online.webp');
    const jpgPath = path.join(destDir, 'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online.jpg');

    await sharp(src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(webpPath);

    await sharp(src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgPath);

    console.log('Processed MOFA images:', webpPath, jpgPath);
  }

  if (nhmpFiles.length > 0) {
    const src = path.join(brainDir, nhmpFiles[nhmpFiles.length - 1]);
    const webpPath = path.join(destDir, 'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online.webp');
    const jpgPath = path.join(destDir, 'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online.jpg');

    await sharp(src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(webpPath);

    await sharp(src)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgPath);

    console.log('Processed NHMP images:', webpPath, jpgPath);
  }
}

processDraftImages().catch(console.error);
