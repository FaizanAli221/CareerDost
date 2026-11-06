/**
 * CareerDost JobPosting Structured Data (Schema.org JSON-LD) Builder
 *
 * Ensures strict compliance with Google Search Console JobPosting Rich Results guidelines:
 * 1. Emits JobPosting ONLY on genuine individual job vacancy pages (never on schemes, guides,
 *    notifications, admissions, scholarships, results, portal guides, or category pages).
 * 2. Emits clean job designation in "title" (not the SEO article headline containing vacancy
 *    counts, location suffixes, or "Jobs 2026").
 * 3. Builds rich, complete job descriptions covering responsibilities, qualifications, and
 *    application instructions from the article body.
 * 4. Populates addressLocality, addressRegion, streetAddress, and postalCode ONLY when
 *    genuinely verifiable from the visible article and official employer announcement.
 *    Supports multiple physical job locations as an array of Place objects. Never fabricates
 *    street addresses or postal codes.
 * 5. Removes unsupported, scale-only, or estimated baseSalary structured data. Includes
 *    baseSalary with numeric value/range and valid unitText (HOUR, DAY, WEEK, MONTH, YEAR)
 *    ONLY when the employer officially states both a numeric salary and its explicit period.
 * 6. Normalizes validThrough strictly to ISO-8601 (YYYY-MM-DD) and suppresses active JobPosting
 *    when the deadline has expired, switching gracefully to Article schema.
 */

const JOB_CATEGORIES = new Set([
  'government-jobs',
  'private-jobs',
  'bank-jobs',
  'it-jobs',
  'internships',
  'government jobs',
  'private jobs',
  'bank jobs',
  'it & software',
  'internships',
])

/**
 * Non-individual or informational guide slugs that live under job categories
 * for navigation but are NOT single active job vacancy postings.
 */
const NON_INDIVIDUAL_VACANCY_SLUGS = new Set([
  'sindh-job-portal-2026-junior-clerk-jobs',
  'pec-graduate-engineer-training-get-program-2026',
  'fpsc-latest-updates-adv3-2026-schedule',
  'bank-alfalah-jobs-internships-2026',
  'jazz-careers-ai-associate-programme-2026',
  'hbl-jobs-internships-the-league-2026',
  'aku-karachi-jobs-traineeships-2026',
  'unilever-pakistan-jobs-october-2026',
  'samba-bank-relationship-associate-jobs-2026',
  'systems-limited-associate-software-engineer-jobs-2026',
  'mcb-bank-infosec-trainee-jobs-2026',
  'maju-karachi-jobs-faculty-staff-2026',
  'bahria-university-jobs-2026',
  'devsinc-remote-qa-engineer',
  'state-bank-officer-training-scheme-sbots-batch-27',
  'lums-electronic-technician-jobs-2026',
  // Aggregated multi-position recruitment notices & directories (Google Guidelines: must use Schema.org Article)
  'tdap-jobs-2026-superintendent-udc-ldc-driver-balochistan',
  'sindh-government-jobs-2026',
  'sindh-government-jobs-2026-spsc-sts-vacancies-apply-online',
  'punjab-university-jobs-faculty-staff-2026',
  'port-qasim-authority-jobs-2026-balochistan-quota',
  'fbr-customs-jobs-2026-udc-ldc-wireless-operator-balochistan',
  'wapda-jobs-2026-wireless-operator-surveyor-junior-clerk-balochistan',
  'pims-islamabad-jobs-2026-21-positions-balochistan-quota',
  'nepra-jobs-2026-balochistan-driver-security-guard-dispatch-rider',
  'hec-balochistan-jobs-2026-accountant-ldc-njp',
  'ntc-jobs-2026-balochistan-assistant-divisional-engineer-aps',
  'ministry-of-foreign-affairs-jobs-2026-vacancies-apply-online',
  'paec-it-computer-technician-jobs-2026',
  'sindh-finance-department-jobs-2026',
  'pakistan-bait-ul-mal-jobs-2026-balochistan-njp',
  'ogra-balochistan-jobs-2026-apply-online-njp',
  'pakistan-railways-balochistan-quota-jobs-2026-njp',
  'bank-al-habib-jobs-2026-karachi-fresh-graduates-apply-online',
  'bank-of-khyber-jobs-november-2026',
  'nbp-hr-business-partner-digital-learning-jobs-2026',
  'nbp-jobs-october-2026-karachi-hyderabad-rozeegpt',
  'economic-affairs-division-jobs-balochistan-2026',
])

