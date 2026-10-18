/**
 * CareerDost Content Type Detection & Taxonomy Handler
 * 
 * Accurately differentiates:
 * 1. 'job': Real job vacancies (government, private, banking, IT, internships)
 * 2. 'notification': Labour notifications, statutory gazettes, regulatory notices, public orders
 * 3. 'scheme': Government welfare programmes, citizen subsidies, social safety nets
 * 4. 'admission': University admissions, academic degree programs, college intakes
 * 5. 'result': Entry test results, merit lists, examination schedules, answer keys
 * 6. 'scholarship': Scholarships, research grants, educational awards
 * 7. 'guide': Educational guides, career strategies, citizen how-to references
 */

import { formatDate } from './format.js'

export function isLabourWageNotification(item) {
  if (!item) return false
  const slug = String(item.slug || '').toLowerCase().trim()
  const title = String(item.title || '').toLowerCase().trim()
  const jobType = String(item.job_type || item.jobType || '').toLowerCase().trim()
  return (
    slug.includes('minimum-wage') ||
    title.includes('minimum wage') ||
    jobType.includes('minimum wage')
  )
}

export function getContentType(item) {
  if (!item) return 'job'

  const cat = String(item.category_slug || item.category || '').toLowerCase().trim()
  const jobType = String(item.job_type || item.jobType || '').toLowerCase().trim()
  const slug = String(item.slug || '').toLowerCase().trim()
  const title = String(item.title || '').toLowerCase().trim()

  // 1. Explicit Labour, Tariff, Tax & Regulatory Notifications (Never job vacancies)
  if (
    isLabourWageNotification(item) ||
    slug.includes('section-144') ||
    slug.includes('barcode') ||
    slug.includes('petrol-price') ||
    slug.includes('support-price') ||
    slug.includes('wheat-imports') ||
    slug.includes('wheat-seed-prices') ||
    slug.includes('fbr-tax-return') ||
    slug.includes('sbp-housing-solar-financing-rules') ||
    slug.includes('electricity-bills-') ||
    title.includes('section 144') ||
    title.includes('price reduced') ||
    title.includes('fuel adjustment')
  ) {
    return 'notification'
  }

  // 2. Explicit Informational / Portal Walkthrough Guides
  if (
    cat === 'career-guides' ||
    slug === 'sindh-job-portal-2026-junior-clerk-jobs' ||
    slug === 'pec-graduate-engineer-training-get-program-2026' ||
    slug === 'nadra-digital-payments-2026' ||
    slug.includes('official-guide') ||
    slug.includes('payment-check')
  ) {
    return 'guide'
  }

  // 3. Explicit Exam Schedules / Roll Number Slips
  if (
    slug === 'fpsc-latest-updates-adv3-2026-schedule' ||
    slug === 'nts-nat-gat-roll-number-slip-2026'
  ) {
    return 'result'
  }

  // 4. Primary CMS Category Mapping (Prevents recruitment/result/scheme articles from being hijacked by title words like "Guide" or "Notification")
  if (
    cat === 'government-jobs' ||
    cat === 'private-jobs' ||
    cat === 'bank-jobs' ||
    cat === 'it-jobs' ||
    cat === 'internships' ||
    cat === 'government jobs' ||
    cat === 'private jobs' ||
    cat === 'bank jobs' ||
    cat === 'it jobs'
  ) {
    return 'job'
  }

  if (cat === 'results' || cat === 'results / test updates') {
    return 'result'
  }

  if (cat === 'scholarships') {
    return 'scholarship'
  }

  if (cat === 'admissions') {
    return 'admission'
  }

  if (cat === 'government-schemes' || cat === 'government schemes') {
    return 'scheme'
  }

  // 5. Fallback Keyword Classification for Generic Daily Update Categories ('Latest Jobs', 'Career News', 'Deadline Alerts')
  if (
    slug.includes('result') ||
    slug.includes('merit-list') ||
    slug.includes('answer-keys') ||
    slug.includes('exam-slips') ||
    slug.includes('timetable') ||
    slug.includes('roll-number-slip') ||
    jobType.includes('result') ||
    jobType.includes('merit list') ||
    jobType.includes('examination') ||
    jobType.includes('screening test')
  ) {
    return 'result'
  }

  if (
    slug.includes('scholarship') ||
    jobType.includes('scholarship') ||
    jobType.includes('research support') ||
    jobType.includes('research grant')
  ) {
    return 'scholarship'
  }

  if (
    slug.includes('admissions') ||
    slug.includes('entry-test') ||
    slug.includes('gat-subject') ||
    jobType.includes('admission') ||
    jobType.includes('intake')
  ) {
    return 'admission'
  }

  if (
    slug.includes('bisp') ||
    slug.includes('scooty-scheme') ||
    slug.includes('hari-card') ||
    slug.includes('kisan-subsidy') ||
    slug.includes('fuel-relief') ||
    slug.includes('mamta-programme') ||
    slug.includes('hunarmand') ||
    slug.includes('rozgar-scheme') ||
    slug.includes('social-protection-wallet') ||
    slug.includes('sphf') ||
    slug.includes('solar-energy-project') ||
    slug.includes('flood-affected-families') ||
    slug.includes('laptop-scheme') ||
    jobType.includes('scheme') ||
    jobType.includes('social safety') ||
    jobType.includes('subsidy') ||
    jobType.includes('cash transfer') ||
    jobType.includes('skill training')
  ) {
    return 'scheme'
  }

  if (
    jobType.includes('regulatory') ||
    jobType.includes('statutory') ||
    jobType.includes('food reserve') ||
    jobType.includes('commodity pricing')
  ) {
    return 'notification'
  }

  if (
    title.includes('ka tarika') ||
    jobType.includes('(expired)')
  ) {
    return 'guide'
  }

  // 6. Genuine Jobs / Vacancies (Default)
  return 'job'
}

