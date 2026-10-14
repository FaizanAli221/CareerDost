import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/670c0116-9c11-4f73-84f6-9615c949fb46'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: 'zarkhez_asaan_digital_zarai_qarza_guide_1792004006573.jpg',
    target: 'zarkhez-e-asaan-digital-zarai-qarza-guide-2026'
  },
  {
    source: 'benazir_women_worker_card_featured_1792004014096.jpg',
    target: 'benazir-women-agricultural-worker-card-sindh-guide-2026'
  },
  {
    source: 'sphf_housing_reconstruction_featured_1792004008559.jpg',
    target: 'sindh-peoples-housing-flood-affectees-sphf-subsidy-guide-2026'
  },
  {
    source: 'ssep_solar_subsidy_2026_1792004012072.jpg',
    target: 'sindh-solar-energy-project-ssep-home-solar-systems-subsidy-2026'
  },
  {
    source: 'sbp_housing_solar_guide_1792004020950.jpg',
    target: 'sbp-housing-solar-financing-rules-circular-06-2026'
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