/**
 * Verified employer addresses sourced directly from official institutional portals
 * and official vacancy advertisements. Never add fabricated addresses here.
 */
const VERIFIED_EMPLOYER_ADDRESSES = {
  'punjab-ophthalmology-college-jobs-2026': {
    streetAddress: 'King Edward Medical University, Mayo Hospital',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    addressCountry: 'PK',
  },
  'lums-nano-physics-research-associate-jobs-2026': {
    streetAddress: 'DHA, Lahore Cantt.',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    postalCode: '54792',
    addressCountry: 'PK',
  },
  'lums-electronic-technician-jobs-2026': {
    streetAddress: 'DHA, Lahore Cantt.',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    postalCode: '54792',
    addressCountry: 'PK',
  },
  'lums-lahore-jobs-advancement-it-staff-2026': {
    streetAddress: 'DHA, Lahore Cantt.',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    postalCode: '54792',
    addressCountry: 'PK',
  },
  'pnsc-jobs-2026-karachi-shipping': {
    streetAddress: 'PNSC Building, M.T. Khan Road',
    addressLocality: 'Karachi',
    addressRegion: 'Sindh',
    postalCode: '74000',
    addressCountry: 'PK',
  },
  'security-papers-jobs-2026': {
    streetAddress: 'Jinnah Avenue, Malir Halt',
    addressLocality: 'Karachi',
    addressRegion: 'Sindh',
    postalCode: '75100',
    addressCountry: 'PK',
  },
  'punjab-cbd-youth-career-program-2026-internship': {
    streetAddress: 'CBD Punjab Complex, Yasir Shaheed Road',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    addressCountry: 'PK',
  },
  'cbd-punjab-paid-internship-2026-youth-career-program': {
    streetAddress: 'CBD Punjab Complex, Yasir Shaheed Road',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    addressCountry: 'PK',
  },
  'punjab-auqaf-department-jobs-2026': {
    streetAddress: 'Aiwan-e-Auqaf',
    addressLocality: 'Lahore',
    addressRegion: 'Punjab',
    addressCountry: 'PK',
  },
  'hec-jobs-2026': {
    streetAddress: 'Sector H-9',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    postalCode: '44000',
    addressCountry: 'PK',
  },
  'sindh-courts-bps-1-4-jobs-2026': {
    streetAddress: 'High Court of Sindh',
    addressLocality: 'Karachi',
    addressRegion: 'Sindh',
    addressCountry: 'PK',
  },
  'air-university-islamabad-jobs-2026': {
    streetAddress: 'Sector H-11',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    addressCountry: 'PK',
  },
  'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables': [
    {
      addressLocality: 'Rahim Yar Khan',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    {
      addressLocality: 'Rajanpur',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
  ],
  'sbp-cyber-security-it-jobs-2026': {
    streetAddress: 'State Bank of Pakistan, I.I. Chundrigar Road',
    addressLocality: 'Karachi',
    addressRegion: 'Sindh',
    postalCode: '74000',
    addressCountry: 'PK',
  },
  'nab-islamabad-driver-jobs-2026': {
    streetAddress: 'NAB Headquarters, Shahrah-e-Jamhuriat, Sector G-5/1',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    postalCode: '44000',
    addressCountry: 'PK',
  },
  'navttc-short-term-expert-media-content-writer-jobs-2026': {
    streetAddress: 'NAVTTC Headquarters, Plot 38, Kirthar Road, Sector H-9/4',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    postalCode: '44000',
    addressCountry: 'PK',
  },
  'navttc-paid-internship-2026-60000-stipend-fresh-graduates': {
    streetAddress: 'NAVTTC Headquarters, Plot 38, Kirthar Road, Sector H-9/4',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    postalCode: '44000',
    addressCountry: 'PK',
  },
  'pseb-creative-lead-jobs-2026': {
    streetAddress: 'Plot 24, Evacuee Trust Complex, F-5/1, Aga Khan Road',
    addressLocality: 'Islamabad',
    addressRegion: 'Islamabad Capital Territory',
    postalCode: '44000',
    addressCountry: 'PK',
  },
}

/**
 * Verified job designations extracted from official advertisements
 * to ensure strict compliance with Google's clean job title requirement.
 */
const VERIFIED_JOB_DESIGNATIONS = {
  'punjab-police-jobs-2026-rajanpur-rahim-yar-khan-constables': 'Constable, Lady Constable & Driver Constable (BPS-07)',
  'nbp-jobs-october-2026-karachi-hyderabad-rozeegpt': 'Executive & Unit Head (Digital Banking, Risk & Compliance)',
  'nbp-karachi-jobs-october-2026': 'Senior Executive & Unit Head (AVP, VP, SVP, EVP)',
  'sindh-courts-bps-1-4-jobs-2026': 'BPS-01 to BPS-04 Staff (Naib Qasid, Peon, Mali, Chowkidar, Cook)',
  'meezan-bank-transaction-associates-batch-01-jobs-2026': 'Transaction Associate (Batch-01)',
  'pseb-creative-lead-jobs-2026': 'Creative Lead',
  'cabinet-division-stenotypist-jobs-bps-14-2026': 'Steno-Typist (BPS-14)',
  'cabinet-division-staff-car-driver-jobs-bps-04-2026': 'Staff Car Driver (BPS-04)',
  'ministry-of-planning-jobs-2026-accountant-aps-pps-6': 'Accountant & Assistant Private Secretary (APS / PPS-6)',
  'agp-junior-auditor-jobs-2026-njp-9878': 'Junior Auditor (BPS-11)',
  'hec-jobs-2026': 'Project Director & Technical Staff',
  'irsa-jobs-2026-nts-telemetry-engineers-supervisors': 'Telemetry Engineer & Supervisor',
  'spsc-jobs-2026-54-vacancies': 'Provincial Civil Service Officers & Specialized Staff',
  'karachi-shipyard-technical-assistant-jobs-2026': 'Technical Assistant (Shipbuilding / Marine / Mechanical / Electrical)',
  'pidcl-site-engineer-jobs-2026': 'Site Engineer (Civil)',
  'cga-junior-auditor-jobs-2026-njp-9862': 'Junior Auditor (BPS-11)',
  'national-savings-balochistan-jobs-2026-bps-11': 'Junior National Savings Officer (BPS-11)',
  'nab-islamabad-driver-jobs-2026': 'Staff Driver (BPS-04)',
  'nhmp-jobs-2026-80-junior-patrol-officer-balochistan-apply-online': 'Junior Patrol Officer (BPS-07)',
  'navttc-paid-internship-2026-60000-stipend-fresh-graduates': 'Paid Graduate Intern',
  'navttc-short-term-expert-media-content-writer-jobs-2026': 'Media Content Writer',
  'nbp-teller-cash-officer-og-iii-jobs-2026': 'Cash Officer (Officer Grade-III)',
  'bank-al-habib-relationship-manager-jobs-2026-apply-online': 'Relationship Manager',
  'sbp-cyber-security-it-jobs-2026': 'Cyber Security Operations Analyst (OG-3)',
  'bank-of-punjab-karachi-manager-jobs-2026': 'Regional Manager Alliances & Projects Governance',
  'askari-bank-jobs-october-2026-karachi': 'Analyst Payment Screening & e-KYC',
}

const CITY_TO_REGION = [
  { pattern: /\bkarachi\b/i, locality: 'Karachi', region: 'Sindh' },
  { pattern: /\bhyderabad\b/i, locality: 'Hyderabad', region: 'Sindh' },
  { pattern: /\bsukkur\b/i, locality: 'Sukkur', region: 'Sindh' },
  { pattern: /\blarkana\b/i, locality: 'Larkana', region: 'Sindh' },
  { pattern: /\bbadin\b/i, locality: 'Badin', region: 'Sindh' },
  { pattern: /\bmirpurkhas\b/i, locality: 'Mirpurkhas', region: 'Sindh' },
  { pattern: /\bnawabshah\b|\bshaheed\s+benazirabad\b/i, locality: 'Shaheed Benazirabad', region: 'Sindh' },
  { pattern: /\bthatta\b/i, locality: 'Thatta', region: 'Sindh' },
  { pattern: /\bdadu\b/i, locality: 'Dadu', region: 'Sindh' },
  { pattern: /\bshikarpur\b/i, locality: 'Shikarpur', region: 'Sindh' },
  { pattern: /\bsanghar\b/i, locality: 'Sanghar', region: 'Sindh' },
  { pattern: /\bkhairpur\b/i, locality: 'Khairpur', region: 'Sindh' },
  { pattern: /\bjacobabad\b/i, locality: 'Jacobabad', region: 'Sindh' },
  { pattern: /\bghotki\b/i, locality: 'Ghotki', region: 'Sindh' },
  { pattern: /\blahore\b/i, locality: 'Lahore', region: 'Punjab' },
  { pattern: /\brawalpindi\b/i, locality: 'Rawalpindi', region: 'Punjab' },
  { pattern: /\bmultan\b/i, locality: 'Multan', region: 'Punjab' },
  { pattern: /\bchakwal\b/i, locality: 'Chakwal', region: 'Punjab' },
  { pattern: /\bgujranwala\b/i, locality: 'Gujranwala', region: 'Punjab' },
  { pattern: /\bfaisalabad\b/i, locality: 'Faisalabad', region: 'Punjab' },
  { pattern: /\bsialkot\b/i, locality: 'Sialkot', region: 'Punjab' },
  { pattern: /\bbahawalpur\b/i, locality: 'Bahawalpur', region: 'Punjab' },
  { pattern: /\bsargodha\b/i, locality: 'Sargodha', region: 'Punjab' },
  { pattern: /\brahim\s*yar\s*khan\b/i, locality: 'Rahim Yar Khan', region: 'Punjab' },
  { pattern: /\brajanpur\b/i, locality: 'Rajanpur', region: 'Punjab' },
  { pattern: /\bjhelum\b/i, locality: 'Jhelum', region: 'Punjab' },
  { pattern: /\bgujrat\b/i, locality: 'Gujrat', region: 'Punjab' },
  { pattern: /\bsahiwal\b/i, locality: 'Sahiwal', region: 'Punjab' },
  { pattern: /\bdera\s*ghazi\s*khan\b|\bdg\s*khan\b/i, locality: 'Dera Ghazi Khan', region: 'Punjab' },
  { pattern: /\bislamabad\b/i, locality: 'Islamabad', region: 'Islamabad Capital Territory' },
  { pattern: /\bpeshawar\b/i, locality: 'Peshawar', region: 'Khyber Pakhtunkhwa' },
  { pattern: /\babbottabad\b/i, locality: 'Abbottabad', region: 'Khyber Pakhtunkhwa' },
  { pattern: /\bmardan\b/i, locality: 'Mardan', region: 'Khyber Pakhtunkhwa' },
  { pattern: /\bswat\b/i, locality: 'Swat', region: 'Khyber Pakhtunkhwa' },
  { pattern: /\bkohat\b/i, locality: 'Kohat', region: 'Khyber Pakhtunkhwa' },
  { pattern: /\bdera\s*ismail\s*khan\b|\bdi\s*khan\b/i, locality: 'Dera Ismail Khan', region: 'Khyber Pakhtunkhwa' },
  { pattern: /\bquetta\b/i, locality: 'Quetta', region: 'Balochistan' },
  { pattern: /\bgwadar\b/i, locality: 'Gwadar', region: 'Balochistan' },
  { pattern: /\bturbat\b/i, locality: 'Turbat', region: 'Balochistan' },
  { pattern: /\bkhuzdar\b/i, locality: 'Khuzdar', region: 'Balochistan' },
  { pattern: /\bmuzaffarabad\b/i, locality: 'Muzaffarabad', region: 'Azad Jammu and Kashmir' },
  { pattern: /\bmirpur\b/i, locality: 'Mirpur', region: 'Azad Jammu and Kashmir' },
  { pattern: /\bgilgit\b/i, locality: 'Gilgit', region: 'Gilgit-Baltistan' },
  { pattern: /\bskardu\b/i, locality: 'Skardu', region: 'Gilgit-Baltistan' },
]

const MONTH_MAP = {
  january: '01', jan: '01',
  february: '02', feb: '02',
  march: '03', mar: '03',
  april: '04', apr: '04',
  may: '05',
  june: '06', jun: '06',
  july: '07', jul: '07',
  august: '08', aug: '08',
  september: '09', sep: '09', sept: '09',
  october: '10', oct: '10',
  november: '11', nov: '11',
  december: '12', dec: '12',
}

/**
 * Extracts a clean, standard job designation strictly adhering to Google Jobs guidelines.
 */
export function extractCleanJobDesignation(item) {
  if (!item) return 'Job Vacancy'
  const slug = String(item.slug || '').toLowerCase().trim()
  if (VERIFIED_JOB_DESIGNATIONS[slug]) {
    return VERIFIED_JOB_DESIGNATIONS[slug]
  }

  const pos = String(item.positions || '').trim()
  if (pos && pos.length > 2 && pos.length < 80) {
    // 1. Matches "4 Regular Driver Posts (BPS-04)" -> "Driver (BPS-04)"
    const countTitleMatch = pos.match(/^\d+[\d,]*\s*(?:Regular|Contract)?\s*([A-Za-z\s/&-]+)\s+(?:Posts?|Vacancies|Seats?|Positions?)\s*(\(BPS-\d+\))?$/i)
    if (countTitleMatch && countTitleMatch[1]) {
      const role = countTitleMatch[1].trim()
      if (!/open|merit|provincial|quota|total|new/i.test(role)) {
        const bps = countTitleMatch[2] ? ` ${countTitleMatch[2].trim()}` : ''
        return `${role}${bps}`
      }
    }

    // 2. Check parenthetical designation e.g. "09 Vacancies (Junior National Savings Officer, BPS-11)"
    const parenMatch = pos.match(/^\d+[\d,]*\s*(?:Regular|Contract)?\s*(?:Posts?|Vacancies|Positions?|Seats?)\s*\(([^)]+)\)$/i)
    if (parenMatch) {
      const inside = parenMatch[1].trim()
      if (!/quota|initiative|open|merit|district|provincial/i.test(inside)) {
        return inside.replace(/,\s*(BPS-\d+)/i, ' ($1)')
      }
    }

    // 3. Clean standard prefix "39 Posts — Junior Auditor"
    if (!/^\d+[\d,]*\+?\s*(?:Regular|Contract)?\s*(?:Posts?|Vacancies|Seats?|Positions?)(?:\s*\([^)]*\))?$/i.test(pos)) {
      const cleanedPos = pos.replace(/^\d+[\d,]*\s*(?:Regular\s+)?(?:Posts?|Vacancies|Seats?)\s*[—–-]\s*/i, '').trim()
      if (cleanedPos.length >= 3 && cleanedPos.length <= 75) {
        return cleanedPos
      }
    }
  }

  let raw = String(item.title || '').trim()
  raw = raw.replace(/\s*—\s*CareerDost$/i, '').replace(/\s*\|\s*CareerDost$/i, '')
  raw = raw.replace(/:\s*\d+[\d,]*\s*(?:Posts?|Vacancies|Seats?|Positions?).*/gi, '')
  raw = raw.replace(/\b(?:Jobs|Vacancies|Recruitment)\s*(?:2025|2026|2027)?\b/gi, '')
  raw = raw.replace(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s*(?:2025|2026|2027)?\b/gi, '')
  raw = raw.replace(/\b(?:Apply Online|Latest Advertisement|Online Portal)\b/gi, '')
  raw = raw.replace(/\s{2,}/g, ' ').trim()

  return raw || String(item.title || 'Opportunity')
}

