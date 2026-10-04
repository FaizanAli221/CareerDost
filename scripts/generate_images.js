import fs from 'fs'
import path from 'path'

const images = [
  {
    filename: 'gwadar-shipyard-cfo-accounts-officer-2026.svg',
    category: 'Government Jobs',
    org: 'Project Management Cell, Gwadar Shipyard / MoDP',
    title: 'CFO / Accounts Officer (PPS-7)',
    badge: 'Contract Opportunity 2026',
    deadline: '29 September 2026',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669' }
  },
  {
    filename: 'gwadar-shipyard-assistant-pps5-2026.svg',
    category: 'Government Jobs',
    org: 'Project Management Cell, Gwadar Shipyard / MoDP',
    title: 'Assistant (PPS-5)',
    badge: 'Contract Opportunity 2026',
    deadline: '29 September 2026',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669' }
  },
  {
    filename: 'imarat-finance-intern-2026.svg',
    category: 'Internships',
    org: 'IMARAT Group of Companies',
    title: 'Finance Intern',
    badge: 'Fresh Graduates & Students 2026',
    deadline: '30 September 2026',
    theme: { bg1: '#4c1d95', bg2: '#2e1065', accent: '#c084fc', pillBg: '#7c3aed' }
  },
  {
    filename: 'karachi-shipyard-technical-assistant-2026.svg',
    category: 'Government Jobs',
    org: 'Karachi Shipyard & Engineering Works (KSEW)',
    title: 'Technical Assistant (Ship Building)',
    badge: 'Career Opportunity 2026',
    deadline: '05 October 2026',
    theme: { bg1: '#0f766e', bg2: '#134e4a', accent: '#2dd4bf', pillBg: '#0d9488' }
  },
  {
    filename: 'bop-relationship-officer-transaction-banking-2026.svg',
    category: 'Bank Jobs',
    org: 'The Bank of Punjab (BOP)',
    title: 'Relationship Officer – Transaction Banking Sales',
    badge: 'Karachi • Bank Jobs 2026',
    deadline: '06 October 2026',
    theme: { bg1: '#78350f', bg2: '#451a03', accent: '#fbbf24', pillBg: '#b45309' }
  },
  {
    filename: 'bop-relationship-manager-officer-cfc-2026.svg',
    category: 'Bank Jobs',
    org: 'The Bank of Punjab (BOP)',
    title: 'Relationship Manager / Officer CFC',
    badge: 'Lahore, Karachi, Multan, FSD • 2026',
    deadline: '08 October 2026',
    theme: { bg1: '#78350f', bg2: '#451a03', accent: '#fbbf24', pillBg: '#b45309' }
  },
  {
    filename: 'askari-bank-sr-officer-ai-2026.svg',
    category: 'Bank Jobs',
    org: 'Askari Bank Limited',
    title: 'Sr. Officer Artificial Intelligence',
    badge: 'Digital Technology & Agile • Islamabad 2026',
    deadline: '10 October 2026',
    theme: { bg1: '#1e3a8a', bg2: '#172554', accent: '#60a5fa', pillBg: '#2563eb' }
  },
  {
    filename: 'navttc-assistant-private-secretary-2026.svg',
    category: 'Government Jobs',
    org: 'National Vocational & Technical Training Commission (NAVTTC)',
    title: 'Assistant Private Secretary (BPS-16)',
    badge: '11 Vacancies • Govt Jobs 2026',
    deadline: '10 October 2026',
    theme: { bg1: '#065f46', bg2: '#064e3b', accent: '#34d399', pillBg: '#047857' }
  },
  {
    filename: 'navttc-assistant-bps15-2026.svg',
    category: 'Government Jobs',
    org: 'National Vocational & Technical Training Commission (NAVTTC)',
    title: 'Assistant (BPS-15)',
    badge: '15 Vacancies • Govt Jobs 2026',
    deadline: '10 October 2026',
    theme: { bg1: '#065f46', bg2: '#064e3b', accent: '#34d399', pillBg: '#047857' }
  },
  {
    filename: 'navttc-director-bps18-2026.svg',
    category: 'Government Jobs',
    org: 'National Vocational & Technical Training Commission (NAVTTC)',
    title: 'Director (BPS-18)',
    badge: '10 Vacancies • Govt Jobs 2026',
    deadline: '10 October 2026',
    theme: { bg1: '#065f46', bg2: '#064e3b', accent: '#34d399', pillBg: '#047857' }
  }
]

function generateSvg(item) {
  const { category, org, title, badge, deadline, theme } = item
  
  // Escape HTML entities
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
  <g transform="translate(60, 50)">
    <text font-family="'Segoe UI', system-ui, sans-serif" font-weight="800" font-size="28" fill="#ffffff">
      CareerDost
    </text>
    
    <!-- Category Pill -->
    <rect x="940" y="-20" width="140" height="36" rx="18" fill="${theme.pillBg}"/>
    <text x="1010" y="4" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle">
      ${category}
    </text>
  </g>

  <!-- Center Content -->
  <g transform="translate(60, 160)">
    <!-- Organization -->
    <text font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="22" fill="${theme.accent}" letter-spacing="1">
      ${safeOrg.toUpperCase()}
    </text>

    <!-- Title -->
    <text y="75" font-family="'Georgia', serif" font-weight="800" font-size="44" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Subtitle Badge -->
    <rect y="125" width="420" height="44" rx="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"/>
    <text x="20" y="153" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="18" fill="#ffffff">
      ${safeBadge}
    </text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(60, 560)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    
    <text y="40" font-family="'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="16" fill="rgba(255,255,255,0.7)">
      Verified Official Listing • Apply Online
    </text>
    
    <text x="1080" y="40" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="16" fill="${theme.accent}" text-anchor="end">
      Last Date: ${deadline}
    </text>
  </g>
</svg>`
}

const outDir = path.resolve(process.cwd(), 'public/images')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

images.forEach(img => {
  const filePath = path.join(outDir, img.filename)
  fs.writeFileSync(filePath, generateSvg(img), 'utf8')
  console.log(`Generated: ${img.filename}`)
})
