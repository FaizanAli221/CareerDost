import { test } from 'node:test'
import assert from 'node:assert/strict'
import Database from 'better-sqlite3'
import { getVerificationTier, getContentType } from '../src/lib/contentType.js'
import { listings, getListingsByCategory } from '../src/data/listings.js'

test('Phase 4 Post-Deployment Audit Test Suite', async (t) => {
  const db = new Database('careerdost.sqlite')

  await t.test('1. Category Resolution & Fallback Consistency: exactly 9 guides in DB and listings.js', () => {
    const dbGuides = db.prepare("SELECT * FROM articles WHERE category_slug = 'guides-and-resources' AND status = 'published'").all()
    assert.equal(dbGuides.length, 9, `Expected exactly 9 published guides in SQLite, found ${dbGuides.length}`)

    const listingsGuides = getListingsByCategory('guides-and-resources')
    assert.equal(listingsGuides.length, 9, `Expected exactly 9 guides in listings.js, found ${listingsGuides.length}`)

    for (const g of dbGuides) {
      const match = listingsGuides.find(l => l.slug === g.slug)
      assert.ok(match, `Listing in DB (${g.slug}) must be present in listings.js`)
      assert.equal(match.category, 'guides-and-resources')
    }
  })

  await t.test('2. Verification Labels for Evergreen Guides: must be CareerDost Editorial Guide', () => {
    const guideSlugs = [
      'pakistan-cnic-domicile-prc-application-guide',
      'ots-jobs-online-application-registration-guide',
      'fresh-graduate-cv-format-guide-pakistan',
      'government-job-interview-preparation-guide-pakistan',
      'spsc-exam-preparation-screening-challan-guide',
      'fpsc-online-application-challan-form-32a-guide',
      'national-job-portal-njp-pakistan-application-guide',
      'njp-application-rejection-12-common-mistakes-avoid',
      'government-jobs-documents-checklist-pakistan-2026'
    ]

    for (const slug of guideSlugs) {
      const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug)
      assert.ok(row, `Article ${slug} must exist in DB`)

      const tier = getVerificationTier(row)
      assert.equal(tier.tier, 'editorial', `Article ${slug} tier must be 'editorial'`)
      assert.equal(tier.status, 'EDITORIAL_GUIDE', `Article ${slug} status must be 'EDITORIAL_GUIDE'`)
      assert.equal(tier.label, 'CareerDost Editorial Guide', `Article ${slug} label must be 'CareerDost Editorial Guide'`)
      assert.equal(tier.shortLabel, 'Editorial Guide')
      assert.equal(tier.icon, '📖')
      assert.notEqual(tier.label, 'Official Notification Verified', `Guide ${slug} must NOT claim official notification verified`)
    }
  })

  await t.test('3. Fact-Check: CNIC, Domicile & PRC Guide (ID 591)', () => {
    const row = db.prepare('SELECT content FROM articles WHERE id = 591').get()
    const content = row.content

    // Free basic CNIC and Smart NIC fee tiers
    assert.ok(content.includes('free of charge') || content.includes('PKR 0'), 'CNIC guide must disclose free normal basic CNIC')
    assert.ok(content.includes('PKR 750'), 'Smart NIC normal fee PKR 750 must be stated')
    assert.ok(content.includes('PKR 1,500'), 'Smart NIC urgent fee PKR 1,500 must be stated')
    assert.ok(content.includes('PKR 2,500'), 'Smart NIC executive fee PKR 2,500 must be stated')

    // Domicile & PRC laws and provincial venues
    assert.ok(content.includes('Pakistan Citizenship Act, 1951'), 'Must cite Pakistan Citizenship Act, 1951')
    assert.ok(content.includes('Sindh Permanent Residence Certificate Rules, 1971'), 'Must cite Sindh PRC Rules, 1971')
    assert.ok(content.includes('Form-C') && content.includes('Form-D'), 'Must distinguish Form-C and Form-D')
    assert.ok(content.includes('Punjab') && content.includes('e-Khidmat'), 'Must mention Punjab e-Khidmat')
    assert.ok(content.includes('dual-domicile') || content.includes('Dual Domiciles'), 'Must warn against dual domiciles')
  })

  await t.test('4. Fact-Check: OTS Online Application Guide (ID 592)', () => {
    const row = db.prepare('SELECT content FROM articles WHERE id = 592').get()
    const content = row.content

    assert.ok(content.includes('Project-Specific'), 'Must qualify payment methods as project-specific')
    assert.ok(content.includes('1Bill'), 'Must explain 1Bill digital payment')
    assert.ok(content.includes('Category A') && content.includes('Category B'), 'Must distinguish online-only vs postal dispatch')
    assert.ok(content.includes('5 to 10 days'), 'Roll number slip timing must be qualified as 5 to 10 days')
    assert.ok(!content.includes('mandatory across all projects for HBL'), 'Must not claim fixed universal banks')
  })

  await t.test('5. Fact-Check: Fresh Graduate CV Guide (ID 593)', () => {
    const row = db.prepare('SELECT content FROM articles WHERE id = 593').get()
    const content = row.content

    // Unsupported universal claims removed
    assert.ok(!content.includes('a 1-page resume is mandatory'), 'Universal mandatory 1-page claim must be removed')
    assert.ok(!content.includes('99% accuracy'), 'Unsupported 99% ATS accuracy claim must be removed')
    assert.ok(content.includes('strongly recommended by corporate recruiters'), 'Must explain why 1-page is recommended')
    assert.ok(content.includes('Academic and Technical Exceptions'), 'Must mention academic/technical exceptions')
  })

  await t.test('6. Fact-Check: Government Job Interview Guide (ID 594)', () => {
    const row = db.prepare('SELECT content FROM articles WHERE id = 594').get()
    const content = row.content

    // Blanket 50% cutoff removed and differentiated by commission
    assert.ok(!content.includes('In most commission recruitments, the viva voce carries a strict 50% passing threshold'), 'Blanket 50% claim must be removed')
    assert.ok(content.includes('Punjab Public Service Commission (PPSC)'), 'Must detail PPSC 50% rule')
    assert.ok(content.includes('Sindh Public Service Commission (SPSC)'), 'Must detail SPSC CCE rule')
    assert.ok(content.includes('Federal Public Service Commission (FPSC)'), 'Must detail FPSC CSS 100/300 rule')
    assert.ok(content.includes('Departmental Selection Boards'), 'Must explain departmental boards without standalone cutoff')
  })

  await t.test('7. No Guide Accidentally Marked Expired', () => {
    const guides = db.prepare("SELECT slug, last_date, no_deadline FROM articles WHERE category_slug = 'guides-and-resources'").all()
    for (const g of guides) {
      assert.ok(g.no_deadline === 1 || !g.last_date || g.last_date.toLowerCase().includes('evergreen') || g.last_date.toLowerCase().includes('guide'), `Guide ${g.slug} must not be marked expired`)
      assert.ok(!g.last_date.toLowerCase().includes('closed'), `Guide ${g.slug} must not have closed last_date`)
    }
  })
})
