import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

// Read credentials from .env.local without logging them
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

const screenshotDir = path.resolve('scratch/screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

async function run() {
  console.log('=== STARTING REAL BROWSER INVESTIGATION ===');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(err.toString());
  });

  const networkRequests = [];
  page.on('request', req => {
    networkRequests.push({
      url: req.url(),
      method: req.method(),
      headers: req.headers(),
      postData: req.postData() ? '[POST_DATA_PRESENT]' : undefined
    });
  });

  const networkResponses = [];
  page.on('response', async res => {
    let body = '';
    if (res.url().includes('/api/')) {
      try {
        body = await res.text();
      } catch (e) {
        body = '[UNABLE_TO_READ]';
      }
    }
    networkResponses.push({
      url: res.url(),
      status: res.status(),
      statusText: res.statusText(),
      headers: res.headers(),
      body: body ? (body.length > 500 ? body.substring(0, 500) + '...' : body) : undefined
    });
  });

  // --- PART 1: INVESTIGATE ADMIN LOGIN ---
  console.log('\n--- 1. Navigating to https://careerdost.blog/admin ---');
  await page.goto('https://careerdost.blog/admin', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(screenshotDir, '01_admin_login_initial.png') });

  // Inspect form DOM
  const formInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      name: i.name,
      type: i.type,
      placeholder: i.placeholder,
      id: i.id,
      className: i.className
    }));
    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText,
      type: b.type
    }));
    const turnstile = document.querySelector('.cf-turnstile, [data-sitekey], iframe[src*="turnstile"], iframe[src*="challenges"]');
    return {
      title: document.title,
      inputs,
      buttons,
      hasTurnstileElement: Boolean(turnstile),
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText)
    };
  });
  console.log('Admin Page Form Info:', JSON.stringify(formInfo, null, 2));

  // Check if already logged in or login form is present
  const isLoginFormPresent = await page.evaluate(() => {
    return Boolean(document.querySelector('input[type="password"]'));
  });

  if (isLoginFormPresent) {
    console.log('\n--- Attempting Login via Browser Form ---');
    // Type username
    const usernameInput = await page.$('input[type="text"], input[name="username"], input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');

    if (usernameInput && passwordInput) {
      await usernameInput.type(env.INITIAL_ADMIN_USERNAME, { delay: 30 });
      await passwordInput.type(env.INITIAL_ADMIN_PASSWORD, { delay: 30 });

      // Take screenshot of filled form (masking password)
      await page.screenshot({ path: path.join(screenshotDir, '02_admin_form_filled.png') });

      // Click submit
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        console.log('Submitting login form...');
        await Promise.all([
          submitBtn.click(),
          page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(e => console.log('Navigation wait timeout/no navigation:', e.message))
        ]);
      } else {
        console.log('No submit button found, pressing Enter');
        await passwordInput.press('Enter');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(e => console.log('Navigation wait timeout/no navigation:', e.message));
      }

      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(screenshotDir, '03_admin_after_submit.png') });

      const postLoginInfo = await page.evaluate(() => {
        const errorAlert = document.querySelector('.alert-error, .text-red-500, [role="alert"], .bg-red-50, .text-rose-600, p[class*="red"], span[class*="red"]');
        const tokenInLocal = localStorage.getItem('careerdost_admin_token');
        return {
          currentUrl: window.location.href,
          pageTitle: document.title,
          hasPasswordInput: Boolean(document.querySelector('input[type="password"]')),
          errorMessage: errorAlert ? errorAlert.innerText : 'NO_ERROR_ELEMENT_FOUND',
          tokenPresentInLocalStorage: Boolean(tokenInLocal),
          tokenLength: tokenInLocal ? tokenInLocal.length : 0,
          cookies: document.cookie,
          dashboardHeadings: Array.from(document.querySelectorAll('h1, h2, h3, nav')).map(el => el.innerText.slice(0, 100))
        };
      });
      console.log('Post-Login State:', JSON.stringify(postLoginInfo, null, 2));
    }
  } else {
    console.log('Login form not present, might be already logged in or stuck!');
  }

  // Print all network activity related to /api/
  console.log('\n--- API Network Responses during Login ---');
  const apiResponses = networkResponses.filter(r => r.url.includes('/api/'));
  for (const r of apiResponses) {
    console.log(`[${r.status}] ${r.url}`);
    if (r.body) console.log(`  Body: ${r.body}`);
  }

  console.log('\n--- Console Logs during Login ---');
  for (const l of consoleLogs) {
    console.log(`[${l.type}] ${l.text}`);
  }

  console.log('\n--- Page Errors during Login ---');
  for (const e of pageErrors) {
    console.log(`[PAGE_ERROR] ${e}`);
  }

  // --- PART 2: INVESTIGATE FEATURED IMAGES IN BROWSER ---
  console.log('\n=== 2. INVESTIGATING FEATURED IMAGES ON HOMEPAGE ===');
  await page.goto('https://careerdost.blog', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(screenshotDir, '04_homepage.png'), fullPage: false });

  // Inspect homepage cards and images
  const homeImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img')).map(img => {
      const rect = img.getBoundingClientRect();
      return {
        src: img.src,
        currentSrc: img.currentSrc,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: rect.width,
        displayHeight: rect.height,
        isBroken: img.naturalWidth === 0 && img.naturalHeight === 0 && img.src !== '',
        cardTitle: img.closest('article, .card, a')?.querySelector('h2, h3, h4')?.innerText || ''
      };
    });
    return imgs;
  });
  console.log(`Found ${homeImages.length} images on Homepage:`);
  homeImages.forEach((img, idx) => {
    console.log(`[${idx}] ${img.src} (natural: ${img.naturalWidth}x${img.naturalHeight}, display: ${Math.round(img.displayWidth)}x${Math.round(img.displayHeight)}, broken: ${img.isBroken}) -> Title: "${img.cardTitle}"`);
  });

  // Check 5 specific article pages
  const testArticles = [
    '/jobs/memon-college-of-nursing-karachi-bsn-admissions-2026-27',
    '/jobs/niahs-hyderabad-bsn-nursing-admissions-2026-27',
    '/jobs/nts-nat-xi-2026-november-registration-guide',
    '/jobs/gepco-jobs-2026',
    '/jobs/bank-of-punjab-relationship-officer-transaction-banking-2026'
  ];

  for (let i = 0; i < testArticles.length; i++) {
    const slugPath = testArticles[i];
    const fullUrl = `https://careerdost.blog${slugPath}`;
    console.log(`\n--- Inspecting Article ${i + 1}: ${fullUrl} ---`);
    await page.goto(fullUrl, { waitUntil: 'networkidle2' });
    const screenPath = path.join(screenshotDir, `05_article_${i + 1}.png`);
    await page.screenshot({ path: screenPath });

    const articleImgData = await page.evaluate(() => {
      const heroImg = document.querySelector('img[fetchpriority="high"], article img, .article-hero img, main img');
      return {
        title: document.title,
        h1: document.querySelector('h1')?.innerText,
        heroImg: heroImg ? {
          src: heroImg.src,
          currentSrc: heroImg.currentSrc,
          alt: heroImg.alt,
          naturalWidth: heroImg.naturalWidth,
          naturalHeight: heroImg.naturalHeight,
          complete: heroImg.complete
        } : null
      };
    });
    console.log('Article Rendered Data:', JSON.stringify(articleImgData, null, 2));
  }

  // Check Service Worker registration
  const swInfo = await page.evaluate(async () => {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.map(r => ({ scope: r.scope, active: Boolean(r.active) }));
    }
    return 'NO_SW_SUPPORT';
  });
  console.log('\nService Worker Info:', JSON.stringify(swInfo, null, 2));

  await browser.close();
  console.log('\n=== REAL BROWSER INVESTIGATION COMPLETE ===');
}

run().catch(console.error);
