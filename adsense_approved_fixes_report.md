# CareerDost.blog — Approved AdSense Audit Fixes Report

**Date:** 10 November 2026  
**Project:** `careerdost` (`https://careerdost.blog`)  
**Scope:** Approved AdSense Readiness Fixes (Alias Slugs, Adsterra Privacy Disclosure, Thin Daily Updates, `JobPosting` Schema Designations, Editorial Hold Visibility, Testing & Production Deployment)

---

## Executive Summary & Safety Rule Compliance

All five approved fix areas have been implemented in strict compliance with the safety rules:
1. **Pre-Change Backups Created:** Full backups of all modified source files and D1 database snapshots were saved to `g:\Carreer-dost\backups\adsense_approved_fixes_backup_20261110\` prior to any edit.
2. **Zero Deletions:** No article or `daily_updates` row was deleted or had its publication status modified in Cloudflare D1 or SQLite.
3. **Zero Fabricated Details:** All `JobPosting.title` designations were extracted strictly from verified official recruitment notices already present in the article bodies.
4. **Architecture Preserved:** Existing React/Vite, Cloudflare Pages middleware SSR, D1, and Hono API architecture remain intact.
5. **Adsterra Components Unchanged:** [`AdsterraBanner300x250.jsx`](file:///g:/Carreer-dost/src/components/AdsterraBanner300x250.jsx) and [`AdsterraNativeBanner.jsx`](file:///g:/Carreer-dost/src/components/AdsterraNativeBanner.jsx) were left untouched.

---

## 1. Fix the Three Alias Slug Problems

### Root Cause & D1 Verification
Previously, [`functions/_middleware.js`](file:///g:/Carreer-dost/functions/_middleware.js) and [`server/routes/articles.js`](file:///g:/Carreer-dost/server/routes/articles.js) used an internal `lookupSlug` alias map that silently fetched a different database row while serving HTTP `200 OK` under the requested alias URL:
- Because `window.__INITIAL_ARTICLE__.slug` contained the database slug while the browser URL had the alias slug, [`ArticlePage.jsx`](file:///g:/Carreer-dost/src/pages/ArticlePage.jsx#L41-L55) rejected the SSR hydration payload (`window.__INITIAL_ARTICLE__.slug === slug` evaluated to `false`) and triggered a client-side re-fetch, or served duplicate content under two different canonical URLs.
- Furthermore, D1 verification confirmed:
  - **D1 Article ID `556`** in `articles` is `fpsc-online-application-challan-form-32a-guide` (*"FPSC Online Application Guide: Treasury Challan 32-A, Quotas & Test Scheme"*), and **D1 Article ID `489`** (`556` in local SQLite) is `sindh-education-rsu-consultant-jobs-2026` (*"Sindh Education RSU Consultant Jobs 2026: Social Safeguard & Foundational Learning Specialists (PPS-8/9)"*).
  - **Neither** row is a CTI (College Teaching Interns) article, and **no published CTI article exists** in the `articles` or `daily_updates` tables. Serving RSU Consultant content under `/jobs/sindh-cti-jobs-2026-college-teaching-interns` violated content integrity.

### Implemented Fix
| Alias / Legacy URL | Verified D1 Target | Implemented Behavior |
| :--- | :--- | :--- |
| `/jobs/spsc-combined-competitive-exam-guide-2026` | **ID `555`**: `/jobs/spsc-exam-preparation-screening-challan-guide` (*"SPSC Exam Preparation Guide: Screening Test, Syllabus, Challan & Quota Rules"*) | **Single-hop `301` Redirect** via `STATIC_ROUTE_REDIRECTS` in [`functions/_middleware.js`](file:///g:/Carreer-dost/functions/_middleware.js#L50) and `<Navigate>` in [`src/App.jsx`](file:///g:/Carreer-dost/src/App.jsx#L48). |
| `/jobs/njp-balochistan-quota-federal-jobs-november-2026` | **ID `585`**: `/jobs/economic-affairs-division-jobs-balochistan-2026` (*"Economic Affairs Division Jobs 2026: Balochistan Quota Vacancies in Islamabad"*, which contains the complete 8-article Balochistan quota directory) | **Single-hop `301` Redirect** via `STATIC_ROUTE_REDIRECTS` in [`functions/_middleware.js`](file:///g:/Carreer-dost/functions/_middleware.js#L51) and `<Navigate>` in [`src/App.jsx`](file:///g:/Carreer-dost/src/App.jsx#L49). |
| `/jobs/sindh-cti-jobs-2026-college-teaching-interns` | None (No published CTI article exists in D1; ID `489` / SQLite `556` is Sindh Education RSU Consultants) | **Genuine HTTP `404 Not Found`** with `X-Robots-Tag: noindex, nofollow`. Removed the bogus `lookupSlug` alias from [`functions/_middleware.js`](file:///g:/Carreer-dost/functions/_middleware.js#L1990-L2000) and [`server/routes/articles.js`](file:///g:/Carreer-dost/server/routes/articles.js#L68-L72), and removed the `/daily-updates/sindh-college-education-teaching-interns-ctis-jobs-2026` redirect entry so unrelated RSU content is never served under a CTI URL. |

- On every canonical `/jobs/:slug` page, `window.__INITIAL_ARTICLE__.slug` now strictly matches the requested `:slug` parameter, guaranteeing 100% SSR-to-React client hydration parity.

---

## 2. Adsterra Privacy Disclosure

### Implemented Fix
Updated both the React component [`src/pages/Privacy.jsx`](file:///g:/Carreer-dost/src/pages/Privacy.jsx#L104-L163) and the edge SSR handler in [`functions/_middleware.js`](file:///g:/Carreer-dost/functions/_middleware.js#L2781-L2810) so `/privacy-policy` accurately discloses:
- Third-party advertising providers active on CareerDost, specifically naming **Google AdSense** and **Adsterra** (including third-party ad delivery domains `highperformanceformat.com` and `pl29190020.profitablecpmratenetwork.com`).
- The use of cookies, JavaScript tags, web beacons, and embedded iframes by third-party ad networks to deliver ads, measure impressions, cap frequency, and evaluate campaign performance.
- Automatic transmission of standard browser request metadata (IP address, user-agent, device type, operating system, and referring URL) when third-party ad scripts load.
- Clarification that CareerDost does not control third-party cookies placed by external ad networks, alongside direct links for users to manage cookie settings, opt out via `adssettings.google.com`, or use `www.aboutads.info/choices`.

---

## 3. Thin Daily Updates (ID 1 & ID 2)

### D1 Inspection & Evaluation
- **Daily Update ID `1`** (`/daily-updates/fpsc-consolidated-advertisement-09-2026-announced`): 170 words, application deadline passed (`2026-10-20`), covered comprehensively by primary FPSC guides (`/jobs/fpsc-online-application-challan-form-32a-guide` and `/jobs/fpsc-assistant-director-2026`).
- **Daily Update ID `2`** (`/daily-updates/hec-fully-funded-phd-scholarships-2026-open`): 158 words, brief summary announcement.
- **Action Taken (No Deletion, Status Preserved):**
  - Both records remain `status = 'published'` in D1 and SQLite so visitors browsing the `/daily-updates` feed can still view them.
  - Added both slugs to `NOINDEX_UPDATE_SLUGS` in [`functions/_middleware.js`](file:///g:/Carreer-dost/functions/_middleware.js#L58-L61), [`src/pages/UpdateDetailPage.jsx`](file:///g:/Carreer-dost/src/pages/UpdateDetailPage.jsx#L133-L144), [`server/routes/seo.js`](file:///g:/Carreer-dost/server/routes/seo.js#L12-L17), and [`scripts/generate_sitemap.js`](file:///g:/Carreer-dost/scripts/generate_sitemap.js#L155-L160).
  - Both URLs are now **excluded from `/sitemap.xml`** and emit `<meta name="robots" content="noindex, follow" />` plus HTTP header `X-Robots-Tag: noindex, follow`.

---

## 4. `JobPosting` Schema Titles (IDs 564, 565, 567, 571)

### D1 Inspection & Schema Fix
In [`src/lib/jobSchema.js`](file:///g:/Carreer-dost/src/lib/jobSchema.js#L255-L262), updated `VERIFIED_JOB_DESIGNATIONS` so `JobPosting.title` emits only the verified official job designations without raw vacancy counts or promotional phrasing, while keeping visible article headlines untouched:

| D1 ID | Article Slug | Previous `JobPosting.title` | New Verified `JobPosting.title` |
| :--- | :--- | :--- | :--- |
| **564** | `sindh-irrigation-department-jobs-2026-badin-tando-muhammad-khan` | `"10 Guni Canal + 26 Akram Wah"` | `"Darogha, Jeep Driver, Gauge Reader, Beldar & Field Staff (BPS-01 to BPS-04)"` |
| **565** | `district-sessions-court-dadu-jobs-2026-nts` | `"7 Stenographers, 1 Data Coder, 20 Junior Clerks"` | `"Stenographer (BPS-16), Data Coder (BPS-14) & Junior Clerk (BPS-11)"` |
| **567** | `islamabad-police-jobs-2026-790-constable-asi-sub-inspector` | `"Frontline Law Enforcement"` | `"Constable (BS-07), Assistant Sub-Inspector (BS-11) & Sub-Inspector (BS-14)"` |
| **571** | `survey-of-pakistan-jobs-2026-naib-qasid-sanitary-worker` | `"12 Naib Qasid, 2 Sanitary Worker"` | `"Naib Qasid & Sanitary Worker (BPS-01)"` |

- Also updated [`isGenuineJobVacancy`](file:///g:/Carreer-dost/src/lib/jobSchema.js#L456-L459) to evaluate `todayIso` in Pakistan Standard Time (`UTC+5`) so expired job postings never emit active `JobPosting` schema between `00:00` and `04:59` PKT.

---

## 5. Editorial Hold Title (Article ID 357)

### D1 Inspection & Visibility Treatment
- **Article ID `357`** (`/jobs/hyderabad-division-section-144-notification-2026`):
  - **Title:** *"Hyderabad Division Section 144 Imposed: 15-Day Restrictions Across 9 Districts (Editorial Hold)"*
  - **Root Cause:** The article body explicitly contains an editorial warning banner: *"EDITORIAL HOLD — PRIMARY SOURCE VERIFICATION PENDING: The original, signed official gazette notification issued by the Office of the Commissioner Hyderabad Division or the Sindh Home Department has not yet been directly obtained or inspected... this article is held on EDITORIAL HOLD as an unapproved internal draft."*
  - Furthermore, the corresponding record in `daily_updates` (`id=252`) is already set to `status = 'draft'`.
- **Action Taken & Recommendation:**
  - Per the strict rule (*"Do not publish unverified content. Remove internal editorial wording from public-facing metadata only if the article is approved for public display. Otherwise preserve the hold and recommend the correct visibility treatment"*):
    1. Preserved the database record (`id=357`) and its `(Editorial Hold)` notice untouched.
    2. Added `hyderabad-division-section-144-notification-2026` to `NOINDEX_ARTICLE_SLUGS` in [`functions/_middleware.js`](file:///g:/Carreer-dost/functions/_middleware.js#L54-L56), [`src/pages/ArticlePage.jsx`](file:///g:/Carreer-dost/src/pages/ArticlePage.jsx#L252-L262), [`server/routes/seo.js`](file:///g:/Carreer-dost/server/routes/seo.js#L12-L17), and [`scripts/generate_sitemap.js`](file:///g:/Carreer-dost/scripts/generate_sitemap.js#L155-L160).
    3. Excluded `/jobs/hyderabad-division-section-144-notification-2026` from `/sitemap.xml` and configured both SSR and client rendering to output `<meta name="robots" content="noindex, follow" />` and HTTP header `X-Robots-Tag: noindex, follow`.
    4. **Recommendation:** Keep `id=357` de-indexed (`noindex, follow`) or transition its `articles.status` to `'draft'` (matching `daily_updates` `id=252`) unless the primary Commissioner Hyderabad / Sindh Home Department gazette notification is obtained and verified.

---

## 6. Automated Testing, Live Verification & Deployment

- **`tests/phase2_content_quality.test.mjs`**: `6/6` checks passed.
- **`tests/adsense_approved_fixes.test.mjs`**: `6/6` checks passed.
- **Production Build (`npm run build`)**: Succeeded cleanly (`246` canonical indexable URLs generated in `public/sitemap.xml`, zero build errors).
- **Cloudflare Pages Deployment URL**: `https://c786aa8c.careerdost.pages.dev` (aliased to production `https://careerdost.blog`)
- **Live Production Verification (`https://careerdost.blog`)**:
  - `GET /jobs/spsc-combined-competitive-exam-guide-2026` → `301` redirect in 1 hop to `https://careerdost.blog/jobs/spsc-exam-preparation-screening-challan-guide` (`200 OK`, matching `canonical` and `window.__INITIAL_ARTICLE__.slug`).
  - `GET /jobs/njp-balochistan-quota-federal-jobs-november-2026` → `301` redirect in 1 hop to `https://careerdost.blog/jobs/economic-affairs-division-jobs-balochistan-2026` (`200 OK`, matching `canonical` and `window.__INITIAL_ARTICLE__.slug`).
  - `GET /jobs/sindh-cti-jobs-2026-college-teaching-interns` → Genuine `404 Not Found` (`X-Robots-Tag: noindex, nofollow`, zero unrelated RSU content served).
  - `GET /privacy-policy` → `200 OK` with full third-party advertising, cookie, web beacon, and Adsterra disclosures (`highperformanceformat.com`, `pl29190020.profitablecpmratenetwork.com`).
  - `GET /daily-updates/fpsc-consolidated-advertisement-09-2026-announced` & `GET /daily-updates/hec-fully-funded-phd-scholarships-2026-open` → `200 OK` with `<meta name="robots" content="noindex, follow" />`, `X-Robots-Tag: noindex, follow`, and excluded from `/sitemap.xml`.
  - `GET /jobs/sindh-irrigation-department-jobs-2026-badin-tando-muhammad-khan` (`id=564`), `/jobs/district-sessions-court-dadu-jobs-2026-nts` (`id=565`), `/jobs/islamabad-police-jobs-2026-790-constable-asi-sub-inspector` (`id=567`), and `/jobs/survey-of-pakistan-jobs-2026-naib-qasid-sanitary-worker` (`id=571`) → `200 OK` with clean verified `JobPosting.title` designations in JSON-LD.
  - `GET /jobs/hyderabad-division-section-144-notification-2026` (`id=357`) → `200 OK` with `<meta name="robots" content="noindex, follow" />`, `X-Robots-Tag: noindex, follow`, and excluded from `/sitemap.xml`.

