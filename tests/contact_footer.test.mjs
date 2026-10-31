import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'

console.log('=== CareerDost Contact Page & Footer Improvements Test Suite ===\n')

const footerPath = path.resolve('src/components/Footer.jsx')
const contactPath = path.resolve('src/pages/Contact.jsx')
const appPath = path.resolve('src/App.jsx')
const middlewarePath = path.resolve('functions/_middleware.js')

const footerCode = fs.readFileSync(footerPath, 'utf8')
const contactCode = fs.readFileSync(contactPath, 'utf8')
const appCode = fs.readFileSync(appPath, 'utf8')
const middlewareCode = fs.readFileSync(middlewarePath, 'utf8')

// 1. Footer Link Checks
console.log('1. Checking Footer Links & Accessibility...')
const requiredFooterLinks = [
  { text: 'About Us', to: '/about' },
  { text: 'Contact Us', to: '/contact' },
  { text: 'Privacy Policy', to: '/privacy-policy' },
  { text: 'Disclaimer', to: '/disclaimer' },
  { text: 'Terms & Conditions', to: '/terms-and-conditions' },
]

for (const link of requiredFooterLinks) {
  assert(
    footerCode.includes(`to="${link.to}"`),
    `Footer missing link to ${link.to}`
  )
  const escapedText = link.text.replace(/&/g, '&amp;')
  assert(
    footerCode.includes(link.text) || footerCode.includes(escapedText),
    `Footer missing exact link text "${link.text}"`
  )
  console.log(`  ✓ Found "${link.text}" -> ${link.to}`)
}

// 2. Footer Email & Socials
console.log('\n2. Checking Footer Email & Social Links...')
assert(
  footerCode.includes('href="mailto:careerdost02@gmail.com"'),
  'Footer missing mailto:careerdost02@gmail.com link'
)
console.log('  ✓ Found mailto:careerdost02@gmail.com in footer')

assert(
  footerCode.includes('href="https://wa.me/923173425680"'),
  'Footer missing WhatsApp helpline'
)
console.log('  ✓ Found WhatsApp Helpline 03173425680 in footer')

assert(
  footerCode.includes('WHATSAPP_CHANNEL_URL'),
  'Footer missing WhatsApp Channel URL'
)
console.log('  ✓ Found WhatsApp Channel URL in footer')

assert(
  !footerCode.includes('/admin'),
  'Footer exposes admin-only route /admin'
)
console.log('  ✓ Verified NO admin-only links exist in public footer')

assert(
  footerCode.includes('focus-visible:ring-2') && footerCode.includes('focus-visible:ring-green'),
  'Footer missing visible focus-visible ring styles'
)
console.log('  ✓ Verified keyboard accessibility focus-visible rings in footer')

// 3. Contact Page Checks
console.log('\n3. Checking Contact Page Requirements...')
assert(
  contactCode.includes('careerdost02@gmail.com'),
  'Contact page missing verified email careerdost02@gmail.com'
)
assert(
  contactCode.includes('href="mailto:careerdost02@gmail.com"'),
  'Contact page missing clickable mailto:careerdost02@gmail.com link'
)
console.log('  ✓ Contact page displays verified email careerdost02@gmail.com with clickable mailto:')

assert(
  !contactCode.includes('contact@careerdost.blog'),
  'Contact page references unconfigured contact@careerdost.blog'
)
console.log('  ✓ Verified contact@careerdost.blog is NOT referenced')

assert(
  !contactCode.toLowerCase().includes('dns configuration'),
  'Contact page contains outdated "DNS configuration" text'
)
console.log('  ✓ Verified no outdated "DNS configuration" text exists')

assert(
  contactCode.includes('mailto:careerdost02@gmail.com?subject='),
  'Contact page missing pre-filled direct email composer mailto link'
)
console.log('  ✓ Verified pre-filled mailto dispatch for honest delivery to editorial inbox')

assert(
  contactCode.includes('https://wa.me/923173425680'),
  'Contact page missing direct WhatsApp Helpline link'
)
console.log('  ✓ Verified direct WhatsApp Helpline dispatch')

// 4. App Routes Checks
console.log('\n4. Checking App Routes & Canonical Redirects...')
const requiredRoutes = [
  '/about',
  '/contact',
  '/privacy-policy',
  '/disclaimer',
  '/terms-and-conditions',
]
for (const route of requiredRoutes) {
  assert(
    appCode.includes(`path="${route}"`),
    `App.jsx missing route definition for ${route}`
  )
  console.log(`  ✓ Route ${route} defined in App.jsx`)
}

assert(
  appCode.includes('path="/privacy"') && appCode.includes('to="/privacy-policy"'),
  'App.jsx missing /privacy -> /privacy-policy redirect'
)
assert(
  appCode.includes('path="/terms"') && appCode.includes('to="/terms-and-conditions"'),
  'App.jsx missing /terms -> /terms-and-conditions redirect'
)
console.log('  ✓ Alias redirects /privacy and /terms present in App.jsx')

// 5. Cloudflare Middleware / SSR Alignment
console.log('\n5. Checking Cloudflare Middleware SSR & Sitemap Alignment...')
assert(
  middlewareCode.includes("lowerPath === '/contact'"),
  'Middleware missing SSR handler for /contact'
)
assert(
  middlewareCode.includes('careerdost02@gmail.com'),
  'Middleware missing verified email careerdost02@gmail.com'
)
assert(
  !middlewareCode.includes('DNS configuration'),
  'Middleware contains outdated "DNS configuration" text'
)
console.log('  ✓ Cloudflare Middleware SSR aligns with verified email and no outdated DNS text')

// 6. AdSense Verification
console.log('\n6. Checking Google AdSense Configuration Preservation...')
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8')
assert(
  indexHtml.includes('ca-pub-3823137402984505'),
  'index.html AdSense publisher ID altered or missing'
)
assert(
  middlewareCode.includes('pub-3823137402984505'),
  'middleware.js ads.txt AdSense publisher ID altered or missing'
)
console.log('  ✓ Google AdSense client ca-pub-3823137402984505 intact in index.html and ads.txt')

console.log('\nALL CONTACT & FOOTER TESTS PASSED SUCCESSFULLY! ✓\n')