/**
 * Builds a comprehensive job description for Google Jobs using visible article content.
 */
export function buildJobDescription(item) {
  let rawContent = item.content
  if (typeof rawContent === 'string' && rawContent.trim().startsWith('[') && rawContent.trim().endsWith(']')) {
    try {
      rawContent = JSON.parse(rawContent)
    } catch {}
  }

  let text = ''
  if (Array.isArray(rawContent)) {
    text = rawContent.filter((c) => typeof c === 'string').join('\n\n')
  } else if (typeof rawContent === 'string') {
    text = rawContent
  }

  if (text && text.length > 100) {
    let clean = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/>\s*\[!.*\]/g, '')
      .replace(/>/g, '')
      .replace(/\\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()

    if (clean.length > 4000) {
      clean = clean.slice(0, 3997) + '...'
    }
    if (clean.length >= 100) {
      return clean
    }
  }

  return (
    item.meta_description ||
    item.metaDescription ||
    item.excerpt ||
    String(item.title || 'Official Job Vacancy Details & Application Instructions')
  )
}

/**
 * Determines whether an article is a genuine individual job vacancy page
 * eligible for Schema.org JobPosting structured data.
 */
export function isGenuineJobVacancy(item, contentType = 'job') {
  if (!item || contentType !== 'job') return false

  if (item.schemaType === 'Article' || item.schema_type === 'Article') return false

  const slug = String(item.slug || '').toLowerCase().trim()
  if (NON_INDIVIDUAL_VACANCY_SLUGS.has(slug)) return false

  const cat = String(item.category_slug || item.category || '').toLowerCase().trim()
  if (!JOB_CATEGORIES.has(cat)) return false

  const title = String(item.title || '').toLowerCase().trim()
  const jobType = String(item.job_type || item.jobType || '').toLowerCase().trim()

  if (
    title.includes('ka tarika') ||
    jobType.includes('(expired)') ||
    title.includes('exam schedule') ||
    title.includes('roll no slip') ||
    title.includes('merit list')
  ) {
    return false
  }

  const rawLastDate = item.last_date || item.lastDate || item.deadline
  const rawNoDeadline = Boolean(item.no_deadline || item.noDeadline)
  const validThrough = normalizeValidThrough(rawLastDate, rawNoDeadline)
  if (!validThrough) return false

  // Suppress active JobPosting schema when application deadline has passed
  const todayIso = new Date().toISOString().slice(0, 10)
  if (validThrough < todayIso) return false

  return true
}

