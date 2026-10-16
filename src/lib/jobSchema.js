/**
 * CareerDost JobPosting Structured Data (Schema.org JSON-LD) Builder
 *
 * Ensures strict compliance with Google Search Console JobPosting Rich Results guidelines:
 * 1. Emits JobPosting ONLY on genuine individual job vacancy pages (never on schemes, guides,
 *    notifications, admissions, scholarships, results, portal guides, or category pages).
 * 2. Populates addressLocality, addressRegion, streetAddress, and postalCode ONLY when
 *    genuinely verifiable from the visible article and official employer announcement.
 *    Never fabricates street addresses or postal codes.
 * 3. Removes unsupported, scale-only, or estimated baseSalary structured data. Includes
 *    baseSalary with numeric value/range and valid unitText (HOUR, DAY, WEEK, MONTH, YEAR)
 *    ONLY when the employer officially states both a numeric salary and its period.
 * 4. Normalizes validThrough strictly to ISO-8601 (YYYY-MM-DD) and omits it when no closing
 *    date or only descriptive text is available.
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
}

const CITY_TO_REGION = [
  { pattern: /\bkarachi\b/i, locality: 'Karachi', region: 'Sindh' },
  { pattern: /\bhyderabad\b/i, locality: 'Hyderabad', region: 'Sindh' },
  { pattern: /\bsukkur\b/i, locality: 'Sukkur', region: 'Sindh' },
  { pattern: /\blahore\b/i, locality: 'Lahore', region: 'Punjab' },
  { pattern: /\brawalpindi\b/i, locality: 'Rawalpindi', region: 'Punjab' },
  { pattern: /\bmultan\b/i, locality: 'Multan', region: 'Punjab' },
  { pattern: /\bchakwal\b/i, locality: 'Chakwal', region: 'Punjab' },
  { pattern: /\bgujranwala\b/i, locality: 'Gujranwala', region: 'Punjab' },
  { pattern: /\bfaisalabad\b/i, locality: 'Faisalabad', region: 'Punjab' },
  { pattern: /\bislamabad\b/i, locality: 'Islamabad', region: 'Islamabad Capital Territory' },
  { pattern: /\bpeshawar\b/i, locality: 'Peshawar', region: 'Khyber Pakhtunkhwa' },
  { pattern: /\bgwadar\b/i, locality: 'Gwadar', region: 'Balochistan' },
  { pattern: /\bquetta\b/i, locality: 'Quetta', region: 'Balochistan' },
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
 * Determines whether an article is a genuine individual job vacancy page
 * eligible for Schema.org JobPosting structured data.
 */
export function isGenuineJobVacancy(item, contentType = 'job') {
  if (!item || contentType !== 'job') return false

  const slug = String(item.slug || '').toLowerCase().trim()
  if (NON_INDIVIDUAL_VACANCY_SLUGS.has(slug)) return false

  const cat = String(item.category_slug || item.category || '').toLowerCase().trim()
  if (!JOB_CATEGORIES.has(cat)) return false

  const title = String(item.title || '').toLowerCase().trim()
  const seoTitle = String(item.seo_title || item.seoTitle || '').toLowerCase().trim()
  const jobType = String(item.job_type || item.jobType || '').toLowerCase().trim()

  if (
    title.includes('guide') ||
    title.includes('ka tarika') ||
    seoTitle.includes('guide') ||
    jobType.includes('guide') ||
    jobType.includes('(expired)') ||
    title.includes('exam schedule') ||
    title.includes('roll no slip') ||
    title.includes('merit list')
  ) {
    return false
  }

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
  if (/\b(per\s*hour|hourly|\/\s*hr|\/\s*hour)\b/i.test(salaryStr)) {
    unitText = 'HOUR'
  } else if (/\b(per\s*day|daily|\/\s*day)\b/i.test(salaryStr)) {
    unitText = 'DAY'
  } else if (/\b(per\s*week|weekly|\/\s*week)\b/i.test(salaryStr)) {
    unitText = 'WEEK'
  } else if (/\b(per\s*month|monthly|\/\s*month)\b/i.test(salaryStr)) {
    unitText = 'MONTH'
  } else if (/\b(per\s*year|yearly|annual|annually|per\s*annum|\/\s*year)\b/i.test(salaryStr)) {
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
 */
export function buildJobLocationSchema(item) {
  const slug = String(item?.slug || '').toLowerCase().trim()
  if (VERIFIED_EMPLOYER_ADDRESSES[slug]) {
    return {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...VERIFIED_EMPLOYER_ADDRESSES[slug],
      },
    }
  }

  const rawLoc = String(item?.location || '').trim()
  let locality
  let region

  for (const entry of CITY_TO_REGION) {
    if (entry.pattern.test(rawLoc)) {
      locality = entry.locality
      region = entry.region
      break
    }
  }

  if (!region) {
    if (/\bsindh\b/i.test(rawLoc)) region = 'Sindh'
    else if (/\bpunjab\b/i.test(rawLoc)) region = 'Punjab'
    else if (/\b(khyber\s+pakhtunkhwa|kpk|\bkp\b)\b/i.test(rawLoc)) region = 'Khyber Pakhtunkhwa'
    else if (/\bbalochistan\b/i.test(rawLoc)) region = 'Balochistan'
    else if (/\bislamabad\b/i.test(rawLoc)) region = 'Islamabad Capital Territory'
  }

  const address = {
    '@type': 'PostalAddress',
  }
  if (locality) address.addressLocality = locality
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
  const description =
    item.meta_description ||
    item.metaDescription ||
    item.excerpt ||
    (Array.isArray(item.content) ? item.content.join(' ') : String(item.content || item.title || ''))

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
    title: item.title || 'Opportunity',
    description,
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
