import fs from 'fs'
import path from 'path'

const fiveImages = [
  {
    filename: 'phsa-paramedic-general-list-2026.svg',
    category: 'Results',
    org: 'Provincial Health Services Academy (PHSA) KP',
    title: 'Paramedic General Lists 2026',
    badge: '2-Year Paramedic Diploma • Check Your Name',
    deadline: 'PHSA Official Lists Released',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669' }
  },
  {
    filename: 'hec-outstanding-research-awards-2026-27.svg',
    category: 'Education / Opportunities',
    org: 'Higher Education Commission (HEC) Pakistan',
    title: 'HEC Research Awards 2026–27',
    badge: 'Awards Up to Rs1 Million • Best Publication & Researcher',
    deadline: '31 October 2026',
    theme: { bg1: '#701a75', bg2: '#4a044e', accent: '#f0abfc', pillBg: '#a21caf' }
  },
  {
    filename: 'cbd-punjab-paid-internship-2026.svg',
    category: 'Internships',
    org: 'Punjab CBD Development Authority (PCBDDA)',
    title: 'CBD Punjab Paid Internship',
    badge: 'Youth Career Program 2026 • Fresh Graduates',
    deadline: '12 October 2026',
    theme: { bg1: '#1e3a8a', bg2: '#172554', accent: '#60a5fa', pillBg: '#2563eb' }
  },
  {
    filename: 'phsa-kp-bs-nursing-admissions-2026.svg',
    category: 'Admissions',
    org: 'Provincial Health Services Academy (PHSA) KP',
    title: 'BS Nursing Admissions 2026',
    badge: 'Government Colleges – KP • Session 2026–2030',
    deadline: '16 October 2026',
    theme: { bg1: '#065f46', bg2: '#064e3b', accent: '#34d399', pillBg: '#047857' }
  },
  {
    filename: 'commonwealth-scholarship-2027-28.svg',
    category: 'Scholarships',
    org: 'Higher Education Commission & CSC UK',
    title: 'Commonwealth Scholarship 2027–28',
    badge: 'Master’s & PhD – UK • Fully Funded',
    deadline: '20 October 2026',
    theme: { bg1: '#7c2d12', bg2: '#451a03', accent: '#fbbf24', pillBg: '#c2410c' }
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
    <rect x="840" y="-22" width="240" height="42" rx="21" fill="${theme.pillBg}"/>
    <text x="960" y="5" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="16" fill="#ffffff" text-anchor="middle">
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
    <text y="80" font-family="'Georgia', serif" font-weight="800" font-size="44" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Subtitle Badge -->
    <rect y="135" width="620" height="48" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"/>
    <text x="24" y="166" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="20" fill="#ffffff">
      ${safeBadge}
    </text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(60, 560)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    
    <text y="42" font-family="'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="18" fill="rgba(255,255,255,0.85)">
      Verified Official Listing • CareerDost
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

fiveImages.forEach(img => {
  const filePath = path.join(outDir, img.filename)
  fs.writeFileSync(filePath, generateSvg(img), 'utf8')
  console.log(`Generated SVG: ${img.filename}`)
})
