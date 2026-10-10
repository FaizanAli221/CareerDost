import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const imagesToCreate = [
  {
    name: 'sbbu-merit-list-2027',
    category: 'Results',
    org: 'SHAHEED BENAZIR BHUTTO UNIVERSITY (SBBU SBA)',
    title: 'SBBU Merit List 2027',
    subHeading: 'BS Admissions • Check Your Result',
    badge: 'Provisional List Released • Fee Due: 12–22 October 2026',
    footerText: 'General BS: Rs. 68,500 | AI & Cyber Security: Rs. 88,500',
    footerDate: 'Date: 8 October 2026',
    theme: { bg1: '#0f172a', bg2: '#1e3a8a', accent: '#fbbf24', pillBg: '#d97706', badgeBg: 'rgba(251, 191, 36, 0.15)', badgeBorder: 'rgba(251, 191, 36, 0.5)', badgeText: '#fef3c7' }
  },
  {
    name: 'ismo-jobs-2026',
    category: 'Govt Jobs',
    org: 'INDEPENDENT SYSTEM & MARKET OPERATOR (ISMO)',
    title: 'ISMO Jobs 2026',
    subHeading: 'Last Date: 8 October • Apply Through NTS',
    badge: 'Engineering, Finance, IT & Corporate • Online Applications',
    footerText: 'Official NTS Application Portal • Fee via 1Link 1Bill',
    footerDate: 'Deadline: 8 October 2026',
    theme: { bg1: '#0c2340', bg2: '#083344', accent: '#38bdf8', pillBg: '#0284c7', badgeBg: 'rgba(56, 189, 248, 0.15)', badgeBorder: 'rgba(56, 189, 248, 0.5)', badgeText: '#e0f2fe' }
  },
  {
    name: 'nicvd-jobs-2026',
    category: 'Healthcare Jobs',
    org: 'NATIONAL INSTITUTE OF CARDIOVASCULAR DISEASES (NICVD)',
    title: 'NICVD Jobs 2026',
    subHeading: 'Healthcare Opportunities • Last Date: 11 October',
    badge: 'Staff Nurses, Specialists, Technologists • Apply Online via NTS',
    footerText: 'Sindh Domicile Quota • Apply Online at nts.org.pk',
    footerDate: 'Deadline: 11 October 2026',
    theme: { bg1: '#3b0764', bg2: '#7f1d1d', accent: '#fca5a5', pillBg: '#dc2626', badgeBg: 'rgba(239, 68, 68, 0.15)', badgeBorder: 'rgba(239, 68, 68, 0.5)', badgeText: '#fee2e2' }
  },
  {
    name: 'sindh-bs-nursing-admissions-2026-27',
    category: 'Admissions',
    org: 'NTS SINDH NURSING COLLEGES • BSN GENERIC 2026–27',
    title: 'BS Nursing Admissions 2026–27',
    subHeading: 'Multiple Sindh Colleges • Last Date: 30 October',
    badge: 'Memon Karachi, NIAH Hyd, Leaders Khairpur, Visionary Sukkur, Lareb Gambat',
    footerText: '4-Year Generic BSN Degree • Apply Online Through NTS',
    footerDate: 'Last Date: 30 October 2026',
    theme: { bg1: '#064e3b', bg2: '#065f46', accent: '#34d399', pillBg: '#059669', badgeBg: 'rgba(52, 211, 153, 0.15)', badgeBorder: 'rgba(52, 211, 153, 0.5)', badgeText: '#d1fae5' }
  },
  {
    name: 'szabist-scholarship-2026-27',
    category: 'Scholarships',
    org: 'SZABIST UNIVERSITY KARACHI • ERFA DEPARTMENT',
    title: 'SZABIST Scholarship 2026–27',
    subHeading: 'Need-Based Financial Assistance • Last Date: 21 October',
    badge: 'For Newly Registered Undergrad & Grad Students • Max Income Rs1.5M',
    footerText: 'Room 5 ERFA Department • Physical & Online Submission',
    footerDate: 'Deadline: 21 October 2026',
    theme: { bg1: '#4a044e', bg2: '#311042', accent: '#f472b6', pillBg: '#a21caf', badgeBg: 'rgba(244, 114, 182, 0.15)', badgeBorder: 'rgba(244, 114, 182, 0.5)', badgeText: '#fce7f3' }
  }
]

function generateSvg(item) {
  const { category, org, title, subHeading, badge, footerText, footerDate, theme } = item

  const safeOrg = org.replace(/&/g, '&amp;')
  const safeTitle = title.replace(/&/g, '&amp;')
  const safeSubHeading = subHeading.replace(/&/g, '&amp;')
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
      CareerDost.com
    </text>
    
    <!-- Category Pill -->
    <rect x="800" y="-22" width="280" height="44" rx="22" fill="${theme.pillBg}"/>
    <text x="940" y="6" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="16" fill="#ffffff" text-anchor="middle">
      ${category}
    </text>
  </g>

  <!-- Center Content -->
  <g transform="translate(60, 180)">
    <!-- Organization -->
    <text font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="19" fill="${theme.accent}" letter-spacing="1.5">
      ${safeOrg}
    </text>

    <!-- Main Title -->
    <text y="70" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="900" font-size="48" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Sub Heading -->
    <text y="130" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="32" fill="${theme.accent}">
      ${safeSubHeading}
    </text>

    <!-- Subtitle Badge -->
    <rect y="170" width="840" height="54" rx="10" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
    <text x="24" y="204" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="20" fill="${theme.badgeText}">
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
        .jpeg({ quality: 92 })
        .toFile(jpgPath)
      console.log(`Rendered JPG: ${jpgPath}`)
    } catch (err) {
      console.error(`Error rendering JPG for ${item.name}:`, err.message)
    }
  }

  console.log('\nAll 5 Oct 8 featured image assets successfully created in public/images!')
}

run()
