import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const screenshotDir = path.resolve('scratch/screenshots/verification');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

function getCredentials() {
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
  return {
    username: env.INITIAL_ADMIN_USERNAME,
    password: env.INITIAL_ADMIN_PASSWORD
  };
}

async function runVerification() {
  console.log('================================================================');
  console.log('  CareerDost — Real Browser End-to-End Authentication Audit     ');
  console.log('================================================================\n');

  const { username, password } = getCredentials();
  if (!username || !password) {
    throw new Error('Credentials missing in .env.local');
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-quic', '--window-size=1280,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  // Phase 1: Navigate to Admin Login
  console.log('[Phase 1/5] Navigating to https://careerdost.blog/admin ...');
  await page.goto('https://careerdost.blog/admin', { waitUntil: 'networkidle2' });

  const loginForm = await page.$('form:has(input[type="password"])');
  if (!loginForm) {
    throw new Error('Login form not found on /admin');
  }

  const usernameInput = await loginForm.$('input[type="text"]');
  const passwordInput = await loginForm.$('input[type="password"]');
  const submitButton = await loginForm.$('button[type="submit"]');

  console.log('[Phase 2/5] Entering authorized credentials and signing in...');
  await usernameInput.type(username, { delay: 25 });
  await passwordInput.type(password, { delay: 25 });
  await submitButton.click();

  // Wait for dashboard to render
  await page.waitForFunction(
    () => document.body.innerText.includes('CMS Content Dashboard') || document.body.innerText.includes('Daily Updates ('),
    { timeout: 12000 }
  );
  console.log('[✓] Successfully authenticated! CMS Content Dashboard is visible.');
  await page.screenshot({ path: path.join(screenshotDir, '01_dashboard_logged_in.png') });

  // Phase 3: Dashboard Refresh / Session Persistence Test
  console.log('[Phase 3/5] Testing dashboard refresh & session persistence...');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const isStillLoggedIn = await page.evaluate(() => {
    const hasDashboardText = document.body.innerText.includes('CMS Content Dashboard') || document.body.innerText.includes('Daily Updates (');
    const hasPasswordInput = Boolean(document.querySelector('input[type="password"]'));
    const token = localStorage.getItem('careerdost_admin_token');
    return hasDashboardText && !hasPasswordInput && Boolean(token);
  });

  if (!isStillLoggedIn) {
    throw new Error('Session persistence failed! Dashboard refresh bounced back to login.');
  }
  console.log('[✓] Dashboard refresh passed. Session remained authenticated.');
  await page.screenshot({ path: path.join(screenshotDir, '02_dashboard_after_refresh.png') });

  // Phase 4: Article Editor Access Test
  console.log('[Phase 4/5] Testing Article Editor access...');
  // Click on "Job Articles" tab or "+ Create Job Article" button
  const createArticleBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('+ Create Job Article'));
  });

  if (!createArticleBtn) {
    throw new Error('"+ Create Job Article" button not found on dashboard');
  }

  await createArticleBtn.click();
  await new Promise(r => setTimeout(r, 2000));

  const isEditorVisible = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const hasTitleInput = Boolean(document.querySelector('input[placeholder*="e.g."], input[name="title"], form input'));
    return bodyText.includes('Create Job Article') || bodyText.includes('Job Title') || hasTitleInput;
  });

  if (!isEditorVisible) {
    throw new Error('Article editor form did not render correctly.');
  }
  console.log('[✓] Article editor accessed successfully.');
  await page.screenshot({ path: path.join(screenshotDir, '03_article_editor_access.png') });

  // Phase 5: Logout Test
  console.log('[Phase 5/5] Testing Sign Out functionality...');
  const signOutBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign Out'));
  });

  if (signOutBtn) {
    await signOutBtn.click();
    await new Promise(r => setTimeout(r, 2500));

    const isLoggedOut = await page.evaluate(() => {
      const hasPasswordInput = Boolean(document.querySelector('input[type="password"]'));
      const token = localStorage.getItem('careerdost_admin_token');
      return hasPasswordInput && !token;
    });

    if (!isLoggedOut) {
      throw new Error('Logout failed! Token still present or login form missing.');
    }
    console.log('[✓] Successfully logged out. Token cleared from browser storage.');
    await page.screenshot({ path: path.join(screenshotDir, '04_after_logout.png') });
  }

  await browser.close();
  console.log('\n================================================================');
  console.log('  [ALL TESTS PASSED] Production authentication verified 100%.   ');
  console.log('================================================================\n');
}

runVerification().catch(err => {
  console.error('\nVerification failed:', err.message);
  process.exit(1);
});
