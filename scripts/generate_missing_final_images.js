import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import Database from 'better-sqlite3'
import { execSync } from 'child_process'

const missingItems = [
  {
    slug: 'fpsc-consolidated-advertisement-09-2026-announced',
    title: 'FPSC Consolidated Advertisement No. 09/2026',
    org: 'FEDERAL PUBLIC SERVICE COMMISSION (FPSC)',
    category: 'Govt Jobs',
    badge: '450+ Federal Posts • FIA, Defense & FGEI Ministries',
    footerText: 'Online Applications at fpsc.gov.pk • Open Nationwide',
    footerDate: 'Deadline: 15 October 2026',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669', badgeBg: 'rgba(52, 211, 153, 0.15)', badgeBorder: 'rgba(52, 211, 153, 0.5)', badgeText: '#d1fae5' }
  },
  {
    slug: 'hec-fully-funded-phd-scholarships-2026-open',
    title: 'HEC Overseas PhD Scholarships 2026',
    org: 'HIGHER EDUCATION COMMISSION (HEC) PAKISTAN',
    category: 'Scholarships',
    badge: 'Fully Funded • Tuition, Living Stipend & Airfare Included',
    footerText: 'Apply Online via HEC E-Portal: eportal.hec.gov.pk',
    footerDate: 'Deadline: 30 October 2026',
    theme: { bg1: '#0f766e', bg2: '#042f2e', accent: '#5eead4', pillBg: '#0d9488', badgeBg: 'rgba(94, 234, 212, 0.15)', badgeBorder: 'rgba(94, 234, 212, 0.5)', badgeText: '#ccfbf1' }
  },
  {
    slug: 'state-bank-officer-training-scheme-sbots-batch-27',
    title: 'SBP SBOTS Batch 27 Officers Recruitment',
    org: 'STATE BANK OF PAKISTAN (SBP)',
    category: 'Bank Jobs',
    badge: 'OG-2 Officers Training Scheme • Commercial & Central Banking',
    footerText: 'Registration via NTS: nts.org.pk • NIBAF Residential Training',
    footerDate: 'Deadline: 20 October 2026',
    theme: { bg1: '#78350f', bg2: '#451a03', accent: '#fbbf24', pillBg: '#d97706', badgeBg: 'rgba(251, 191, 36, 0.15)', badgeBorder: 'rgba(251, 191, 36, 0.5)', badgeText: '#fef3c7' }
  },
  {
    slug: 'nts-nat-2026-october-test-roll-number-slips-uploaded',
    title: 'NTS NAT 2026 October Roll Number Slips',
    org: 'NATIONAL TESTING SERVICE (NTS) PAKISTAN',
    category: 'Results',
    badge: 'NAT 2026-X Candidate Admit Cards & Center Allocation Live',
    footerText: 'Download Electronic Slips at portal.nts.org.pk',
    footerDate: 'Test Schedule: October 2026',
    theme: { bg1: '#0c2340', bg2: '#083344', accent: '#38bdf8', pillBg: '#0284c7', badgeBg: 'rgba(56, 189, 248, 0.15)', badgeBorder: 'rgba(56, 189, 248, 0.5)', badgeText: '#e0f2fe' }
  },
  {
    slug: 'pm-youth-laptop-scheme-phase-4-registration-alert',
    title: 'PM Youth Laptop Scheme Phase IV Alert',
    org: "PRIME MINISTER'S YOUTH PROGRAMME & HEC",
    category: 'Schemes',
    badge: 'Free Laptops for Public University Students • Verification Notice',
    footerText: 'Official Portal: pmyp.gov.pk • Check Merit & Enrollment Status',
    footerDate: 'Phase IV Registration Alert',
    theme: { bg1: '#064e3b', bg2: '#0f172a', accent: '#a7f3d0', pillBg: '#059669', badgeBg: 'rgba(167, 243, 208, 0.15)', badgeBorder: 'rgba(167, 243, 208, 0.5)', badgeText: '#d1fae5' }
  }
]

