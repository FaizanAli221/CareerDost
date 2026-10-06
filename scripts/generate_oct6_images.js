import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const imagesToCreate = [
  {
    name: 'chevening-scholarship-2027-28',
    category: 'Scholarships',
    org: 'UK FOREIGN, COMMONWEALTH & DEVELOPMENT OFFICE (FCDO)',
    title: 'Chevening Scholarship 2027–28',
    badge: 'DEADLINE TODAY • 6 October 2026 • 16:00 PKT',
    footerText: 'Fully Funded Master’s in UK • 100% Tuition & Living Stipend',
    footerDate: 'LAST DATE: TODAY 6 OCT (11:00 UTC)',
    theme: { bg1: '#0f172a', bg2: '#1e1b4b', accent: '#38bdf8', pillBg: '#0284c7', badgeBg: 'rgba(239, 68, 68, 0.25)', badgeBorder: 'rgba(239, 68, 68, 0.6)', badgeText: '#fca5a5' }
  },
  {
    name: 'habib-university-admissions-2027',
    category: 'Admissions',
    org: 'HABIB UNIVERSITY KARACHI',
    title: 'Habib University Admissions 2027',
    badge: 'October Series • Engineering, CS & Social Sciences',
    footerText: 'Undergraduate Intake • Scholarships & Need-Based Aid Available',
    footerDate: 'Deadline: 21 October 2026',
    theme: { bg1: '#4a044e', bg2: '#2e1065', accent: '#f472b6', pillBg: '#a21caf', badgeBg: 'rgba(255, 255, 255, 0.12)', badgeBorder: 'rgba(255, 255, 255, 0.25)', badgeText: '#ffffff' }
  },
  {
    name: 'hec-jobs-2026',
    category: 'Govt Jobs',
    org: 'HIGHER EDUCATION COMMISSION (HEC) PAKISTAN',
    title: 'HEC Jobs 2026 – 9 Vacancies',
    badge: 'Pay Range: Rs40,700 – Rs398,130/mo • PPS & BPS Scales',
    footerText: 'Project Director, Managers, Law Officer, Assistants & Attendant',
    footerDate: 'Deadline: 14 October 2026',
    theme: { bg1: '#1e293b', bg2: '#0f172a', accent: '#7dd3fc', pillBg: '#0284c7', badgeBg: 'rgba(255, 255, 255, 0.12)', badgeBorder: 'rgba(255, 255, 255, 0.25)', badgeText: '#ffffff' }
  },
  {
    name: 'swiss-government-excellence-scholarships-2027',
    category: 'Scholarships',
    org: 'SWISS EMBASSY & FCS / ESKAS SWITZERLAND',
    title: 'Swiss Govt Excellence Scholarships',
    badge: 'Academic Year 2027–28 • Research & PhD Fellowships',
    footerText: 'Full Monthly Stipend (CHF 1,920–3,500) • Mandatory Health Coverage',
    footerDate: 'Deadline: 31 October 2026',
    theme: { bg1: '#7c2d12', bg2: '#451a03', accent: '#fdba74', pillBg: '#ea580c', badgeBg: 'rgba(255, 255, 255, 0.12)', badgeBorder: 'rgba(255, 255, 255, 0.25)', badgeText: '#ffffff' }
  },
  {
    name: 'hec-outstanding-research-awards-2026-27',
    category: 'Research Awards',
    org: 'HIGHER EDUCATION COMMISSION (HEC) PAKISTAN',
    title: 'HEC Research Awards 2026–27',
    badge: 'Awards Up to Rs1 Million • Best Publication & Researchers',
    footerText: 'National Research Excellence Grants • Open for Faculty & Scholars',
    footerDate: 'Deadline: 31 October 2026',
    theme: { bg1: '#701a75', bg2: '#4a044e', accent: '#f0abfc', pillBg: '#a21caf', badgeBg: 'rgba(255, 255, 255, 0.12)', badgeBorder: 'rgba(255, 255, 255, 0.25)', badgeText: '#ffffff' }
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
    <linearGradient id="bgGrad_${item.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}" />
      <stop offset="100%" stop-color="${theme.bg2}" />
    </linearGradient>
    <pattern id="grid_${item.name}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad_${item.name})"/>
  <rect width="1200" height="675" fill="url(#grid_${item.name})"/>

  <!-- Top Decorative Bar -->
  <g transform="translate(60, 60)">
    <text font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="900" font-size="34" fill="#ffffff" letter-spacing="-0.5">
      CareerDost
    </text>
    
    <!-- Category Pill -->
    <rect x="840" y="-22" width="240" height="44" rx="22" fill="${theme.pillBg}"/>
    <text x="960" y="6" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="16" fill="#ffffff" text-anchor="middle">
      ${category}
    </text>
  </g>

  <!-- Center Content -->
  <g transform="translate(60, 195)">
    <!-- Organization -->
    <text font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="20" fill="${theme.accent}" letter-spacing="1.5">
      ${safeOrg}
    </text>

    <!-- Title -->
    <text y="75" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="800" font-size="44" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Subtitle Badge -->
    <rect y="125" width="760" height="52" rx="10" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
    <text x="24" y="158" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="20" fill="${theme.badgeText}">
      ${safeBadge}
    </text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(60, 560)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    
    <text y="42" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="600" font-size="18" fill="rgba(255,255,255,0.85)">
      ${safeFooter}
    </text>
    
    <text x="1080" y="42" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="18" fill="${theme.accent}" text-anchor="end">
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

  for (const item of imagesToCreate) {
    const svgCode = generateSvg(item)
    const svgPath = path.join(imagesDir, `${item.name}.svg`)
    const jpgPath = path.join(imagesDir, `${item.name}.jpg`)

    fs.writeFileSync(svgPath, svgCode, 'utf8')
    console.log(`Saved SVG: ${svgPath}`)

    try {
      await sharp(Buffer.from(svgCode))
        .jpeg({ quality: 90 })
        .toFile(jpgPath)
      console.log(`Rendered JPG: ${jpgPath}`)
    } catch (err) {
      console.error(`Error rendering JPG for ${item.name}:`, err.message)
    }
  }

  console.log('All 5 featured image assets successfully generated in public/images!')
}

run()