/**
 * Normalizes a deadline string into an ISO-8601 date (YYYY-MM-DD).
 * Returns undefined if noDeadline is set or if the string is descriptive text.
 */
export function normalizeValidThrough(lastDateStr, noDeadline = false) {
  if (noDeadline === true || noDeadline === 1 || noDeadline === '1') return undefined
  if (!lastDateStr || typeof lastDateStr !== 'string') return undefined

  const trimmed = lastDateStr.trim()
  if (!trimmed) return undefined

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
    return trimmed.slice(0, 10)
  }

  const dmyMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})$/)
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0')
    const month = MONTH_MAP[dmyMatch[2].toLowerCase()]
    const year = dmyMatch[3]
    if (month) return `${year}-${month}-${day}`
  }

  const mdyMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
  if (mdyMatch) {
    const month = MONTH_MAP[mdyMatch[1].toLowerCase()]
    const day = mdyMatch[2].padStart(2, '0')
    const year = mdyMatch[3]
    if (month) return `${year}-${month}-${day}`
  }

  return undefined
}

/**
 * Builds Schema.org MonetaryAmount for baseSalary ONLY when the employer
 * officially specifies a numeric salary (or range) AND its explicit period.
 * Returns undefined for pay-scale strings (BPS/PPS), "Market competitive",
 * unpaid roles, or estimated ranges.
 */
