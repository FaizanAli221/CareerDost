import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import Database from 'better-sqlite3'

const missingItems = [
  {
    slug: 'fpsc-assistant-director-2026',
    title: 'FPSC Assistant Director (BPS-17) Jobs',
    org: 'Federal Public Service Commission (FPSC)',
    category: 'Government Jobs',
    catSlug: 'government-jobs',
    badge: 'Federal Ministries • Regular BPS-17 Vacancies',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669' }
  },
  {
    slug: 'punjab-police-constable-recruitment-2026',
    title: 'Punjab Police Constable Recruitment 2026',
    org: 'Punjab Police Department',
    category: 'Government Jobs',
    catSlug: 'government-jobs',
    badge: 'District Police & PHP • Matric & Intermediate',
    theme: { bg1: '#0f172a', bg2: '#020617', accent: '#38bdf8', pillBg: '#0284c7' }
  },
  {
    slug: 'nadra-data-entry-operator-2026',
    title: 'NADRA Data Entry Operator Walk-in Test',
    org: 'National Database & Registration Authority',
    category: 'Government Jobs',
    catSlug: 'government-jobs',
    badge: 'Walk-in Screening • Across Regional Centers',
    theme: { bg1: '#064e3b', bg2: '#042f2e', accent: '#a7f3d0', pillBg: '#0d9488' }
  },
  {
    slug: 'systems-limited-hiring-software-engineers',
    title: 'Systems Limited Software Engineer Hiring',
    org: 'Systems Limited Pakistan',
    category: 'IT Jobs',
    catSlug: 'it-jobs',
    badge: 'Full Stack, Cloud & AI • Lahore & Karachi',
    theme: { bg1: '#1e1b4b', bg2: '#0f0e26', accent: '#818cf8', pillBg: '#4f46e5' }
  },
  {
    slug: 'devsinc-remote-qa-engineer',
    title: 'DevsInc Remote QA Automation Engineer',
    org: 'DevsInc Pakistan',
    category: 'IT Jobs',
    catSlug: 'it-jobs',
    badge: 'Remote Position • Selenium, Cypress & Python',
    theme: { bg1: '#1e293b', bg2: '#0f172a', accent: '#a5b4fc', pillBg: '#6366f1' }
  },
  {
    slug: 'hbl-management-trainee-officer-2026',
    title: 'HBL Management Trainee Officers (MTO) 2026',
    org: 'Habib Bank Limited (HBL)',
    category: 'Bank Jobs',
    catSlug: 'bank-jobs',
    badge: 'Leading Banking Career • Nationwide Induction',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#6ee7b7', pillBg: '#059669' }
  },
  {
    slug: 'meezan-bank-teller-2026',
    title: 'Meezan Bank Branch Service Officer / Teller',
    org: 'Meezan Bank Limited',
    category: 'Bank Jobs',
    catSlug: 'bank-jobs',
    badge: 'Islamic Banking Careers • Fresh Graduates Welcome',
    theme: { bg1: '#311042', bg2: '#180524', accent: '#f0abfc', pillBg: '#9333ea' }
  },
  {
    slug: 'phec-phd-scholarship-2026',
    title: 'Punjab HEC Fully Funded PhD Scholarships',
    org: 'Punjab Higher Education Commission (PHEC)',
    category: 'Scholarships',
    catSlug: 'scholarships',
    badge: 'Foreign & Local Scholarships • Living Allowance',
    theme: { bg1: '#14532d', bg2: '#052e16', accent: '#86efac', pillBg: '#16a34a' }
  },
  {
    slug: 'turkiye-burslari-scholarship-2026',
    title: 'Türkiye Burslari Scholarships 2026',
    org: 'Government of Republic of Türkiye',
    category: 'Scholarships',
    catSlug: 'scholarships',
    badge: 'Fully Funded • Undergraduate, Master & PhD',
    theme: { bg1: '#7f1d1d', bg2: '#450a0a', accent: '#fca5a5', pillBg: '#dc2626' }
  },
  {
    slug: 'ufone-summer-internship-2026',
    title: 'Ufone Summer Internship Program 2026',
    org: 'PTCL & Ufone Group',
    category: 'Internships',
    catSlug: 'internships',
    badge: 'Paid Corporate Internship • Telecom & Digital',
    theme: { bg1: '#7c2d12', bg2: '#431407', accent: '#fdba74', pillBg: '#ea580c' }
  },
  {
    slug: 'planning-commission-internship-2026',
    title: 'Planning Commission Research Internship',
    org: 'Ministry of Planning, Development & Special Initiatives',
    category: 'Internships',
    catSlug: 'internships',
    badge: 'Public Policy & Economics • Federal Government',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#6ee7b7', pillBg: '#059669' }
  },
  {
    slug: 'nust-undergraduate-admissions-fall-2026',
    title: 'NUST Undergraduate Admissions Fall 2026',
    org: 'National University of Sciences & Technology (NUST)',
    category: 'Admissions',
    catSlug: 'admissions',
    badge: 'Engineering, Computing & Business Disciplines',
    theme: { bg1: '#1e3a8a', bg2: '#0f172a', accent: '#93c5fd', pillBg: '#2563eb' }
  },
  {
    slug: 'punjab-medical-university-admissions-2026',
    title: 'Punjab Medical Colleges MBBS & BDS Admissions',
    org: 'University of Health Sciences (UHS) Lahore',
    category: 'Admissions',
    catSlug: 'admissions',
    badge: 'Public & Private Medical Colleges • MDCAT Merit',
    theme: { bg1: '#1e293b', bg2: '#0f172a', accent: '#38bdf8', pillBg: '#0284c7' }
  },
  {
    slug: 'benazir-income-support-programme-2026',
    title: 'BISP Dynamic Registry & Kafalat Phase 2026',
    org: 'Benazir Income Support Programme (BISP)',
    category: 'Government Schemes',
    catSlug: 'government-schemes',
    badge: 'Quarterly Financial Assistance • Tehsil Offices',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669' }
  },
  {
    slug: 'punjab-rozgar-scheme-2026',
    title: 'Punjab Rozgar Scheme Interest-Free Loans',
    org: 'Punjab Small Industries Corporation (PSIC)',
    category: 'Government Schemes',
    catSlug: 'government-schemes',
    badge: 'Loans up to Rs 10 Million • Youth Entrepreneurship',
    theme: { bg1: '#14532d', bg2: '#052e16', accent: '#86efac', pillBg: '#16a34a' }
  },
  {
    slug: 'bise-lahore-matric-result-2026',
    title: 'BISE Lahore Matric SSC-II Result Announced',
    org: 'Board of Intermediate & Secondary Education Lahore',
    category: 'Results',
    catSlug: 'results',
    badge: 'Gazette & Online Result • SMS Result Verification',
    theme: { bg1: '#1e293b', bg2: '#0f172a', accent: '#fde047', pillBg: '#ca8a04' }
  },
  {
    slug: 'nts-nat-result-september-2026',
    title: 'NTS NAT-I & NAT-II Result Announced',
    org: 'National Testing Service (NTS) Pakistan',
    category: 'Results',
    catSlug: 'results',
    badge: 'Test Scores & Percentile Card • Check Online',
    theme: { bg1: '#0f172a', bg2: '#020617', accent: '#38bdf8', pillBg: '#0284c7' }
  },
  {
    slug: 'wapda-junior-engineer-2026',
    title: 'WAPDA Junior Engineers (Civil & Electrical)',
    org: 'Water & Power Development Authority (WAPDA)',
    category: 'Government Jobs',
    catSlug: 'government-jobs',
    badge: 'Hydroelectric Projects • Regular Scale BPS-17',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#6ee7b7', pillBg: '#059669' }
  },
  {
    slug: 'unilever-future-leaders-2026',
    title: 'Unilever Future Leaders Programme (UFLP) 2026',
    org: 'Unilever Pakistan Limited',
    category: 'Private Jobs',
    catSlug: 'private-jobs',
    badge: 'Fast-Track Management Trainee • Marketing & Supply Chain',
    theme: { bg1: '#172554', bg2: '#030712', accent: '#60a5fa', pillBg: '#1d4ed8' }
  }
]

