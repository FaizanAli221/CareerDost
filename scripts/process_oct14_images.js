import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const brainDir = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/82414289-ef5f-4077-8e52-9c67ee65c355'
const destDir = path.resolve('public/images')

const imageMap = [
  {
    source: 'sindh_mamta_programme_2026_1791950439956.jpg',
    targets: ['sindh-mamta-programme-2026-october-dashboard']
  },
  {
    source: 'benazir_hunarmand_karachi_2026_1791950451255.jpg',
    targets: ['benazir-hunarmand-programme-2026-karachi-guide']
  },
  {
    source: 'pakistan_wheat_support_price_2026_1791950448745.jpg',
    targets: ['pakistan-wheat-support-price-2026-27']
  },
  {
    source: 'wheat_imports_karachi_2026_v2_1791950534626.jpg',
    targets: ['wheat-imports-karachi-october-2026']
  },
  {
    source: 'bisp_social_protection_wallet_2026_1791950446201.jpg',
    targets: [
      'bisp-8171-payment-check-2026-official-guide',
      'bisp-social-protection-wallet-2026'
    ]
  },
  {
    source: 'nadra_digital_payments_2026_1791950543202.jpg',
    targets: ['nadra-digital-payments-2026']
  }
]

async function processImages() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  console.log('=== PROCESSING 6 NANO BANANA FEATURED IMAGES (1200x675 16:9 WebP & JPG) ===\n')

  for (const item of imageMap) {
    const srcPath = path.join(brainDir, item.source)
    if (!fs.existsSync(srcPath)) {
      console.error(`Source image not found: ${srcPath}`)
      continue
    }

    for (const targetSlug of item.targets) {
      const targetJpg = path.join(destDir, `${targetSlug}.jpg`)
      const targetWebp = path.join(destDir, `${targetSlug}.webp`)

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

      console.log(`✓ Processed: ${targetSlug} (JPG & WebP 1200x675)`)
    }
  }

  console.log('\nAll Nano Banana images successfully optimized and saved to public/images/')
}

processImages().catch(err => {
  console.error('Error processing images:', err)
  process.exit(1)
})