export function buildBaseSalarySchema(salaryStr) {
  if (!salaryStr || typeof salaryStr !== 'string') return undefined

  const lower = salaryStr.toLowerCase()
  if (
    lower.includes('estimate') ||
    lower.includes('approx') ||
    lower.includes('bps') ||
    lower.includes('scale') ||
    lower.includes('pay scale') ||
    lower.includes('expected') ||
    lower.includes('market-based') ||
    lower.includes('commensurate') ||
    lower.includes('entry range') ||
    lower.includes('competitive') ||
    lower.includes('unpaid') ||
    lower.includes('as per') ||
    lower.includes('negotiable') ||
    lower.includes('tuition') ||
    lower.includes('subsidy') ||
    lower.includes('grant')
  ) {
    return undefined
  }

  let unitText
  if (/(?:\bper\s*hour\b|\bhourly\b|(?:\/|\bper)\s*hour\b|(?:\/|\bper)\s*hr\b)/i.test(salaryStr)) {
    unitText = 'HOUR'
  } else if (/(?:\bper\s*day\b|\bdaily\b|(?:\/|\bper)\s*day\b)/i.test(salaryStr)) {
    unitText = 'DAY'
  } else if (/(?:\bper\s*week\b|\bweekly\b|(?:\/|\bper)\s*week\b)/i.test(salaryStr)) {
    unitText = 'WEEK'
  } else if (/(?:\bper\s*month\b|\bmonthly\b|(?:\/|\bper)\s*month\b)/i.test(salaryStr)) {
    unitText = 'MONTH'
  } else if (/(?:\bper\s*year\b|\byearly\b|\bannual\b|\bannually\b|(?:\/|\bper)\s*year\b|(?:\/|\bper)\s*annum\b)/i.test(salaryStr)) {
    unitText = 'YEAR'
  }

  if (!unitText) return undefined

  const matches = salaryStr.match(/\b\d{1,3}(?:,\d{3})+\b|\b\d{4,7}\b/g)
  if (!matches || matches.length === 0) return undefined

  const nums = matches
    .map((m) => Number(m.replace(/,/g, '')))
    .filter((n) => Number.isFinite(n) && n >= 1000)

  if (nums.length === 0) return undefined

  if (nums.length === 1) {
    return {
      '@type': 'MonetaryAmount',
      currency: 'PKR',
      value: {
        '@type': 'QuantitativeValue',
        value: nums[0],
        unitText,
      },
    }
  }

  const minVal = Math.min(...nums)
  const maxVal = Math.max(...nums)
  return {
    '@type': 'MonetaryAmount',
    currency: 'PKR',
    value: {
      '@type': 'QuantitativeValue',
      minValue: minVal,
      maxValue: maxVal,
      unitText,
    },
  }
}

