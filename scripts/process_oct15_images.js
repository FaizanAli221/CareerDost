import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/505351dc-0b49-43bb-8d87-437c007cb439'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: 'wheat_seed_editorial_clean_1792046279374.jpg',
    target: 'wheat-seed-prices-2026-pakistan-nsdra-directives'
  },
  {
    source: 'fbr_tax_return_filing_deadline_1792046227889.jpg',
    target: 'fbr-tax-return-deadline-2026-extension-status-iris-filing-guide'
  }
]

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  console.log('=== OPTIMIZING 2 NANO BANANA FEATURED IMAGES (1200x675 16:9 WebP & JPG) ===\n')

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

  console.log('\nAll 2 featured images successfully saved to public/images/')
}

processImages().catch(err => {
  console.error('Error processing images:', err)
  process.exit(1)
})
