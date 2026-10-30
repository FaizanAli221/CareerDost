import assert from 'node:assert'
import Database from 'better-sqlite3'
import {
  sanitizeArticleInput,
  sanitizeUpdateInput,
  buildCleanSeoTitle,
  isBrokenSeoTitle,
} from '../server/utils/validation.js'
import { AdminModel } from '../server/models/Admin.js'
import { ArticleModel } from '../server/models/Article.js'
import { DailyUpdateModel } from '../server/models/DailyUpdate.js'
import adminRoutes from '../server/routes/admin.js'
import seoRoutes from '../server/routes/seo.js'
import { onRequest as pagesMiddlewareOnRequest } from '../functions/_middleware.js'

const TEST_JWT_SECRET = 'test-only-ephemeral-secret-key-for-unit-tests'

// Create an in-memory D1-compatible SQLite wrapper for testing actual model, route & middleware handlers
function createMockD1() {
  const sqlite = new Database(':memory:')
  sqlite.exec(`
    CREATE TABLE admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    );
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      short TEXT,
      tone TEXT,
      description TEXT
    );
    CREATE TABLE articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      organization TEXT,
      job_type TEXT,
      location TEXT,
      qualification TEXT,
      salary TEXT,
      experience TEXT,
      positions TEXT,
      last_date TEXT,
      no_deadline INTEGER DEFAULT 0,
      publish_date TEXT,
      official_link TEXT,
      apply_link TEXT,
      is_verified INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      logo_initial TEXT,
      featured_image TEXT,
      image_alt TEXT,
      excerpt TEXT,
      content TEXT,
      seo_title TEXT,
      meta_description TEXT,
      focus_keyword TEXT,
      canonical_url TEXT,
      og_title TEXT,
      og_description TEXT,
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE daily_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      short_description TEXT,
      content TEXT,
      featured_image TEXT,
      image_alt TEXT,
      official_link TEXT,
      apply_link TEXT,
      deadline TEXT,
      no_deadline INTEGER DEFAULT 0,
      publish_date TEXT,
      organization TEXT,
      location TEXT,
      qualification TEXT,
      experience TEXT,
      positions TEXT,
      job_type TEXT,
      salary TEXT,
      is_verified INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      seo_title TEXT,
      meta_description TEXT,
      focus_keyword TEXT,
      canonical_url TEXT,
      og_title TEXT,
      og_description TEXT,
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)

  return {
    prepare(sql) {
      const stmt = sqlite.prepare(sql)
      return {
        bind(...params) {
          return {
            async all() {
              return { results: stmt.all(...params) }
            },
            async first() {
              return stmt.get(...params) || null
            },
            async run() {
              stmt.run(...params)
              return { success: true }
            },
          }
        },
        async all() {
          return { results: stmt.all() }
        },
        async first() {
          return stmt.get() || null
        },
        async run() {
          stmt.run()
          return { success: true }
        },
      }
    },
  }
}

async function callAdminRoute(db, token, method, path, body = undefined) {
  const req = new Request(`https://careerdost.blog${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const res = await adminRoutes.fetch(req, { DB: db, ADMIN_JWT_SECRET: TEST_JWT_SECRET })
  const json = await res.json()
  return { status: res.status, json }
}

async function runTests() {
  const db = createMockD1()
  const token = await AdminModel.generateToken(
    { id: 1, username: 'testadmin', email: 'test@careerdost.blog', role: 'admin' },
    TEST_JWT_SECRET
  )

  console.log('=== 1. Route-Level Phase 1 Tests: Articles (POST, PUT, PATCH) ===')
  const baseArticle = {
    title: 'Cabinet Division Staff Car Driver Jobs 2026 (BPS-04): 5 Balochistan Vacancies',
    slug: 'cabinet-division-staff-car-driver-jobs-bps-04-2026',
    category: 'government-jobs',
    organization: 'Cabinet Division',
    content: ['Official announcement details for 5 Staff Car Driver posts.'],
  }

  // 1.1 Create Article with omitted status -> defaults to 'draft'
  const rCreateArt = await callAdminRoute(db, token, 'POST', '/articles', baseArticle)
  assert.strictEqual(rCreateArt.status, 200)
  assert.strictEqual(rCreateArt.json.success, true)
  assert.strictEqual(rCreateArt.json.data.status, 'draft', 'POST /articles with omitted status must default to draft')
  console.log('  [PASS] POST /articles (omitted status) -> status="draft"')

  // 1.2 Edit existing draft Article with omitted status -> preserves 'draft'
  const rEditDraftArt = await callAdminRoute(db, token, 'PUT', `/articles/${baseArticle.slug}`, {
    ...baseArticle,
    location: 'Islamabad (Balochistan Quota)',
  })
  assert.strictEqual(rEditDraftArt.status, 200)
  assert.strictEqual(rEditDraftArt.json.data.status, 'draft', 'PUT /articles/:slug on draft with omitted status must preserve draft')
  assert.strictEqual(rEditDraftArt.json.data.location, 'Islamabad (Balochistan Quota)')
  console.log('  [PASS] PUT /articles/:slug on draft (omitted status) -> preserves status="draft"')

  // 1.3 Save Draft explicitly -> stays 'draft'
  const rSaveDraftArt = await callAdminRoute(db, token, 'PUT', `/articles/${baseArticle.slug}`, {
    ...baseArticle,
    location: 'Islamabad (Balochistan Quota)',
    status: 'draft',
  })
  assert.strictEqual(rSaveDraftArt.status, 200)
  assert.strictEqual(rSaveDraftArt.json.data.status, 'draft')
  console.log('  [PASS] PUT /articles/:slug (Save Draft status="draft") -> status="draft"')

  // 1.4 PATCH /articles/:slug/status with missing/invalid status -> 400 Bad Request, stays 'draft'
  const rBadPatchArt = await callAdminRoute(db, token, 'PATCH', `/articles/${baseArticle.slug}/status`, {})
  assert.strictEqual(rBadPatchArt.status, 400, 'PATCH /articles/:slug/status without explicit status must return 400')
  const checkArtAfterBadPatch = await ArticleModel.getBySlug(db, baseArticle.slug)
  assert.strictEqual(checkArtAfterBadPatch.status, 'draft', 'Article must remain draft after rejected PATCH')
  console.log('  [PASS] PATCH /articles/:slug/status (missing status) -> HTTP 400; stays "draft"')

  // 1.5 Explicit Publish via PATCH /articles/:slug/status -> transitions to 'published'
  const rPublishArt = await callAdminRoute(db, token, 'PATCH', `/articles/${baseArticle.slug}/status`, {
    status: 'published',
  })
  assert.strictEqual(rPublishArt.status, 200)
  assert.strictEqual(rPublishArt.json.data.status, 'published')
  console.log('  [PASS] PATCH /articles/:slug/status (status="published") -> transitions to "published"')

  // 1.6 Edit existing published Article with omitted status -> preserves 'published'
  const rEditPubArt = await callAdminRoute(db, token, 'PUT', `/articles/${baseArticle.slug}`, {
    ...baseArticle,
    salary: 'BPS-04 Official Scale',
  })
  assert.strictEqual(rEditPubArt.status, 200)
  assert.strictEqual(rEditPubArt.json.data.status, 'published', 'PUT /articles/:slug on published article with omitted status must preserve published')
  assert.strictEqual(rEditPubArt.json.data.salary, 'BPS-04 Official Scale')
  console.log('  [PASS] PUT /articles/:slug on published article (omitted status) -> preserves status="published"')

  // 1.7 Save Draft on published Article -> transitions to 'draft', then re-publish for sitemap tests
  const rDemoteArt = await callAdminRoute(db, token, 'PUT', `/articles/${baseArticle.slug}`, {
    ...baseArticle,
    status: 'draft',
  })
  assert.strictEqual(rDemoteArt.status, 200)
  assert.strictEqual(rDemoteArt.json.data.status, 'draft')
  await callAdminRoute(db, token, 'PATCH', `/articles/${baseArticle.slug}/status`, { status: 'published' })
  console.log('  [PASS] PUT /articles/:slug (explicit status="draft" on published) -> sets "draft"')

  console.log('\n=== 2. Route-Level Phase 1 Tests: Daily Updates (POST, PUT, PATCH) ===')
  const baseUpdate = {
    title: 'SHC Shorthand Test Schedule 2026',
    slug: 'sindh-high-court-personal-assistant-shorthand-test-2026',
    category: 'Results',
    shortDescription: 'Official shorthand test schedule for Personal Assistant vacancies at Sindh High Court.',
    content: ['Complete test schedule and admit card instructions.'],
  }

  // 2.1 Create Daily Update with omitted status -> defaults to 'draft'
  const rCreateUpd = await callAdminRoute(db, token, 'POST', '/updates', baseUpdate)
  assert.strictEqual(rCreateUpd.status, 200)
  assert.strictEqual(rCreateUpd.json.data.status, 'draft', 'POST /updates with omitted status must default to draft')
  console.log('  [PASS] POST /updates (omitted status) -> status="draft"')

  // 2.2 Edit existing draft Daily Update with omitted status -> preserves 'draft'
  const rEditDraftUpd = await callAdminRoute(db, token, 'PUT', `/updates/${baseUpdate.slug}`, {
    ...baseUpdate,
    location: 'Karachi',
  })
  assert.strictEqual(rEditDraftUpd.status, 200)
  assert.strictEqual(rEditDraftUpd.json.data.status, 'draft', 'PUT /updates/:slug on draft with omitted status must preserve draft')
  assert.strictEqual(rEditDraftUpd.json.data.location, 'Karachi')
  console.log('  [PASS] PUT /updates/:slug on draft (omitted status) -> preserves status="draft"')

  // 2.3 Save Draft explicitly -> stays 'draft'
  const rSaveDraftUpd = await callAdminRoute(db, token, 'PUT', `/updates/${baseUpdate.slug}`, {
    ...baseUpdate,
    status: 'draft',
  })
  assert.strictEqual(rSaveDraftUpd.status, 200)
  assert.strictEqual(rSaveDraftUpd.json.data.status, 'draft')
  console.log('  [PASS] PUT /updates/:slug (Save Draft status="draft") -> status="draft"')

  // 2.4 PATCH /updates/:slug/status with missing/invalid status -> 400 Bad Request, stays 'draft'
  const rBadPatchUpd = await callAdminRoute(db, token, 'PATCH', `/updates/${baseUpdate.slug}/status`, {})
  assert.strictEqual(rBadPatchUpd.status, 400)
  const checkUpdAfterBadPatch = await DailyUpdateModel.getBySlug(db, baseUpdate.slug)
  assert.strictEqual(checkUpdAfterBadPatch.status, 'draft')
  console.log('  [PASS] PATCH /updates/:slug/status (missing status) -> HTTP 400; stays "draft"')

  // 2.5 Explicit Publish via PATCH /updates/:slug/status -> transitions to 'published'
  const rPublishUpd = await callAdminRoute(db, token, 'PATCH', `/updates/${baseUpdate.slug}/status`, {
    status: 'published',
  })
  assert.strictEqual(rPublishUpd.status, 200)
  assert.strictEqual(rPublishUpd.json.data.status, 'published')
  console.log('  [PASS] PATCH /updates/:slug/status (status="published") -> transitions to "published"')

  // 2.6 Edit existing published Daily Update with omitted status -> preserves 'published'
  const rEditPubUpd = await callAdminRoute(db, token, 'PUT', `/updates/${baseUpdate.slug}`, {
    ...baseUpdate,
    organization: 'Sindh High Court',
  })
  assert.strictEqual(rEditPubUpd.status, 200)
  assert.strictEqual(rEditPubUpd.json.data.status, 'published', 'PUT /updates/:slug on published update with omitted status must preserve published')
  assert.strictEqual(rEditPubUpd.json.data.organization, 'Sindh High Court')
  console.log('  [PASS] PUT /updates/:slug on published update (omitted status) -> preserves status="published"')

  console.log('\n=== 3. Phase 2 Sitemap Verification: Pages Functions Middleware (/sitemap.xml) vs API (/api/sitemap.xml) ===')
  await db.prepare(`INSERT INTO categories (slug, label) VALUES ('government-jobs', 'Government Jobs'), ('scholarships', 'Scholarships')`).run()

  // Draft article (must be excluded)
  await ArticleModel.create(db, {
    title: 'Draft Only Article 2026',
    slug: 'draft-only-article-2026',
    category: 'government-jobs',
    content: ['Draft body'],
    status: 'draft',
  })

  // Legacy redirecting slug in CONSOLIDATED_SLUG_REDIRECTS (must be excluded)
  await ArticleModel.create(db, {
    title: 'Legacy Redirecting Article',
    slug: 'benazir-income-support-programme-2026',
    category: 'government-schemes',
    content: ['Legacy body'],
    status: 'published',
  })

  // Junk test slug (must be excluded)
  await ArticleModel.create(db, {
    title: 'Junk Test',
    slug: 'httpswwwnjpgovpk',
    category: 'government-jobs',
    content: ['Junk'],
    status: 'published',
  })

  // Daily update mirroring published article (must be excluded from /daily-updates/ because it 301-redirects to /jobs/:slug)
  await DailyUpdateModel.create(db, {
    title: baseArticle.title,
    slug: baseArticle.slug,
    category: 'Government Jobs',
    shortDescription: 'Mirror update',
    content: ['Mirror body'],
    status: 'published',
  })

  // Daily update mirroring draft article (must be excluded)
  await DailyUpdateModel.create(db, {
    title: 'Draft Mirror Update',
    slug: 'draft-only-article-2026',
    category: 'Government Jobs',
    shortDescription: 'Draft mirror',
    content: ['Draft mirror body'],
    status: 'published',
  })

  const mwRes = await pagesMiddlewareOnRequest({
    request: new Request('https://careerdost.blog/sitemap.xml'),
    env: { DB: db },
    next: async () => new Response('Static fallback should not be called', { status: 404 }),
  })
  assert.strictEqual(mwRes.status, 200)
  assert(mwRes.headers.get('content-type').includes('application/xml'))
  const mwXml = await mwRes.text()

  const apiRes = await seoRoutes.fetch(new Request('https://careerdost.blog/sitemap.xml'), { DB: db })
  assert.strictEqual(apiRes.status, 200)
  const apiXml = await apiRes.text()

  const extractLocs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const mwLocs = extractLocs(mwXml)
  const apiLocs = extractLocs(apiXml)

  assert.deepStrictEqual(mwLocs, apiLocs, 'Pages Functions /sitemap.xml and /api/sitemap.xml must produce identical filtered <loc> lists')
  assert.strictEqual(mwXml, apiXml, 'Pages Functions /sitemap.xml and /api/sitemap.xml must produce identical XML output')

  assert(mwLocs.includes('https://careerdost.blog/'), 'Must include homepage')
  assert(mwLocs.includes('https://careerdost.blog/daily-updates'), 'Must include /daily-updates')
  assert(mwLocs.includes('https://careerdost.blog/privacy-policy'), 'Must include canonical /privacy-policy')
  assert(mwLocs.includes('https://careerdost.blog/terms-and-conditions'), 'Must include canonical /terms-and-conditions')
  assert(mwLocs.includes('https://careerdost.blog/category/government-jobs'), 'Must include category /category/government-jobs')
  assert(mwLocs.includes(`https://careerdost.blog/jobs/${baseArticle.slug}`), 'Must include canonical published article')
  assert(mwLocs.includes(`https://careerdost.blog/daily-updates/${baseUpdate.slug}`), 'Must include standalone published daily update')
  assert(!mwLocs.some((u) => u.includes('draft-only-article-2026')), 'Must exclude draft article and its daily_updates mirror')
  assert(!mwLocs.some((u) => u.includes('benazir-income-support-programme-2026')), 'Must exclude redirected legacy slug')
  assert(!mwLocs.some((u) => u.includes('httpswwwnjpgovpk')), 'Must exclude junk slug')
  assert(!mwLocs.includes(`https://careerdost.blog/daily-updates/${baseArticle.slug}`), 'Must exclude redirecting daily_update mirror')

  console.log(`  [PASS] Pages Functions /sitemap.xml and /api/sitemap.xml produce 100% identical XML (${mwLocs.length} canonical URLs)`)

  console.log('\n=== 4. Phase 3.1 SEO Title Tests (59, 60, 61, 65 chars + All 19 Malformed Existing Titles + Normal Valid Titles) ===')

  // 4.1 Exact 59-char and 60-char valid existing SEO titles -> preserved verbatim
  const valid59 = 'HEC Balochistan Jobs 2026: Accountant & LDC — CareerDost' + ' OK' // 56 + 3 = 59 chars
  assert.strictEqual(valid59.length, 59)
  assert.strictEqual(
    buildCleanSeoTitle('HEC Balochistan Jobs 2026: Accountant & Lower Division Clerk via NJP', valid59),
    valid59,
    'Valid 59-char existing SEO title must be preserved verbatim'
  )
  console.log(`  [PASS] Valid 59-char existing SEO title preserved verbatim ("${valid59}")`)

  const valid60 = 'PSEB Jobs 2026 — Pakistan Software Export Board — CareerDost' // 60 chars
  assert.strictEqual(valid60.length, 60)
  assert.strictEqual(
    buildCleanSeoTitle('PSEB Jobs 2026 — Pakistan Software Export Board Government IT Vacancies', valid60),
    valid60,
    'Valid 60-char existing SEO title must be preserved verbatim'
  )
  console.log(`  [PASS] Valid 60-char existing SEO title preserved verbatim ("${valid60}")`)

  // 4.2 Existing SEO titles of 61 and 65 chars -> enforced to <= 60 chars on clean word boundary
  const over61 = 'NTS NAT 11 (NAT-XI) November 2026 Test Date, Schedule & Apply' // 61 chars
  assert.strictEqual(over61.length, 61)
  const fixed61 = buildCleanSeoTitle('NTS NAT 11 (NAT-XI) November 2026 Test Date, Schedule & Apply', over61)
  assert(fixed61.length <= 60, `Expected <= 60 chars for 61-char input, got ${fixed61.length}: ${fixed61}`)
  assert(!isBrokenSeoTitle(fixed61, over61))
  console.log(`  [PASS] 61-char existing SEO title enforced to <= 60 chars: "${fixed61}" (${fixed61.length} chars)`)

  const over65 = 'Engineering Development Board (EDB) Jobs Oct 2026 — IT & Accounts' // 65 chars
  assert.strictEqual(over65.length, 65)
  const fixed65 = buildCleanSeoTitle('Engineering Development Board (EDB) Jobs Oct 2026 — IT & Accounts', over65)
  assert(fixed65.length <= 60, `Expected <= 60 chars for 65-char input, got ${fixed65.length}: ${fixed65}`)
  assert(!isBrokenSeoTitle(fixed65, over65))
  console.log(`  [PASS] 65-char existing SEO title enforced to <= 60 chars: "${fixed65}" (${fixed65.length} chars)`)

  // 4.3 Normal valid short/medium existing SEO title -> preserved verbatim
  const normalValid = 'NEPRA Support Staff Jobs 2026 (Balochistan) — CareerDost' // 56 chars
  assert.strictEqual(
    buildCleanSeoTitle('NEPRA Jobs 2026: Driver, Security Guard, Aaya and Dispatch Rider', normalValid),
    normalValid
  )
  console.log(`  [PASS] Normal valid existing SEO title preserved verbatim ("${normalValid}")`)

  // 4.4 All 19 known malformed/truncated existing SEO titles from Production D1 -> detected & regenerated cleanly
  const knownBrokenCases = [
    {
      raw: 'Ministry of Planning Jobs 2026: Accountant & Assistant Private Secretary (PPS-6)',
      broken: 'Ministry of Planning Jobs 2026: Accountant & A — CareerDost',
    },
    {
      raw: 'Cabinet Division Staff Car Driver Jobs 2026 (BPS-04): 5 Balochistan Vacancies',
      broken: 'Cabinet Division Staff Car Driver Jobs 2026 (B — CareerDost',
    },
    {
      raw: 'Pakistan Railways Balochistan Quota Jobs 2026: 6 Vacancies via NJP',
      broken: 'Pakistan Railways Balochistan Quota Jobs 2026: — CareerDost',
    },
    {
      raw: 'OGRA Balochistan Jobs 2026: 6 Vacancies Announced via National Jobs Portal',
      broken: 'OGRA Balochistan Jobs 2026: 6 Vacancies Announ — CareerDost',
    },
    {
      raw: 'Cabinet Division Stenotypist Jobs 2026 (BPS-14): 2 Regular Posts for Balochistan Domicile | Apply via NJP',
      broken: 'Cabinet Division Stenotypist Jobs 2026 (BPS-14 — CareerDost',
    },
    {
      raw: 'Daanish Schools Expansion 2026: CDWP In-Principle Approval for Sindh & Multi-Region Setup',
      broken: 'Daanish Schools Expansion 2026: CDWP In-Princi — CareerDost',
    },
    {
      raw: 'National Bank of Pakistan (NBP) Jobs October 2026: Executive & Unit Head Posts in Karachi & Hyderabad',
      broken: 'National Bank of Pakistan (NBP) Jobs October 2 — CareerDost',
    },
    {
      raw: 'Auditor General of Pakistan Jobs 2026: 31 Junior Auditor (BPS-11) Vacancies in Balochistan',
      broken: 'Auditor General of Pakistan Jobs 2026: 31 Juni — CareerDost',
    },
    {
      raw: 'CGA Junior Auditor Jobs 2026: 39 Vacancies Announced for Balochistan (BPS-11) via NJP',
      broken: 'CGA Junior Auditor Jobs 2026: 39 Vacancies Ann — CareerDost',
    },
    {
      raw: 'Punjab Last Mile Water Supply Project 2026: 5,000+ Filtration Plants & Priority Districts',
      broken: 'Punjab Last Mile Water Supply Project 2026: 5, — CareerDost',
    },
    {
      raw: 'IRSA Jobs 2026 — 23 Vacancies for Engineers, Supervisors, GIS Analyst & Auditor | Apply via NTS',
      broken: 'IRSA Jobs 2026 — 23 Vacancies for Engineers, S — CareerDost',
    },
    {
      raw: 'PSEB Jobs 2026 — Pakistan Software Export Board Government IT Vacancies',
      broken: 'PSEB Jobs 2026 — Pakistan Software Export Boar — CareerDost',
    },
    {
      raw: 'SSGC Gasification Plan: 46 Sindh Villages in Sanghar & Shikarpur to Get Gas Grid Connections (Rs 1.92B Project)',
      broken: 'SSGC Gasification Plan: 46 Sindh Villages in S — CareerDost',
    },
    {
      raw: 'Sindh Flood Housing Phase III: €115 Million EIB Financing Ratified by Provincial Cabinet (SPHF Reconstruction Update)',
      broken: 'Sindh Flood Housing Phase III: €115 Million EI — CareerDost',
    },
    {
      raw: 'SPSC CCE 2026 Examination Reforms: Upper Age Limit Raised to 33, 5 Attempts Allowed & 33% Screening Cutoff',
      broken: 'SPSC CCE 2026 Examination Reforms: Upper Age L — CareerDost',
    },
    {
      raw: 'National Bank of Pakistan (NBP) Jobs October 2026: Executive & Unit Head Vacancies in Karachi (AVP to EVP)',
      broken: 'National Bank of Pakistan (NBP) Jobs October 2 — CareerDost',
    },
    {
      raw: 'MRP Elite Graduate Trainee Officer (GTO) Karachi 2026: IT & Database Track Verification Status',
      broken: 'MRP Elite Graduate Trainee Officer (GTO) Karac — CareerDost',
    },
    {
      raw: 'DRAP Medicine Barcode Notification 2026: Mandatory 2D Serialization Rules & Older Batch Exemption',
      broken: 'DRAP Medicine Barcode Notification 2026: Manda — CareerDost',
    },
    {
      raw: 'HEC Jobs 2026 – 9 Government Vacancies, Apply Before October 14',
      broken: 'HEC Jobs 2026 – 9 Government Vacancies, — CareerDost',
    },
  ]

  for (const c of knownBrokenCases) {
    assert.strictEqual(isBrokenSeoTitle(c.broken, c.raw), true, `Must detect broken title: ${c.broken}`)
    const regenerated = buildCleanSeoTitle(c.raw, c.broken)
    assert.notStrictEqual(regenerated, c.broken, `Must regenerate broken title: ${c.broken}`)
    assert(regenerated.length <= 60, `Regenerated title must be <= 60 chars (${regenerated.length}): ${regenerated}`)
    assert.strictEqual(isBrokenSeoTitle(regenerated, c.raw), false, `Regenerated title must pass validation: ${regenerated}`)
  }
  console.log(`  [PASS] All ${knownBrokenCases.length} known malformed/truncated existing SEO titles detected and cleanly regenerated (<= 60 chars)`)

  console.log('\n=== 5. Descriptive lastDate & deadline Preservation Tests (Up to 120 chars) ===')
  const longLastDate = 'Project Approval in Principle (Detailed Engineering & Bidding Forthcoming)' // 74 chars
  const longDeadline = 'Cabinet Approval Reported — Formal SPSC Gazette Notification Awaited' // 68 chars

  const rLongDateArt = await callAdminRoute(db, token, 'PUT', `/articles/${baseArticle.slug}`, {
    ...baseArticle,
    lastDate: longLastDate,
    noDeadline: true,
  })
  assert.strictEqual(rLongDateArt.status, 200)
  assert.strictEqual(
    rLongDateArt.json.data.lastDate,
    longLastDate,
    `Expected full 74-char lastDate to be preserved, got "${rLongDateArt.json.data.lastDate}"`
  )
  console.log(`  [PASS] Article lastDate (74 chars) preserved intact without mid-word truncation: "${rLongDateArt.json.data.lastDate}"`)

  const rLongDateUpd = await callAdminRoute(db, token, 'PUT', `/updates/${baseUpdate.slug}`, {
    ...baseUpdate,
    deadline: longDeadline,
    noDeadline: true,
  })
  assert.strictEqual(rLongDateUpd.status, 200)
  assert.strictEqual(
    rLongDateUpd.json.data.deadline,
    longDeadline,
    `Expected full 68-char deadline to be preserved, got "${rLongDateUpd.json.data.deadline}"`
  )
  console.log(`  [PASS] Daily Update deadline (68 chars) preserved intact without mid-word truncation: "${rLongDateUpd.json.data.deadline}"`)
}

runTests().catch((err) => {
  console.error(err)
  process.exit(1)
})
