const chromeLauncher = require('chrome-launcher');
const http = require('http');

async function testHydratedDom() {
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
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary' });
    
    // Wait 6 seconds for complete React mount and hydration
    await new Promise(r => setTimeout(r, 6000));

    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const html = document.body.innerHTML;
        const terms = [
          'Qualification',
          'Job Type',
          'Last Date to Apply',
          'Official Website / Apply Link',
          'Protected Beneficiaries',
          'Worker Categories',
          'Notified Rates / Mandate',
          'Effective Date'
        ];
        const termChecks = terms.map(term => {
          const idx = text.indexOf(term);
          return {
            term,
            foundInText: idx !== -1,
            context: idx !== -1 ? text.substring(Math.max(0, idx - 40), Math.min(text.length, idx + 80)).replace(/\\n+/g, ' ') : null
          };
        });

        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
        const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim());
        const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim());

        // Check the sidebar or any details table
        const sidebar = document.querySelector('aside')?.innerText || 'No aside element';
        const tables = Array.from(document.querySelectorAll('table')).map(t => t.innerText.trim());

        return {
          termChecks,
          h1s,
          h2s,
          h3s,
          sidebarSnippet: sidebar.slice(0, 500).replace(/\\n+/g, ' '),
          tableCount: tables.length,
          tables
        };
      })()`,
      returnByValue: true
    });

    console.log('=== HYDRATED REACT DOM INSPECTION ===');
    console.log(JSON.stringify(result.result.value, null, 2));

  } finally {
    await chrome.kill();
  }
}

testHydratedDom().catch(console.error);
