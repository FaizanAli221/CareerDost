const chromeLauncher = require('chrome-launcher');
const http = require('http');

async function testPage() {
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
    
    const consoleErrors = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary' });

    // wait 6 seconds for full client hydration and rendering
    await new Promise(r => setTimeout(r, 6000));

    const evalResult = await send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        hasErrorBoundary: document.body.innerText.includes('Something went wrong'),
        h1: document.querySelector('h1')?.innerText,
        hasKeyInfo: document.body.innerText.includes('Key Official Notification Summary') || document.body.innerText.includes('Key Information Summary'),
        hasIssuingAuthority: document.body.innerText.includes('Issuing Authority'),
        hasWorkerCategories: document.body.innerText.includes('Worker Categories'),
        hasNotifiedRates: document.body.innerText.includes('Notified Rates / Mandate'),
        hasTransparencyBanner: document.body.innerText.includes('Official Source vs. CareerDost Analysis') || document.body.innerText.includes('Verified Official Source'),
        hasLabourLink: !!document.querySelector('a[href*="lhr.sindh.gov.pk"]'),
        hasApplyNow: document.body.innerText.includes('Apply Now') || document.body.innerText.includes('Apply Online'),
        actionButtonText: document.querySelector('a[href*="lhr.sindh.gov.pk"]')?.innerText,
        statusBadge: document.querySelector('.bg-blue-100, .bg-emerald-100')?.innerText,
        officialLinks: Array.from(document.querySelectorAll('a[href*="lhr.sindh.gov.pk"]')).map(a => ({ text: a.innerText.trim(), href: a.href })),
        textSnippet: document.body.innerText.slice(0, 600).replace(/\\n+/g, ' | ')
      })`,
      returnByValue: true
    });

    console.log('=== CLIENT-SIDE DOM HYDRATION AUDIT ===');
    console.log(JSON.stringify(evalResult.result.value, null, 2));
    console.log('\nConsole Errors:', consoleErrors.length > 0 ? consoleErrors : 'None (0 errors)');
  } finally {
    await chrome.kill();
  }
}

testPage().catch(console.error);