/**
 * Builds Schema.org Place + PostalAddress for jobLocation using only
 * genuinely verifiable location data from the article and official employer source.
 * Supports single Place or an array of Place objects for multiple posting locations.
 */
export function buildJobLocationSchema(item) {
  const slug = String(item?.slug || '').toLowerCase().trim()
  if (VERIFIED_EMPLOYER_ADDRESSES[slug]) {
    const verified = VERIFIED_EMPLOYER_ADDRESSES[slug]
    if (Array.isArray(verified)) {
      return verified.map((addr) => ({
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          ...addr,
        },
      }))
    }
    return {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...verified,
      },
    }
  }

  const rawLoc = (String(item?.location || '') + ' ' + String(item?.title || '')).trim()
  const matched = []
  const seenLocalities = new Set()

  for (const entry of CITY_TO_REGION) {
    if (entry.pattern.test(rawLoc) && !seenLocalities.has(entry.locality)) {
      seenLocalities.add(entry.locality)
      matched.push({
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: entry.locality,
          addressRegion: entry.region,
          addressCountry: 'PK',
        },
      })
    }
  }

  if (matched.length > 1) {
    return matched
  }
  if (matched.length === 1) {
    return matched[0]
  }

  let region
  if (/\bsindh\b/i.test(rawLoc)) region = 'Sindh'
  else if (/\bpunjab\b/i.test(rawLoc)) region = 'Punjab'
  else if (/\b(khyber\s+pakhtunkhwa|kpk|\bkp\b)\b/i.test(rawLoc)) region = 'Khyber Pakhtunkhwa'
  else if (/\bbalochistan\b/i.test(rawLoc)) region = 'Balochistan'
  else if (/\bislamabad\b/i.test(rawLoc)) region = 'Islamabad Capital Territory'

  const address = {
    '@type': 'PostalAddress',
  }
  if (region) address.addressRegion = region
  address.addressCountry = 'PK'

  return {
    '@type': 'Place',
    address,
  }
}