function generateSvg(item) {
  const { category, org, title, badge, theme } = item
  const safeOrg = org.toUpperCase().replace(/&/g, '&amp;')
  const safeTitle = title.replace(/&/g, '&amp;')
  const safeBadge = badge.replace(/&/g, '&amp;')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}" />
      <stop offset="100%" stop-color="${theme.bg2}" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>

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
    <text font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="22" fill="${theme.accent}" letter-spacing="1">
      ${safeOrg}
    </text>

    <!-- Title -->
    <text y="78" font-family="'Georgia', serif" font-weight="800" font-size="44" fill="#ffffff">
      ${safeTitle}
    </text>

    <!-- Subtitle Badge -->
    <rect y="130" width="620" height="50" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"/>
    <text x="24" y="162" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="20" fill="#ffffff">
      ${safeBadge}
    </text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(60, 560)">
    <line x1="0" y1="0" x2="1080" y2="0" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
    
    <text y="42" font-family="'Segoe UI', system-ui, sans-serif" font-weight="700" font-size="18" fill="#34d399">
      ✓ Official Verified Announcement
    </text>

    <text x="1080" y="42" font-family="'Segoe UI', system-ui, sans-serif" font-weight="600" font-size="16" fill="rgba(255,255,255,0.7)" text-anchor="end">
      careerdost.blog
    </text>
  </g>
