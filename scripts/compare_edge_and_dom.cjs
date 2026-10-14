const chromeLauncher = require('chrome-launcher');
const http = require('http');

async function compare() {
  // 1. Fetch raw edge HTML
  const edgeRes = await fetch('https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary');
  const edgeHtml = await edgeRes.text();

  // 2. Launch headless Chrome to get hydrated DOM
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
    await new Promise(r => setTimeout(r, 6000));

    const domData = await send('Runtime.evaluate', {
      expression: `(() => {
        const root = document.getElementById('root');
        return {
          h1: Array.from(root.querySelectorAll('h1')).map(h => h.innerText.trim()),
          h2: Array.from(root.querySelectorAll('h2')).map(h => h.innerText.trim()),
          h3: Array.from(root.querySelectorAll('h3')).map(h => h.innerText.trim()),
          textSnippet: root.innerText
        };
      })()`,
      returnByValue: true
    });

    // Extract H1 and H2 from edge HTML
    const edgeH1 = Array.from(edgeHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const edgeH2 = Array.from(edgeHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)).map(m => m[1].replace(/<[^>]+>/g, '').trim());

    console.log('=== EDGE HTML vs HYDRATED DOM COMPARISON ===');
    console.log('\n--- Edge HTML H1 ---', edgeH1);
    console.log('\n--- Hydrated DOM H1 ---', domData.result.value.h1);
    console.log('\n--- Edge HTML H2 ---', edgeH2);
    console.log('\n--- Hydrated DOM H2 ---', domData.result.value.h2);

    // Differences in H2
    const inEdgeNotDom = edgeH2.filter(h => !domData.result.value.h2.includes(h));
    const inDomNotEdge = domData.result.value.h2.filter(h => !edgeH2.includes(h));
    console.log('\n--- In Edge but NOT in Hydrated DOM ---', inEdgeNotDom);
    console.log('\n--- In Hydrated DOM but NOT in Edge ---', inDomNotEdge);

  } finally {
    await chrome.kill();
  }
}

compare().catch(console.error);
