const chromeLauncher = require('chrome-launcher');
const http = require('http');

async function testJobsPages() {
  console.log('=== RUNNING HEADLESS CHROME DOM & HYDRATION AUDIT ===\n');

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox'],
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const getJson = (path) => new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port: chrome.port, path }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  try {
    const targets = await getJson('/json/list');
    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === msgId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise(res => ws.onopen = res);

    const testUrls = [
      {
        url: 'https://careerdost.blog/jobs/kp-government-project-associate-internship-2026',
        imgMatch: 'kp-project-associate-internship-2026'
      },
      {
        url: 'https://careerdost.blog/jobs/aku-karachi-jobs-traineeships-2026',
        imgMatch: 'aku-karachi-careers-traineeships-2026'
      },
      {
        url: 'https://careerdost.blog/jobs/systems-limited-associate-software-engineer-jobs-2026',
        imgMatch: 'systems-limited-ase-jobs-2026'
      },
      {
        url: 'https://careerdost.blog/jobs/hbl-jobs-internships-the-league-2026',
        imgMatch: 'hbl-the-league-jobs-internships-2026'
      },
      {
        url: 'https://careerdost.blog/jobs/jazz-careers-ai-associate-programme-2026',
        imgMatch: 'jazz-ai-associate-programme-careers-2026'
      }
    ];

    await send('Page.enable');
    await send('Runtime.enable');

    // Emulate mobile viewport (375x667)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });

    let allPass = true;

    for (const item of testUrls) {
      console.log(`\nTesting DOM Hydration & Mobile Viewport: ${item.url}`);
      const consoleErrors = [];
      const errListener = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.method === 'Runtime.exceptionThrown') {
          consoleErrors.push(msg.params.exceptionDetails.text);
        }
        if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
          // Ignore external analytics or tracker timeouts if any
          const txt = msg.params.args.map(a => a.value || a.description).join(' ');
          if (!txt.includes('google-analytics') && !txt.includes('doubleclick') && !txt.includes('zanderio')) {
            consoleErrors.push(txt);
          }
        }
      };
      ws.addEventListener('message', errListener);

      await send('Page.navigate', { url: item.url });
      await new Promise(r => setTimeout(r, 4500));

      const evalResult = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          h1: document.querySelector('h1')?.innerText?.trim(),
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          hasErrorBoundary: document.body.innerText.includes('Something went wrong'),
          featuredImageLoaded: !!document.querySelector('img[src*="${item.imgMatch}"]')?.naturalWidth,
          imageAlt: document.querySelector('img[src*="${item.imgMatch}"]')?.alt,
          hasQuickFactsTable: document.querySelectorAll('table').length >= 1,
          hasFAQs: document.body.innerText.includes('Frequently Asked Questions'),
          noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2
        })`,
        returnByValue: true
      });

      const res = evalResult.result.value;
      console.log('  H1:', res.h1);
      console.log('  Canonical:', res.canonical);
      console.log('  Image Loaded:', res.featuredImageLoaded);
      console.log('  Image Alt:', res.imageAlt);
      console.log('  Has Quick Facts:', res.hasQuickFactsTable);
      console.log('  Has FAQs:', res.hasFAQs);
      console.log('  No Horizontal Overflow:', res.noHorizontalOverflow);
      console.log('  Error Boundary Triggered:', res.hasErrorBoundary);
      console.log('  Console Errors:', consoleErrors.length > 0 ? consoleErrors : 'None (0 errors)');

      if (!res.h1 || !res.canonical || res.hasErrorBoundary || !res.noHorizontalOverflow || consoleErrors.length > 0) {
        allPass = false;
        console.error('  ✗ FAIL on', item.url);
      } else {
        console.log('  ✓ PASS');
      }

      ws.removeEventListener('message', errListener);
    }

    if (allPass) {
      console.log('\n=== ALL 5 JOBS PASSED DOM HYDRATION & MOBILE AUDIT ===\n');
    } else {
      console.error('\n=== DOM HYDRATION AUDIT HAD FAILURES ===\n');
      process.exit(1);
    }
  } finally {
    await chrome.kill();
  }
}

testJobsPages().catch(err => {
  console.error('Fatal DOM test error:', err);
  process.exit(1);
});
