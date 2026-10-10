import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const imagesToCreate = [
  {
    name: 'gepco-jobs-2026',
    category: 'Govt Jobs',
    org: 'GUJRANWALA ELECTRIC POWER COMPANY (GEPCO)',
    title: 'GEPCO Jobs 2026',
    subHeading: 'Assistant Manager Vacancies • Apply Through NTS',
    badge: 'Database Admin • Network Support • Meter Data Management • Last Date: 23 October',
    footerText: 'Testing Agency: NTS Pakistan • Official Online Registration',
    footerDate: 'Deadline: 23 October 2026',
    theme: { bg1: '#0f172a', bg2: '#1e3a8a', accent: '#38bdf8', pillBg: '#0284c7', badgeBg: 'rgba(56, 189, 248, 0.15)', badgeBorder: 'rgba(56, 189, 248, 0.5)', badgeText: '#e0f2fe' }
  },
  {
    name: 'security-papers-jobs-2026',
    category: 'Jobs',
    org: 'SECURITY PAPERS LIMITED (SPL) KARACHI',
    title: 'Security Papers Jobs 2026',
    subHeading: 'Karachi • Salary Up to Rs. 75,000',
    badge: 'Non-Management Program • Mechanical, Electrical, Instruments • Last Date: 11 October',
    footerText: 'Age: Max 25 Years • DAE / Intermediate • Apply via NTS',
    footerDate: 'Deadline: 11 October 2026',
    theme: { bg1: '#111827', bg2: '#064e3b', accent: '#34d399', pillBg: '#059669', badgeBg: 'rgba(52, 211, 153, 0.15)', badgeBorder: 'rgba(52, 211, 153, 0.5)', badgeText: '#d1fae5' }
  },
  {
    name: 'engineering-development-board-jobs-2026',
    category: 'Govt Jobs',
    org: 'ENGINEERING DEVELOPMENT BOARD (EDB) PAKISTAN',
    title: 'Engineering Development Board Jobs 2026',
    subHeading: '19 Advertised Positions • Federal Government',
    badge: 'PPS-6 to PPS-11 • Research Assistants, Managers, Consultants • Last Date: 21 October',
    footerText: 'National Job Portal (NJP) • Ministry of Industries & Production',
    footerDate: 'Deadline: 21 October 2026',
    theme: { bg1: '#14213d', bg2: '#000000', accent: '#fca311', pillBg: '#e67e22', badgeBg: 'rgba(252, 163, 17, 0.15)', badgeBorder: 'rgba(252, 163, 17, 0.5)', badgeText: '#ffedd5' }
  },
  {
    name: 'women-university-ajk-admissions-2026',
    category: 'Admissions',
    org: 'WOMEN UNIVERSITY OF AZAD JAMMU & KASHMIR (WUAJK) BAGH',
    title: 'Women University AJK Admissions 2026',
    subHeading: 'Fall 2026 Intake • Last Date Today: 9 October',
    badge: 'BS, Lateral Entry 5th Sem, MS/MPhil & PhD • Entry Test: 12 October 2026',
    footerText: 'Online Admission Portal: umis.wuajk.edu.pk • Apply Online',
    footerDate: 'Last Date: 9 October 2026',
    theme: { bg1: '#3b0764', bg2: '#701a75', accent: '#f472b6', pillBg: '#c026d3', badgeBg: 'rgba(244, 114, 182, 0.15)', badgeBorder: 'rgba(244, 114, 182, 0.5)', badgeText: '#fce7f3' }
  },
  {
    name: 'university-of-malakand-admissions-2026',
    category: 'Admissions',
    org: 'UNIVERSITY OF MALAKAND (UOM) CHAKDARA DIR LOWER',
    title: 'University of Malakand Admissions 2026',
    subHeading: 'MS, MPhil & PhD Admissions • Apply Before 12 October',
    badge: 'GAT-A, GAT-B, GAT-C & PhD Subject Tests • Conducted by NTS • Test: 18 Oct',
    footerText: 'Fee: Rs. 1,300 • Online Registration at portal.nts.org.pk',
    footerDate: 'Last Date: 12 October 2026',
    theme: { bg1: '#0c2340', bg2: '#1e293b', accent: '#38bdf8', pillBg: '#0369a1', badgeBg: 'rgba(56, 189, 248, 0.15)', badgeBorder: 'rgba(56, 189, 248, 0.5)', badgeText: '#e0f2fe' }
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
    <text y="70" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="900" font-size="46" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Sub Heading -->
    <text y="130" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="30" fill="${theme.accent}">
      ${safeSubHeading}
    </text>

    <!-- Subtitle Badge -->
    <rect y="170" width="880" height="54" rx="10" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
    <text x="24" y="204" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-weight="700" font-size="18" fill="${theme.badgeText}">
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

  console.log('\nAll 5 Oct 9 featured image assets successfully created in public/images!')
}

run()
