const chromeLauncher = require('chrome-launcher');
const http = require('http');

async function testPages() {
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
        url: 'https://careerdost.blog/jobs/samba-bank-relationship-associate-jobs-2026',
        imgKey: 'samba-bank-relationship-associate-jobs-2026'
      },
      {
        url: 'https://careerdost.blog/jobs/bank-alfalah-jobs-internships-2026',
        imgKey: 'bank-alfalah-jobs-internships-2026'
      },
      {
        url: 'https://careerdost.blog/jobs/ezy-business-applications-paid-internship-karachi-2026',
        imgKey: 'ezy-business-applications-paid-internship-karachi-2026'
      },
      {
        url: 'https://careerdost.blog/jobs/unilever-pakistan-jobs-october-2026',
        imgKey: 'unilever-pakistan-jobs-october-2026'
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

    for (const item of testUrls) {
      console.log(`\nTesting DOM Hydration & Mobile Layout (375x667): ${item.url}`);
      const consoleErrors = [];
      const errListener = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.method === 'Runtime.exceptionThrown') {
          consoleErrors.push(msg.params.exceptionDetails.text);
        }
        if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
      };
      ws.addEventListener('message', errListener);

      await send('Page.navigate', { url: item.url });
      await new Promise(r => setTimeout(r, 4500));

      const evalResult = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          h1: document.querySelector('h1')?.innerText,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          hasErrorBoundary: document.body.innerText.includes('Something went wrong'),
          featuredImageLoaded: !!document.querySelector('img[src*="${item.imgKey}"]')?.naturalWidth,
          imageAlt: document.querySelector('img[src*="${item.imgKey}"]')?.alt,
          hasQuickFactsTable: document.querySelectorAll('table').length >= 1,
          hasFAQs: document.body.innerText.includes('Frequently Asked Questions'),
          hasFraudPrevention: document.body.innerText.includes('Fraud') || document.body.innerText.includes('Scam') || document.body.innerText.includes('Safety'),
          noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 2
        })`,
        returnByValue: true
      });

      console.log('Mobile Render Result:', JSON.stringify(evalResult.result.value, null, 2));
      console.log('Console Errors:', consoleErrors.length > 0 ? consoleErrors : 'None (0 errors)');
      ws.removeEventListener('message', errListener);
    }
  } finally {
    await chrome.kill();
  }
}

testPages().catch(console.error);
