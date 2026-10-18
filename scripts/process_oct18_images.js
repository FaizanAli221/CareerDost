import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/21877b4b-d7d0-41d1-be4d-e3edcf2b7e23'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: 'samba_bank_relationship_associate_2026_1792340371388.jpg',
    target: 'samba-bank-relationship-associate-jobs-2026'
  },
  {
    source: 'bank_alfalah_cso_clean_2026_1792341010191.jpg',
    target: 'bank-alfalah-jobs-internships-2026'
  },
  {
    source: 'mrp_elite_gto_karachi_2026_1792340493803.jpg',
    target: 'mrp-elite-graduate-trainee-karachi-2026'
  },
  {
    source: 'ezy_business_sales_internship_2026_1792340574291.jpg',
    target: 'ezy-business-applications-paid-internship-karachi-2026'
  },
  {
    source: 'unilever_pakistan_clean_2026_1792341102435.jpg',
    target: 'unilever-pakistan-jobs-october-2026'
  }
]

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  console.log('=== OPTIMIZING 5 OCT 18 NANO BANANA FEATURED IMAGES (1200x675 16:9 WebP & JPG) ===\n')

  for (const item of imageMap) {
    const srcPath = path.join(brainDir, item.source)
    if (!fs.existsSync(srcPath)) {
      console.error(`Source image not found: ${srcPath}`)
      process.exit(1)
    }

    const targetJpg = path.join(destDir, `${item.target}.jpg`)
    const targetWebp = path.join(destDir, `${item.target}.webp`)

    await sharp(srcPath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(targetJpg)

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
