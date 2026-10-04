import fs from 'fs'
import path from 'path'

const newImages = [
  {
    filename: 'pm-fuel-relief-scheme-2026.svg',
    category: 'Government Schemes',
    org: 'Ministry of IT & Telecom / Govt of Pakistan',
    title: 'PM Fuel Relief Scheme 2026',
    badge: 'Rs100/L Petrol Relief • Check Eligibility',
    deadline: 'SMS 9771 Registration',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669' }
  },
  {
    filename: 'alkhidmat-foundation-jobs-2026.svg',
    category: 'Private Jobs',
    org: 'Alkhidmat Foundation Pakistan',
    title: 'Alkhidmat Jobs 2026',
    badge: 'Latest Verified Vacancies • Apply Online',
    deadline: '08 October 2026',
    theme: { bg1: '#0f4c81', bg2: '#042544', accent: '#38bdf8', pillBg: '#0284c7' }
  },
  {
    filename: 'bridgeusa-j1-teacher-program-2026.svg',
    category: 'Scholarships',
    org: 'U.S. Department of State BridgeUSA',
    title: 'Teach in USA: J-1 Teacher Program',
    badge: 'Eligibility & Application Guide for Teachers',
    deadline: 'Rolling Applications',
    theme: { bg1: '#1e293b', bg2: '#0f172a', accent: '#60a5fa', pillBg: '#2563eb' }
  },
  {
    filename: 'sindh-pink-scooty-scheme-2026.svg',
    category: 'Government Schemes',
    org: 'Sindh Mass Transit Authority (SMTA)',
    title: 'Sindh Pink Scooty Scheme 2026',
    badge: 'Registration Open • Eligibility & Apply Online',
    deadline: 'Online SMTA Portal',
    theme: { bg1: '#831843', bg2: '#4c0519', accent: '#f472b6', pillBg: '#db2777' }
  }
]

function generateSvg(item) {
  const { category, org, title, badge, deadline, theme } = item
  
  const safeOrg = org.replace(/&/g, '&amp;')
  const safeTitle = title.replace(/&/g, '&amp;')
  const safeBadge = badge.replace(/&/g, '&amp;')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}" />
      <stop offset="100%" stop-color="${theme.bg2}" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>

  <!-- Top Bar -->
  <g transform="translate(60, 60)">
    <text font-family="'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="32" fill="#ffffff">
      CareerDost
    </text>
    
    <!-- Category Pill -->
    <rect x="860" y="-22" width="220" height="42" rx="21" fill="${theme.pillBg}"/>
    <text x="970" y="5" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="16" fill="#ffffff" text-anchor="middle">
      ${category}
    </text>
  </g>

  <!-- Center Content -->
  <g transform="translate(60, 190)">
    <!-- Organization -->
    <text font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="22" fill="${theme.accent}" letter-spacing="1">
      ${safeOrg.toUpperCase()}
    </text>

    <!-- Title -->
    <text y="80" font-family="'Georgia', serif" font-weight="800" font-size="46" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Subtitle Badge -->
    <rect y="135" width="580" height="48" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"/>
    <text x="24" y="166" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="20" fill="#ffffff">
      ${safeBadge}
    </text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(60, 560)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    
    <text y="42" font-family="'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="18" fill="rgba(255,255,255,0.85)">
      Verified Official Guide • CareerDost
    </text>
    
    <text x="1080" y="42" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="18" fill="${theme.accent}" text-anchor="end">
      Status: ${deadline}
    </text>
  </g>
</svg>`
}

const outDir = path.resolve(process.cwd(), 'public/images')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

newImages.forEach(img => {
  const filePath = path.join(outDir, img.filename)
  fs.writeFileSync(filePath, generateSvg(img), 'utf8')
  console.log(`Generated: ${img.filename}`)
})
