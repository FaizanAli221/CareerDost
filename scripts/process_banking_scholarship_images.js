import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/505351dc-0b49-43bb-8d87-437c007cb439'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: '10pearls_shine_internship_featured_1792089287823.jpg',
    target: '10pearls-shine-virtual-internship-2026'
  },
  {
    source: 'mcb_bank_infosec_trainee_2026_1792089287872.jpg',
    target: 'mcb-bank-infosec-trainee-jobs-2026'
  },
  {
    source: 'meezan_justuju_2026_training_1792089331443.jpg',
    target: 'meezan-justuju-batch-5-2026'
  },
  {
    source: 'japan_jds_scholarship_2026_1792089329672.jpg',
    target: 'japan-jds-scholarship-2026-pakistan'
  },
  {
    source: 'bank_alfalah_jobs_2026_1792089287903.jpg',
    target: 'bank-alfalah-jobs-internships-2026'
  }
]

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  console.log('=== OPTIMIZING 5 NANO BANANA FEATURED IMAGES (1200x675 16:9 WebP & JPG) ===\n')

  for (const item of imageMap) {
    const srcPath = path.join(brainDir, item.source)
    if (!fs.existsSync(srcPath)) {
      console.error(`Source image not found: ${srcPath}`)
      continue
    }

    const targetJpg = path.join(destDir, `${item.target}.jpg`)
    const targetWebp = path.join(destDir, `${item.target}.webp`)

    // Resize and optimize JPEG to 1200x675 (16:9)
    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(targetJpg)

    // Resize and optimize WebP to 1200x675 (16:9)
    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .webp({ quality: 90 })
      .toFile(targetWebp)

    const jpgStat = fs.statSync(targetJpg)
    const webpStat = fs.statSync(targetWebp)

    console.log(`✓ Processed: ${item.target}`)
    console.log(`    JPG:  ${(jpgStat.size / 1024).toFixed(1)} KB`)
    console.log(`    WebP: ${(webpStat.size / 1024).toFixed(1)} KB`)
  }

  console.log('\nAll 5 featured images successfully saved to public/images/')
}

processImages().catch(err => {
  console.error('Error processing images:', err)
  process.exit(1)
})
