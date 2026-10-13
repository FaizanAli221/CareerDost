import fs from 'fs'
import path from 'path'

// Test if sharp or dynamic canvas is available
let sharp
try {
  const sharpModule = await import('sharp')
  sharp = sharpModule.default
} catch (e) {
  console.log('sharp import note:', e.message)
}

const images = [
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/f361b250-2b88-4918-95f5-2e498d86486f/sindh_hari_card_wheat_1791831285352.jpg',
    slug: 'sindh-wheat-subsidy-benazir-hari-card-2026'
  },
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/f361b250-2b88-4918-95f5-2e498d86486f/sindh_kisan_subsidy_25acre_1791831327171.jpg',
    slug: 'sindh-kisan-subsidy-2026-eligibility-payments'
  },
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/f361b250-2b88-4918-95f5-2e498d86486f/sindh_minimum_wage_2026_1791831356534.jpg',
    slug: 'sindh-minimum-wage-2026-workers-salary'
  },
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/f361b250-2b88-4918-95f5-2e498d86486f/bisp_8171_payment_guide_1791831391180.jpg',
    slug: 'bisp-8171-payment-check-2026-official-guide'
  },
  {
    src: 'C:/Users/Faizan Ali/.gemini/antigravity/brain/f361b250-2b88-4918-95f5-2e498d86486f/sindh_job_portal_clerk_1791831430943.jpg',
    slug: 'sindh-job-portal-2026-junior-clerk-jobs'
  }
]

const outDir = path.resolve('public/images')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

async function processAll() {
  console.log('Processing 5 Sindh public updates images...')

  for (const img of images) {
    if (!fs.existsSync(img.src)) {
      console.error(`Source not found: ${img.src}`)
      continue
    }

    const jpgDest = path.join(outDir, `${img.slug}.jpg`)
    const webpDest = path.join(outDir, `${img.slug}.webp`)

    if (sharp) {
      await sharp(img.src)
        .resize(1200, 675, { fit: 'cover' })
        .jpeg({ quality: 85, progressive: true })
        .toFile(jpgDest)

      await sharp(img.src)
        .resize(1200, 675, { fit: 'cover' })
        .webp({ quality: 82 })
        .toFile(webpDest)

      console.log(`✓ Processed with sharp: ${img.slug} (.jpg & .webp)`)
    } else {
      fs.copyFileSync(img.src, jpgDest)
      fs.copyFileSync(img.src, webpDest)
      console.log(`✓ Copied directly: ${img.slug}`)
    }
  }
  console.log('All 5 images processed successfully!')
}

processAll().catch(console.error)