export function getContentTypeLabels(type, item = null) {
  let res
  switch (type) {
    case 'notification': {
      const isWage = isLabourWageNotification(item)
      res = {
        badge: isWage ? 'Official Labour Notification' : 'Official Public Notification',
        badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
        orgLabel: 'Issuing Authority',
        typeLabel: isWage ? 'Regulatory Mandate' : 'Policy / Regulatory Scope',
        locLabel: 'Jurisdiction / Scope',
        qualLabel: isWage ? 'Protected Beneficiaries' : 'Applicable Citizens / Sector',
        expLabel: 'Coverage Criteria',
        posLabel: isWage ? 'Worker Categories' : 'Key Directives / Tiers',
        salLabel: 'Notified Rates / Mandate',
        dateLabel: 'Effective Date / Status',
        ctaLabel: 'View Official Notification / Department Portal ↗',
        ctaSecondary: null,
        howToApplyTitle: isWage
          ? 'Worker Protections & Redressal Mechanism'
          : 'Official Verification & Compliance Steps',
        statusPrefix: isWage ? 'Statutory Status' : 'Notification Status',
        summaryTitle: 'Key Official Notification Summary',
      }
      break
    }
    case 'scheme':
      res = {
        badge: 'Government Scheme',
        badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        orgLabel: 'Sponsoring Department',
        typeLabel: 'Programme Type',
        locLabel: 'Coverage / Target Region',
        qualLabel: 'Eligibility Requirement',
        expLabel: 'Beneficiary Criteria',
        posLabel: 'Target Beneficiaries',
        salLabel: 'Financial Assistance / Subsidy',
        dateLabel: 'Registration Window',
        ctaLabel: 'Check Official Source / Portal →',
        ctaSecondary: 'Official Scheme Guidelines ↗',
        howToApplyTitle: 'How to Verify Status & Official Channels',
        statusPrefix: 'Programme Status',
        summaryTitle: 'Key Welfare Scheme Summary',
      }
      break
    case 'admission':
      res = {
        badge: 'University Admissions',
        badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
        orgLabel: 'Institution / University',
        typeLabel: 'Degree Level / Faculty',
        locLabel: 'Campus / City',
        qualLabel: 'Academic Eligibility',
        expLabel: 'Entry Test Requirement',
        posLabel: 'Intake / Seats',
        salLabel: 'Fee Structure / Quota',
        dateLabel: 'Application Deadline',
        ctaLabel: 'Apply for Admission / View Prospectus →',
        ctaSecondary: 'Official University Portal ↗',
        howToApplyTitle: 'Admission Procedure & Required Documents',
        statusPrefix: 'Admission Deadline',
        summaryTitle: 'Key Admissions Summary',
      }
      break
    case 'result':
      res = {
        badge: 'Results & Merit Lists',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        orgLabel: 'Conducting Body / Authority',
        typeLabel: 'Examination / Test',
        locLabel: 'Jurisdiction / Test Centers',
        qualLabel: 'Eligible Candidates',
        expLabel: 'Test Series / Batch',
        posLabel: 'Merit List Scope',
        salLabel: 'Passing Marks / Score',
        dateLabel: 'Result / Schedule Date',
        ctaLabel: 'Check Result / Download Slip →',
        ctaSecondary: 'Official Testing Agency Portal ↗',
        howToApplyTitle: 'How to Check Your Result & Merit Score',
        statusPrefix: 'Result Status',
        summaryTitle: 'Key Results & Exam Summary',
      }
      break
    case 'scholarship':
      res = {
        badge: 'Scholarship',
        badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
        orgLabel: 'Sponsoring Agency / University',
        typeLabel: 'Scholarship Type',
        locLabel: 'Host Country / Institution',
        qualLabel: 'Academic Eligibility',
        expLabel: 'Eligibility Criteria',
        posLabel: 'Available Slots / Awards',
        salLabel: 'Award Coverage / Stipend',
        dateLabel: 'Application Deadline',
        ctaLabel: 'Apply for Scholarship Online →',
        ctaSecondary: 'Official Scholarship Guidelines ↗',
        howToApplyTitle: 'Scholarship Application Procedure',
        statusPrefix: 'Scholarship Deadline',
        summaryTitle: 'Key Scholarship Summary',
      }
      break
    case 'guide':
      res = {
        badge: 'Career & Public Guide',
        badgeClass: 'bg-stone-100 text-stone-900 border-stone-300',
        orgLabel: 'Issuing Desk / Department',
        typeLabel: 'Guide Topic',
        locLabel: 'Target Audience / Scope',
        qualLabel: 'Prerequisites / Eligibility',
        expLabel: 'Experience Level',
        posLabel: 'Key Takeaways',
        salLabel: 'Key Benefit / Coverage',
        dateLabel: 'Published / Status Date',
        ctaLabel: 'Explore Official Guidelines ↗',
        ctaSecondary: null,
        howToApplyTitle: 'Recommended Action Steps',
        statusPrefix: 'Guide Status',
        summaryTitle: 'Key Guide Summary',
      }
      break
    case 'job':
    default:
      res = {
        badge: 'Job Vacancy',
        badgeClass: 'bg-green-100 text-green-900 border-green-300',
        orgLabel: 'Organization',
        typeLabel: 'Employment Type',
        locLabel: 'Location',
        qualLabel: 'Qualification',
        expLabel: 'Experience',
        posLabel: 'Vacancies / Positions',
        salLabel: 'Salary / Scale',
        dateLabel: 'Application Deadline',
        ctaLabel: 'Visit Official Portal / Apply Online →',
        ctaSecondary: 'Official Advertisement / Gazette ↗',
        howToApplyTitle: 'How to Apply',
        statusPrefix: 'Application Deadline',
        summaryTitle: 'Key Vacancy Summary',
      }
      break
  }

  return {
    ...res,
    isJob: type === 'job',
    positionsLabel: res.posLabel,
    salaryLabel: res.salLabel,
    locationLabel: res.locLabel,
    qualificationLabel: res.qualLabel,
    deadlineLabel: res.dateLabel,
    actionLabel: res.ctaLabel,
    secondaryActionLabel: res.ctaSecondary,
  }
}

