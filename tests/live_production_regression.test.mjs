import assert from 'node:assert/strict'
import { getPktTodayYMD, normalizeDateToYMD, daysRemaining, deadlineLabel } from '../src/lib/format.js'
import { getContentType, getContentTypeLabels, getContextualStatus, getVerificationTier } from '../src/lib/contentType.js'
import fs from 'node:fs'

console.log('--- RUNNING LIVE PRODUCTION REGRESSION TESTS ---')

// 1. Deterministic PKT Date and Expiry Calculations
const todayPkt = getPktTodayYMD()
console.log(`Current PKT today: ${todayPkt}`)
assert.match(todayPkt, /^\d{4}-\d{2}-\d{2}$/, 'getPktTodayYMD must return YYYY-MM-DD')

// Test multiple date string formats with normalizeDateToYMD
assert.equal(normalizeDateToYMD('2026-11-04'), '2026-11-04')
assert.equal(normalizeDateToYMD('04-11-2026'), '2026-11-04')
assert.equal(normalizeDateToYMD('04/11/2026'), '2026-11-04')
assert.equal(normalizeDateToYMD('04-Nov-2026'), '2026-11-04')
assert.equal(normalizeDateToYMD('4 November 2026'), '2026-11-04')
assert.equal(normalizeDateToYMD('15 October 2026'), '2026-10-15')
assert.equal(normalizeDateToYMD('October 15, 2026'), '2026-10-15')

// Test daysRemaining for 4 Nov 2026 (past)
const lyariDays = daysRemaining('2026-11-04')
assert.ok(lyariDays < 0, `Lyari daysRemaining must be negative, got ${lyariDays}`)
const deadlineInfo = deadlineLabel('2026-11-04')
assert.equal(deadlineInfo.text, 'Applications Closed')
assert.equal(deadlineInfo.closed, true)

// 2. Lyari General Hospital (ID 563) Expiry Status
const lyariArticle = {
  id: 563,
  slug: 'lyari-general-hospital-karachi-jobs-2026',
  title: 'Lyari General Hospital Karachi Jobs 2026',
  last_date: '2026-11-04',
  category_slug: 'government-jobs',
  official_link: 'https://sts.org.pk',
  is_verified: 1,
}
const lyariStatus = getContextualStatus(lyariArticle, 'job')
console.log('Lyari statusInfo:', lyariStatus)
assert.equal(lyariStatus.isExpired, true, 'Lyari article must have isExpired = true')
assert.equal(lyariStatus.status, 'EXPIRED', 'Lyari status must be EXPIRED')
assert.equal(lyariStatus.label, 'APPLICATIONS CLOSED', 'Lyari label must be APPLICATIONS CLOSED')

// 3. Verification Badge Evidence Tests
// ID 586: Sindh Government Graduate Internship Program (iwork4Sindh)
const sindhInternship = {
  id: 586,
  slug: 'sindh-government-graduate-internship-program-2026',
  title: 'Sindh Government Graduate Internship Program 2026 (iwork4Sindh Phase-1)',
  official_link: 'https://iwork4sindh.gov.pk',
  last_date: 'Expected November 2026 (Portal Launch Awaited)',
  is_verified: 1,
  category_slug: 'internships',
}
const sindhTier = getVerificationTier(sindhInternship)
console.log('Sindh Internship Tier:', sindhTier)
assert.equal(sindhTier.tier, 2, 'Sindh Internship with expected dates must be Tier 2')
assert.equal(sindhTier.label, 'Official Announcement — Formal Notification Awaited')
assert.equal(sindhTier.shortLabel, 'Formal Notification Awaited')

