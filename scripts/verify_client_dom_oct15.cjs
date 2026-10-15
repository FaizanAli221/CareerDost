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
      'https://careerdost.blog/jobs/wheat-seed-prices-2026-pakistan-nsdra-directives',
      'https://careerdost.blog/jobs/fbr-tax-return-deadline-2026-extension-status-iris-filing-guide'
    ];

    await send('Page.enable');
    await send('Runtime.enable');

    // Emulate mobile viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      mobile: true
    });

    for (const url of testUrls) {
      console.log(`\nTesting DOM Hydration & Mobile Viewport: ${url}`);
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

      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 5000));

      const evalResult = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          h1: document.querySelector('h1')?.innerText,
          hasErrorBoundary: document.body.innerText.includes('Something went wrong'),
          featuredImageLoaded: !!document.querySelector('img[src*="wheat-seed-prices"], img[src*="fbr-tax-return"]')?.naturalWidth,
          hasKeyInfoSummary: document.body.innerText.includes('Official Source') || document.body.innerText.includes('Verified Official Source'),
          hasFAQs: document.body.innerText.includes('Frequently Asked Questions'),
          hasSindhiSocialBanner: document.body.innerText.includes('CareerDost')
        })`,
        returnByValue: true
      });

      console.log('Result:', JSON.stringify(evalResult.result.value, null, 2));
      console.log('Console Errors:', consoleErrors.length > 0 ? consoleErrors : 'None (0 errors)');
      ws.removeEventListener('message', errListener);
    }
  } finally {
    await chrome.kill();
  }
}

testPages().catch(console.error);
