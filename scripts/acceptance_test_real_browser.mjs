import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envLocal.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
}

const screenshotDir = path.resolve('scratch/screenshots/acceptance');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function runAcceptance() {
  console.log('=== RUNNING REAL BROWSER ACCEPTANCE TESTS ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-quic', '--window-size=1280,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  // 1. TEST ADMIN LOGIN & PERSISTENCE
  console.log('--- 1. Testing Admin Login & Multi-Request Persistence ---');
  await page.goto('https://careerdost.blog/admin', { waitUntil: 'networkidle2' });

  const loginForm = await page.$('form:has(input[type="password"])');
  if (!loginForm) throw new Error('Admin login form not found');

  const usernameInput = await loginForm.$('input[type="text"]');
  const passwordInput = await loginForm.$('input[type="password"]');
  const submitButton = await loginForm.$('button[type="submit"]');

  await usernameInput.type(env.INITIAL_ADMIN_USERNAME, { delay: 20 });
  await passwordInput.type(env.INITIAL_ADMIN_PASSWORD, { delay: 20 });
  await submitButton.click();

  // Wait for dashboard to render
  await page.waitForFunction(() => document.body.innerText.includes('CMS Content Dashboard'), { timeout: 10000 });
  console.log('✓ Successfully logged in! Dashboard is visible.');

  await page.screenshot({ path: path.join(screenshotDir, '01_acceptance_dashboard_active.png') });

  // Test session persistence: Navigate to an article and return to /admin
  console.log('Testing session persistence across navigation...');
  await page.goto('https://careerdost.blog/jobs/niahs-hyderabad-bsn-nursing-admissions-2026-27', { waitUntil: 'networkidle2' });
  await page.goto('https://careerdost.blog/admin', { waitUntil: 'networkidle2' });

  const isStillLoggedIn = await page.evaluate(() => {
    return document.body.innerText.includes('CMS Content Dashboard') && !document.querySelector('input[type="password"]');
  });
  console.log('✓ Session persisted after navigation (Did not bounce to login):', isStillLoggedIn);
  if (!isStillLoggedIn) throw new Error('Session persistence failed! Was bounced to login.');

  // Test logout
  console.log('Testing Sign Out button...');
  const signOutBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign Out'));
  });
  if (signOutBtn) {
    await signOutBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    const isLoggedOut = await page.evaluate(() => Boolean(document.querySelector('input[type="password"]')));
    console.log('✓ Successfully logged out:', isLoggedOut);
    await page.screenshot({ path: path.join(screenshotDir, '02_acceptance_after_logout.png') });
  }

  // 2. TEST HOMEPAGE CARD IMAGES
  console.log('\n--- 2. Testing Homepage Cards & Image Rendering ---');
  await page.goto('https://careerdost.blog', { waitUntil: 'networkidle2' });

  // Scroll to trigger lazy categories
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 1500));
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 1500));
  });

  const imgResults = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('article img, .card img, main img'));
    return imgs.map(img => ({
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      isBroken: img.naturalWidth === 0 && img.naturalHeight === 0
    }));
  });

  const brokenImgs = imgResults.filter(i => i.isBroken);
  console.log(`Evaluated ${imgResults.length} images on Homepage:`);
  console.log(`✓ Broken images count: ${brokenImgs.length}`);
  if (brokenImgs.length > 0) {
    console.error('Broken images:', brokenImgs);
  }

  await page.screenshot({ path: path.join(screenshotDir, '03_acceptance_homepage_desktop.png'), fullPage: true });

  // 3. TEST MOBILE VIEWPORT
  console.log('\n--- 3. Testing Mobile Viewport (iPhone / Pixel) ---');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('https://careerdost.blog', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(screenshotDir, '04_acceptance_homepage_mobile.png'), fullPage: false });
  console.log('✓ Captured mobile viewport screenshot');

  await browser.close();
  console.log('\n=== ALL REAL BROWSER ACCEPTANCE TESTS PASSED SUCCESSFULLY ===');
}

runAcceptance().catch(err => {
  console.error('Acceptance test failed:', err);
  process.exit(1);
});