</svg>`
}

async function run() {
  const imgDir = path.resolve('public/images')
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true })
  }

  console.log(`Generating 16:9 images for ${missingItems.length} articles...`)

  for (const item of missingItems) {
    const svgCode = generateSvg(item)
    const svgPath = path.join(imgDir, `${item.slug}.svg`)
    const jpgPath = path.join(imgDir, `${item.slug}.jpg`)

    fs.writeFileSync(svgPath, svgCode, 'utf8')
    await sharp(Buffer.from(svgCode))
      .jpeg({ quality: 92 })
      .toFile(jpgPath)

    console.log(`✓ Created: ${item.slug}.svg & .jpg`)
  }

  // 1. Update src/data/listings.js
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')

  for (const item of missingItems) {
    const regex = new RegExp(`("slug":\\s*"${item.slug}",[\\s\\S]*?)("title":\\s*"[^"]*",)`, 'm')
    if (regex.test(listingsCode) && !listingsCode.includes(`"featuredImage": "/images/${item.slug}.jpg"`)) {
      listingsCode = listingsCode.replace(
        regex,
        `$1$2\n    "featuredImage": "/images/${item.slug}.jpg",\n    "imageAlt": "${item.title} ${item.org} CareerDost",`
      )
    }
  }
  fs.writeFileSync(listingsPath, listingsCode, 'utf8')
  console.log('✓ Updated src/data/listings.js with featuredImage & imageAlt properties.')

  // 2. Update local SQLite careerdost.sqlite
  const db = new Database('careerdost.sqlite')
  for (const item of missingItems) {
    const imagePath = `/images/${item.slug}.jpg`
    const imageAlt = `${item.title} ${item.org} CareerDost`
    db.prepare('UPDATE articles SET featured_image = ?, image_alt = ? WHERE slug = ?').run(imagePath, imageAlt, item.slug)
    db.prepare('UPDATE daily_updates SET featured_image = ?, image_alt = ? WHERE slug = ?').run(imagePath, imageAlt, item.slug)
  }
  console.log('✓ Updated local SQLite articles and daily_updates tables.')

  console.log('\nAll 19 missing images successfully generated and linked!')
}

run().catch(console.error)
