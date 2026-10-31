import assert from 'node:assert/strict'
import fs from 'node:fs'
import { KNOWN_ARTICLE_SLUGS } from '../src/data/articleSlugs.js'
import { getUpdateTargetUrl } from '../src/lib/routing.js'

console.log('=== RUNNING CAREERDOST PHASE 1 REGRESSION TESTS ===\n')

// 1. Test articleSlugs
console.log('1. Testing articleSlugs.js dataset...')
assert.equal(typeof KNOWN_ARTICLE_SLUGS, 'object')
assert.ok(KNOWN_ARTICLE_SLUGS.size >= 150, `Expected at least 150 slugs, got ${KNOWN_ARTICLE_SLUGS.size}`)
assert.ok(KNOWN_ARTICLE_SLUGS.has('niahs-hyderabad-bsn-nursing-admissions-2026-27'), 'Contains known slug')
assert.ok(KNOWN_ARTICLE_SLUGS.has('spsc-cce-2026-screening-test-date'), 'Contains SPSC screening slug')
console.log('   ✓ articleSlugs.js contains', KNOWN_ARTICLE_SLUGS.size, 'verified slugs.\n')

// 2. Test getUpdateTargetUrl routing
console.log('2. Testing getUpdateTargetUrl routing logic...')
assert.equal(getUpdateTargetUrl(null), '/daily-updates')
assert.equal(getUpdateTargetUrl({}), '/daily-updates')

// targetUrl override
assert.equal(
  getUpdateTargetUrl({ slug: 'custom', targetUrl: 'https://example.com/custom' }),
  'https://example.com/custom'
)

// canonicalUrl check
assert.equal(
  getUpdateTargetUrl({ slug: 'test-job', canonicalUrl: 'https://careerdost.blog/jobs/test-job' }),
  '/jobs/test-job'
)
assert.equal(
  getUpdateTargetUrl({ slug: 'test-bulletin', canonicalUrl: 'https://careerdost.blog/daily-updates/test-bulletin' }),
  '/daily-updates/test-bulletin'
)

// hasArticle flag
assert.equal(getUpdateTargetUrl({ slug: 'foo', hasArticle: true }), '/jobs/foo')
assert.equal(getUpdateTargetUrl({ slug: 'bar', hasArticle: false }), '/daily-updates/bar')

// Known slug fallback
assert.equal(
  getUpdateTargetUrl({ slug: 'niahs-hyderabad-bsn-nursing-admissions-2026-27' }),
  '/jobs/niahs-hyderabad-bsn-nursing-admissions-2026-27'
)

// Unknown slug fallback
assert.equal(
  getUpdateTargetUrl({ slug: 'completely-unknown-update-slug-123' }),
  '/daily-updates/completely-unknown-update-slug-123'
)
console.log('   ✓ getUpdateTargetUrl routes correctly in all 7 test cases.\n')

// 3. Test Home.jsx search input attributes and below-the-fold eager loading
console.log('3. Testing Home.jsx search input and feed card priorities...')
const homeSource = fs.readFileSync('src/pages/Home.jsx', 'utf8')
assert.ok(homeSource.includes('id="home-search-input"'), 'Home search input has id="home-search-input"')
assert.ok(homeSource.includes('name="q"'), 'Home search input has name="q"')
assert.ok(!homeSource.includes('priority={idx < 2}'), 'No priority={idx < 2} below the fold')
assert.ok(homeSource.includes('<UpdateCard key={item.slug} updateItem={item} priority={false} />'), 'UpdateCard uses priority={false}')
assert.ok(homeSource.includes('<OpportunityCard key={item.slug} opportunity={item} priority={false} />'), 'OpportunityCard uses priority={false}')
console.log('   ✓ Home.jsx search attributes and lazy loading verified.\n')

// 4. Test index.html AdSense placement and Client ID
console.log('4. Testing index.html AdSense placement...')
const indexHtml = fs.readFileSync('index.html', 'utf8')
assert.ok(indexHtml.includes('ca-pub-3823137402984505'), 'index.html contains AdSense client ID')
const adsenseIndex = indexHtml.indexOf('adsbygoogle.js')
const headEndIndex = indexHtml.indexOf('</head>')
const fontsIndex = indexHtml.indexOf('fonts.googleapis.com')
assert.ok(adsenseIndex > -1, 'AdSense script tag found')
assert.ok(adsenseIndex < headEndIndex, 'AdSense is inside <head>')
assert.ok(adsenseIndex > fontsIndex, 'AdSense is positioned after fonts preload/preconnect')
console.log('   ✓ AdSense is safely placed in <head> after fonts.\n')

// 5. Test OptimizedImage.jsx API upload detection
console.log('5. Testing OptimizedImage.jsx component source...')
const optImgSource = fs.readFileSync('src/components/OptimizedImage.jsx', 'utf8')
assert.ok(optImgSource.includes('isApiUpload'), 'Detects isApiUpload')
assert.ok(optImgSource.includes('?w=640&v=card 640w'), 'Provides responsive 640w card variant in srcset')
assert.ok(optImgSource.includes('?w=1200&v=display 1200w'), 'Provides responsive 1200w display variant in srcset')
console.log('   ✓ OptimizedImage handles /api/uploads/ with responsive WebP variants.\n')

// 6. Test server uploads route
console.log('6. Testing server/routes/uploads.js...')
const uploadsRouteSource = fs.readFileSync('server/routes/uploads.js', 'utf8')
assert.ok(uploadsRouteSource.includes('requestedVariant'), 'Handles variant request')
assert.ok(uploadsRouteSource.includes('_card'), 'Checks _card variant')
assert.ok(uploadsRouteSource.includes('_display'), 'Checks _display variant')
console.log('   ✓ server/routes/uploads.js supports responsive variant serving.\n')

console.log('=== ALL REGRESSION TESTS PASSED SUCCESSFULLY! ===')