/**
 * Builds a complete, Google Rich Results compliant JobPosting JSON-LD object.
 */
export function buildJobPostingSchema(item) {
  const cat = String(item.category_slug || item.category || '').toLowerCase().trim()
  const jobTypeStr = String(item.job_type || item.jobType || '').toLowerCase().trim()
  const locStr = String(item.location || '').toLowerCase().trim()
  const publishDate = item.publish_date || item.publishDate || undefined
  const lastDate = item.last_date || item.lastDate
  const noDeadline = item.no_deadline ?? item.noDeadline ?? false
  const officialLink = item.official_link || item.officialLink || undefined
  const salaryStr = item.salary || ''
  const orgName = item.organization || 'CareerDost'
  const designationTitle = extractCleanJobDesignation(item)
  const fullDescription = buildJobDescription(item)

  const isInternship = cat === 'internships' || jobTypeStr.includes('intern')
  const isRemote =
    locStr.startsWith('remote') ||
    jobTypeStr === 'remote' ||
    jobTypeStr.includes('virtual internship')

  let employmentType = 'FULL_TIME'
  if (isInternship) {
    employmentType = 'INTERN'
  } else if (jobTypeStr.includes('part time') || jobTypeStr.includes('part-time')) {
    employmentType = 'PART_TIME'
  }

  const validThrough = normalizeValidThrough(lastDate, noDeadline)
  const baseSalary = buildBaseSalarySchema(salaryStr)
  const jobLocation = buildJobLocationSchema(item)

  const schema = {
    '@type': 'JobPosting',
    title: designationTitle,
    description: fullDescription,
    ...(publishDate ? { datePosted: publishDate } : {}),
    ...(validThrough ? { validThrough } : {}),
    employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: orgName,
      ...(officialLink ? { sameAs: officialLink } : {}),
    },
    jobLocation,
    ...(isRemote
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'Pakistan',
          },
        }
      : {}),
    ...(baseSalary ? { baseSalary } : {}),
  }

  return schema
}
