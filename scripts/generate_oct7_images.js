import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const nanoImagePath = 'C:/Users/Faizan Ali/.gemini/antigravity/brain/6a8c4187-9d65-449f-bea9-1646a275ea1e/nums_spring_2027_1791354322234.jpg'

const imagesToCreate = [
  {
    name: 'nums-spring-2027',
    category: 'Admissions',
    org: 'NATIONAL UNIVERSITY OF MEDICAL SCIENCES (NUMS)',
    title: 'NUMS Spring 2027',
    subHeading: 'Postgraduate Admissions Open',
    badge: 'PhD, MPhil, MS, MSN & Diplomas • Apply Before 30 October',
    footerText: 'Online Applications Open • Official NUMS Portal',
    footerDate: 'Last Date: 30 October 2026',
    theme: { bg1: '#091e3a', bg2: '#0b3c49', accent: '#38bdf8', pillBg: '#0284c7', badgeBg: 'rgba(56, 189, 248, 0.15)', badgeBorder: 'rgba(56, 189, 248, 0.5)', badgeText: '#e0f2fe' }
  },
  {
    name: 'punjab-sti-2026-27',
    category: 'Jobs / Internships',
    org: 'GOVERNMENT OF THE PUNJAB • SCHOOL EDUCATION DEPT',
    title: 'Punjab STI 2026–27',
    subHeading: 'School Teacher Interns',
    badge: 'Stipend Rs 38K–45K/Month • Apply Before 18 October',
    footerText: 'Primary, Elementary & High Schools • Apply Online at sti.pesrp.edu.pk',
    footerDate: 'Deadline: 18 October 2026 (11:59 PM)',
    theme: { bg1: '#064e3b', bg2: '#022c22', accent: '#34d399', pillBg: '#059669', badgeBg: 'rgba(52, 211, 153, 0.15)', badgeBorder: 'rgba(52, 211, 153, 0.5)', badgeText: '#d1fae5' }
  },
  {
    name: 'sau-admissions-2027',
    category: 'Admissions',
    org: 'SINDH AGRICULTURE UNIVERSITY TANDOJAM & KCAMS',
    title: 'SAU Admissions 2027',
    subHeading: 'Sindh Agriculture University',
    badge: 'Undergraduate Programs • Last Date: 30 October',
    footerText: 'Tandojam & Khairpur Mir\'s Campuses • Pre-Entry Test: 8 Nov 2026',
    footerDate: 'Last Date: 30 October 2026',
    theme: { bg1: '#143823', bg2: '#2b260d', accent: '#fbbf24', pillBg: '#d97706', badgeBg: 'rgba(251, 191, 36, 0.15)', badgeBorder: 'rgba(251, 191, 36, 0.5)', badgeText: '#fef3c7' }
  },
  {
    name: 'shaikh-ayaz-university-admissions-2027',
    category: 'Admissions',
    org: 'THE SHAIKH AYAZ UNIVERSITY, SHIKARPUR',
    title: 'Shaikh Ayaz University',
    subHeading: 'Admissions 2027',
    badge: '⚠️ URGENT: Only 3 Days Left • Apply Before 10 October',
    footerText: '1st Year BS & 3rd Year ADA Programs • Pre-Entry Test: 7 Nov 2026',
    footerDate: 'DEADLINE: 10 OCTOBER 2026',
    theme: { bg1: '#4a044e', bg2: '#831843', accent: '#f472b6', pillBg: '#db2777', badgeBg: 'rgba(244, 114, 182, 0.2)', badgeBorder: 'rgba(244, 114, 182, 0.6)', badgeText: '#fce7f3' }
  },
  {
    name: 'nums-mdcat-result-2026',
    category: 'Results / Exams',
    org: 'NATIONAL UNIVERSITY OF MEDICAL SCIENCES (NUMS)',
    title: 'NUMS MDCAT Result 2026',
    subHeading: 'Result Announced',
    badge: 'Check Online at mdcat.numspak.edu.pk • Download Result Card',
    footerText: 'MBBS & BDS Admissions Next Steps • Official NUMS Portal',
    footerDate: 'Result Declared: Official Portal Live',
    theme: { bg1: '#1e1b4b', bg2: '#1e3a8a', accent: '#60a5fa', pillBg: '#2563eb', badgeBg: 'rgba(96, 165, 250, 0.15)', badgeBorder: 'rgba(96, 165, 250, 0.5)', badgeText: '#dbeafe' }
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
    <rect y="170" width="820" height="54" rx="10" fill="${theme.badgeBg}" stroke="${theme.badgeBorder}" stroke-width="1.5"/>
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

  // 1. Process Image 1 from Nano Banana if available
  if (fs.existsSync(nanoImagePath)) {
    console.log(`Found Nano Banana image for NUMS: ${nanoImagePath}`)
    const targetJpg = path.join(imagesDir, 'nums-spring-2027.jpg')
    await sharp(nanoImagePath)
      .resize(1200, 675, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(targetJpg)
    console.log(`Successfully processed and saved Nano Banana image to ${targetJpg}`)
  }

  // 2. Generate SVG & JPG for all items
  for (const item of imagesToCreate) {
    const svgCode = generateSvg(item)
    const svgPath = path.join(imagesDir, `${item.name}.svg`)
    const jpgPath = path.join(imagesDir, `${item.name}.jpg`)

    fs.writeFileSync(svgPath, svgCode, 'utf8')
    console.log(`Saved SVG: ${svgPath}`)

    // If item is nums-spring-2027 and nano image was already used, also save vector version as fallback or if needed
    if (item.name === 'nums-spring-2027' && fs.existsSync(nanoImagePath)) {
      console.log('Skipping JPG overwrite for nums-spring-2027 to retain Nano Banana image.')
      continue
    }

    try {
      await sharp(Buffer.from(svgCode))
        .jpeg({ quality: 92 })
        .toFile(jpgPath)
      console.log(`Rendered JPG: ${jpgPath}`)
    } catch (err) {
      console.error(`Error rendering JPG for ${item.name}:`, err.message)
    }
  }

  console.log('\nAll 5 Oct 7 featured image assets successfully created in public/images!')
}

run()