/**
 * Returns formatted status object for notifications, schemes, and jobs,
 * preventing 'Invalid Date' errors when lastDate is a descriptive string.
 */
export function getContextualStatus(item, type) {
  if (!item) {
    return {
      status: 'OPEN',
      label: 'CHECKING',
      badgeClass: 'bg-paper text-ink border-line',
      description: 'Loading opportunity details...',
      isExpired: false,
    }
  }

  const lastDate = String(item.lastDate || item.last_date || item.deadline || '').trim()
  const lowerDate = lastDate.toLowerCase()
  const slug = String(item.slug || '').toLowerCase()
  const noDeadline = Boolean(item.noDeadline || item.no_deadline)

  if (type === 'notification') {
    if (isLabourWageNotification(item)) {
      return {
        status: 'STATUTORY LAW',
        label: 'ENFORCEABLE LAW',
        badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
        description: lowerDate.includes('effective')
          ? lastDate
          : `Official government notification in statutory effect across ${item?.location || 'Sindh'}.`,
        isExpired: false,
      }
    }
    if (lowerDate.includes('pending') || lowerDate.includes('underway') || lowerDate.includes('unconfirmed')) {
      return {
        status: 'POLICY CONSULTATION',
        label: 'DECISION PENDING',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        description: lastDate || 'Official policy consultation underway; final notification pending.',
        isExpired: false,
      }
    }
    return {
      status: 'OFFICIAL DIRECTIVE',
      label: 'OFFICIAL NOTICE',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      description: lastDate
        ? `Official status / effective date: ${lastDate}.`
        : `Official regulatory directive and public notice across ${item?.location || 'Pakistan'}.`,
      isExpired: false,
    }
  }

  if (type === 'scheme') {
    if (
      lowerDate.includes('unconfirmed') ||
      lowerDate.includes('not yet announced') ||
      lowerDate.includes('pending') ||
      slug.includes('what-is-confirmed')
    ) {
      return {
        status: 'ANNOUNCED (DETAILS PENDING)',
        label: 'DETAILS PENDING',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        description:
          lastDate ||
          'Government intention announced; official registration portal, eligibility criteria, and schedule are not yet confirmed.',
        isExpired: false,
      }
    }
    return {
      status: 'ACTIVE SCHEME',
      label: noDeadline ? 'OPEN PROGRAMME' : 'ACTIVE REGISTRATION',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: noDeadline
        ? 'Public registration & verification available through designated official government portals.'
        : `Active public welfare scheme. Verification window: ${lastDate || 'Ongoing'}.`,
      isExpired: false,
    }
  }

  if (type === 'result') {
    return {
      status: 'ANNOUNCED',
      label: 'OFFICIAL UPDATE',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      description: lastDate
        ? `Official test / result schedule: ${lastDate}.`
        : 'Official merit list, exam schedule, or test score portal announced by the conducting authority.',
      isExpired: false,
    }
  }

  if (type === 'guide') {
    return {
      status: 'PUBLISHED',
      label: 'PUBLIC GUIDE',
      badgeClass: 'bg-stone-100 text-stone-900 border-stone-300',
      description: 'CareerDost public advisory and informational guide.',
      isExpired: false,
    }
  }

  // Job, Admission, Scholarship with date checks
  if (noDeadline || !lastDate || String(lastDate).trim() === '') {
    return {
      status: 'OPEN',
      label: 'NO DEADLINE',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'No strict closing deadline specified in the official notice.',
      isExpired: false,
    }
  }

  // Check if lastDate contains descriptive text (e.g., 'Effective Since...')
  const cleanDate = String(lastDate).trim().split('T')[0]
  const parsed = new Date(cleanDate + 'T00:00:00')

  if (isNaN(parsed.getTime())) {
    // Descriptive string, not an ISO date
    return {
      status: 'ACTIVE',
      label: 'ACTIVE',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: lastDate,
      isExpired: false,
    }
  }

  // Calculate days remaining
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((parsed - today) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      status: 'EXPIRED',
      label: 'EXPIRED',
      badgeClass: 'bg-slate-200 text-slate-700 border-slate-300',
      description: `Applications officially closed on ${formatDate(cleanDate)}.`,
      isExpired: true,
      days: diffDays,
    }
  }

  if (diffDays === 0) {
    return {
      status: 'CLOSES TODAY',
      label: 'CLOSES TODAY',
      badgeClass: 'bg-red-100 text-red-900 border-red-300 font-bold',
      description: `Today is the final day to submit your online application (${formatDate(cleanDate)}).`,
      isExpired: false,
      days: 0,
    }
  }

  if (diffDays <= 3) {
    return {
      status: 'CLOSING SOON',
      label: `${diffDays}d Left`,
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      description: `Only ${diffDays} day${diffDays > 1 ? 's' : ''} left before portal closure (${formatDate(cleanDate)}).`,
      isExpired: false,
      days: diffDays,
    }
  }

  return {
    status: 'OPEN',
    label: `${diffDays} Days Left`,
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: `Application deadline is ${formatDate(cleanDate)} (${diffDays} days remaining).`,
    isExpired: false,
    days: diffDays,
  }
}