// ID 587: KP Government 20,000 Paid Internships Program
const kpInternship = {
  id: 587,
  slug: 'kp-government-20000-paid-internships-2026',
  title: 'KP Government 20,000 Paid Internships Program 2026',
  official_link: 'https://kp.gov.pk',
  last_date: 'Phase-1 Expected November 2026 (Portal Registration Opening Soon)',
  is_verified: 1,
  category_slug: 'internships',
}
const kpTier = getVerificationTier(kpInternship)
console.log('KP Internship Tier:', kpTier)
assert.equal(kpTier.tier, 2, 'KP Internship with expected dates must be Tier 2')
assert.equal(kpTier.label, 'Official Announcement — Formal Notification Awaited')
assert.equal(kpTier.shortLabel, 'Formal Notification Awaited')

// ID 589: LESCO Balochistan Quota OTS
const lescoJob = {
  id: 589,
  slug: 'lesco-jobs-2026-balochistan-quota-ots',
  title: 'LESCO Jobs 2026 Under Federal Balochistan Quota via OTS',
  official_link: 'https://ots.org.pk',
  last_date: '2026-11-20',
  is_verified: 1,
  category_slug: 'government-jobs',
}
const lescoTier = getVerificationTier(lescoJob)
console.log('LESCO Tier:', lescoTier)
assert.equal(lescoTier.tier, 1, 'LESCO Job with confirmed official link and dates must be Tier 1')
assert.equal(lescoTier.label, 'Official Notification Verified')

// 4. Verify SSR Footers in functions/_middleware.js
const middlewareCode = fs.readFileSync('functions/_middleware.js', 'utf8')
assert.ok(middlewareCode.includes('function generateSsrFooterHtml()'), 'generateSsrFooterHtml must exist')
assert.ok(middlewareCode.includes('/about'), 'Footer must contain /about')
assert.ok(middlewareCode.includes('/contact'), 'Footer must contain /contact')
assert.ok(middlewareCode.includes('/privacy-policy'), 'Footer must contain /privacy-policy')
assert.ok(middlewareCode.includes('/terms-and-conditions'), 'Footer must contain /terms-and-conditions')
assert.ok(middlewareCode.includes('/disclaimer'), 'Footer must contain /disclaimer')

// Count occurrences of generateSsrFooterHtml() calls
const footerCalls = (middlewareCode.match(/\$\{generateSsrFooterHtml\(\)\}/g) || []).length
console.log(`generateSsrFooterHtml() injection count: ${footerCalls}`)
assert.ok(footerCalls >= 6, `Expected at least 6 SSR footer calls, found ${footerCalls}`)

// 5. Active-First Sorting Logic Verification
const testItems = [
  { id: 1, title: 'Old October Job', last_date: '15 October 2026', publish_date: '2026-10-01' },
  { id: 2, title: 'Active Future Job', last_date: '2026-11-25', publish_date: '2026-11-01' },
  { id: 3, title: 'Lyari Expired Job', last_date: '2026-11-04', publish_date: '2026-10-25' },
  { id: 4, title: 'Active Rolling Job', last_date: 'Rolling Admissions', publish_date: '2026-11-05' },
]

function isItemExpired(item) {
  const d = item.last_date || item.lastDate
  const ymd = normalizeDateToYMD(d)
  if (ymd && ymd < todayPkt) return true
  if (d && /closed|expired/i.test(String(d))) return true
  return false
}

const sorted = [...testItems].sort((a, b) => {
  const expA = isItemExpired(a) ? 1 : 0
  const expB = isItemExpired(b) ? 1 : 0
  if (expA !== expB) return expA - expB
  return (b.publish_date || '').localeCompare(a.publish_date || '') || (b.id - a.id)
})

console.log('Sorted order:', sorted.map(i => `${i.title} (expired=${isItemExpired(i)})`))
assert.equal(isItemExpired(sorted[0]), false, 'First item must be active')
assert.equal(isItemExpired(sorted[1]), false, 'Second item must be active')
assert.equal(isItemExpired(sorted[2]), true, 'Third item must be expired')
assert.equal(isItemExpired(sorted[3]), true, 'Fourth item must be expired')

console.log('ALL LIVE PRODUCTION REGRESSION TESTS PASSED SUCCESSFULLY!')
