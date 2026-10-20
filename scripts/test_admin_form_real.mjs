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

async function run() {
  console.log('=== PRECISE ADMIN LOGIN TEST IN REAL BROWSER ===');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();

  page.on('console', msg => console.log(`[BROWSER_CONSOLE_${msg.type()}]`, msg.text()));
  page.on('pageerror', err => console.log('[BROWSER_ERROR]', err.toString()));

  page.on('request', req => {
    if (req.url().includes('/api/')) {
      console.log(`[HTTP_REQ] ${req.method()} ${req.url()}`);
      if (req.postData()) {
        const pd = req.postData();
        // Mask password if present
        const sanitized = pd.replace(/"password":"[^"]+"/, '"password":"[MASKED]"');
        console.log(`  Payload: ${sanitized}`);
      }
    }
  });

  page.on('response', async res => {
    if (res.url().includes('/api/')) {
      let body = '';
      try { body = await res.text(); } catch (e) { body = '[CANT_READ]'; }
      console.log(`[HTTP_RES] ${res.status()} ${res.url()}`);
      console.log(`  Body: ${body.substring(0, 300)}`);
    }
  });

  await page.goto('https://careerdost.blog/admin', { waitUntil: 'networkidle2' });

  // Target specifically the form containing password input
  const loginForm = await page.$('form:has(input[type="password"])');
  if (!loginForm) {
    console.error('Login form with password input NOT FOUND!');
    await browser.close();
    return;
  }

  const usernameInput = await loginForm.$('input[type="text"]');
  const passwordInput = await loginForm.$('input[type="password"]');
  const submitButton = await loginForm.$('button[type="submit"]');

  console.log('Found username input:', Boolean(usernameInput));
  console.log('Found password input:', Boolean(passwordInput));
  console.log('Found submit button:', Boolean(submitButton));

  await usernameInput.type(env.INITIAL_ADMIN_USERNAME, { delay: 30 });
  await passwordInput.type(env.INITIAL_ADMIN_PASSWORD, { delay: 30 });

  console.log('Clicking Sign In to CMS Portal button...');
  await submitButton.click();

  // Wait 4 seconds for React state update / API response
  await new Promise(r => setTimeout(r, 4000));

  const afterState = await page.evaluate(() => {
    const token = localStorage.getItem('careerdost_admin_token');
    const hasPasswordInput = Boolean(document.querySelector('input[type="password"]'));
    const errorEl = document.querySelector('.bg-brick-light, .text-brick, [role="alert"]');
    const bodyText = document.body.innerText;
    return {
      hasPasswordInput,
      tokenPresent: Boolean(token),
      tokenSnippet: token ? `${token.slice(0, 15)}...${token.slice(-10)}` : 'NONE',
      errorMessage: errorEl ? errorEl.innerText : 'NO_ERROR_ALERT',
      isDashboardVisible: bodyText.includes('Dashboard') || bodyText.includes('Published Articles') || bodyText.includes('Sign Out') || bodyText.includes('Create Update'),
      headings: Array.from(document.querySelectorAll('h1, h2')).map(h => h.innerText)
    };
  });

  console.log('\nState after login:', JSON.stringify(afterState, null, 2));

  await page.screenshot({ path: 'scratch/screenshots/admin_login_after_real_submit.png' });
  console.log('Saved screenshot to scratch/screenshots/admin_login_after_real_submit.png');

  await browser.close();
}

run().catch(console.error);