function generateSvg(item) {
  const { category, org, title, badge, footerText, footerDate, theme } = item

  const safeOrg = org.replace(/&/g, '&amp;')
  const safeTitle = title.replace(/&/g, '&amp;')
  const safeBadge = badge.replace(/&/g, '&amp;')
  const safeFooter = footerText.replace(/&/g, '&amp;')
  const safeDate = footerDate.replace(/&/g, '&amp;')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bgGrad_${item.slug.replace(/[^a-zA-Z0-9]/g, '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}" />
      <stop offset="100%" stop-color="${theme.bg2}" />
    </linearGradient>
    <pattern id="grid_${item.slug.replace(/[^a-zA-Z0-9]/g, '_')}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad_${item.slug.replace(/[^a-zA-Z0-9]/g, '_')})"/>
  <rect width="1200" height="675" fill="url(#grid_${item.slug.replace(/[^a-zA-Z0-9]/g, '_')})"/>

  <!-- Top Bar -->
  <g transform="translate(60, 60)">
    <text font-family="'Georgia', serif" font-weight="700" font-size="34" fill="#ffffff">
      CareerDost
    </text>
    <text x="180" y="-3" font-family="'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="14" fill="#d4af37">
      • Pakistan Career Portal
    </text>

    <!-- Category Pill -->
    <rect x="840" y="-22" width="240" height="42" rx="21" fill="${theme.pillBg}"/>
    <text x="960" y="5" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="15" fill="#ffffff" text-anchor="middle">
      ${category}
    </text>
  </g>

  <!-- Center Content -->
  <g transform="translate(60, 200)">
    <!-- Organization -->
    <text font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="20" fill="${theme.accent}" letter-spacing="1">
      ${safeOrg}
    </text>

    <!-- Title -->
    <text y="75" font-family="'Georgia', serif" font-weight="800" font-size="42" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Subtitle Badge -->
    <rect y="125" width="880" height="52" rx="8" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
    <text x="24" y="158" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="18" fill="${theme.badgeText}">
      ${safeBadge}
    </text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(60, 560)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
    
    <text y="42" font-family="'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="18" fill="rgba(255,255,255,0.9)">
      ${safeFooter}
    </text>

    <text x="1080" y="42" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="16" fill="${theme.accent}" text-anchor="end">
      ${safeDate}
    </text>
  </g>
</svg>`
}

async function run() {
  const imagesDir = path.resolve('public/images')
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  console.log('1. Generating missing 16:9 featured images for 5 daily updates...')
  for (const item of missingItems) {
    const svgCode = generateSvg(item)
    const svgPath = path.join(imagesDir, `${item.slug}.svg`)
    const jpgPath = path.join(imagesDir, `${item.slug}.jpg`)

    fs.writeFileSync(svgPath, svgCode, 'utf8')
    await sharp(Buffer.from(svgCode))
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(jpgPath)

    console.log(`  ✓ Created: ${item.slug}.svg & .jpg`)
  }

  // Render PIDCL JPG if SVG exists
  const pidclSvgPath = path.join(imagesDir, 'pidcl-site-engineer-jobs-2026.svg')
  const pidclJpgPath = path.join(imagesDir, 'pidcl-site-engineer-jobs-2026.jpg')
  if (fs.existsSync(pidclSvgPath) && !fs.existsSync(pidclJpgPath)) {
    const svgContent = fs.readFileSync(pidclSvgPath)
    await sharp(svgContent).jpeg({ quality: 85, mozjpeg: true }).toFile(pidclJpgPath)
    console.log('  ✓ Created: pidcl-site-engineer-jobs-2026.jpg')
  }

  console.log('\n2. Updating local SQLite database records...')
  const db = new Database('careerdost.sqlite')
  for (const item of missingItems) {
    const imgPath = `/images/${item.slug}.jpg`
    const altText = `${item.title} — CareerDost`
    db.prepare(`UPDATE daily_updates SET featured_image = ?, image_alt = ? WHERE slug = ?`).run(imgPath, altText, item.slug)
    db.prepare(`UPDATE articles SET featured_image = ?, image_alt = ? WHERE slug = ?`).run(imgPath, altText, item.slug)
  }

  // Also update PIDCL article if slug is httpswwwnjpgovpk or pidcl
  db.prepare(`UPDATE articles SET featured_image = '/images/pidcl-site-engineer-jobs-2026.jpg', image_alt = 'Pakistan Infrastructure Development PIDCL Site Engineer Jobs' WHERE slug = 'httpswwwnjpgovpk' OR slug = 'pidcl-site-engineer-jobs-2026'`).run()
  console.log('  ✓ Local SQLite updated successfully.')

  console.log('\n3. Updating remote Cloudflare D1 database records...')
  try {
    for (const item of missingItems) {
      const imgPath = `/images/${item.slug}.jpg`
      const altText = `${item.title} — CareerDost`.replace(/'/g, "''")
      const sql = `UPDATE daily_updates SET featured_image = '${imgPath}', image_alt = '${altText}' WHERE slug = '${item.slug}';`
      execSync(`node node_modules/wrangler/bin/wrangler.js d1 execute careerdost-db --remote --command="${sql}"`, { stdio: 'ignore' })
    }
    // Update PIDCL on remote D1
    const pidclSql = `UPDATE articles SET featured_image = '/images/pidcl-site-engineer-jobs-2026.jpg', image_alt = 'Pakistan Infrastructure Development PIDCL Jobs' WHERE slug = 'httpswwwnjpgovpk' OR slug = 'pidcl-site-engineer-jobs-2026';`
    execSync(`node node_modules/wrangler/bin/wrangler.js d1 execute careerdost-db --remote --command="${pidclSql}"`, { stdio: 'ignore' })
    console.log('  ✓ Remote D1 updated successfully.')
  } catch (err) {
    console.warn('  Remote D1 update notice:', err.message)
  }

  console.log('\n4. Optimizing oversized existing JPG images in public/images...')
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'))
  let totalSaved = 0
  for (const file of files) {
    const fullPath = path.join(imagesDir, file)
    const stat = fs.statSync(fullPath)
    if (stat.size > 250 * 1024) { // larger than 250KB
      const originalSize = stat.size
      const tempPath = path.join(imagesDir, `_temp_${file}`)
      await sharp(fullPath)
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(tempPath)
      const newStat = fs.statSync(tempPath)
      if (newStat.size < originalSize) {
        fs.copyFileSync(tempPath, fullPath)
        totalSaved += (originalSize - newStat.size)
        console.log(`  Optimized ${file}: ${Math.round(originalSize/1024)}KB -> ${Math.round(newStat.size/1024)}KB`)
      }
      fs.unlinkSync(tempPath)
    }
  }
  console.log(`\nImage optimization complete! Total savings: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB!`)
}

run().catch(console.error)
