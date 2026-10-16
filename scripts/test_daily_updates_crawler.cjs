const chromeLauncher = require('chrome-launcher');
const http = require('http');

const CRAWLER_AGENTS = [
  { name: 'Googlebot Smartphone', ua: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.69 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  { name: 'Bingbot', ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.1938.76 Safari/537.36' },
  { name: 'GPTBot', ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)' },
  { name: 'PerplexityBot', ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)' },
  { name: 'ClaudeBot', ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)' }
];

async function runTest() {
  console.log('=== TESTING /daily-updates UNDER CRAWLER CONDITIONS ===\n');

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
    await send('Network.enable');

    for (const bot of CRAWLER_AGENTS) {
      console.log(`\nTesting: [${bot.name}]`);
      await send('Network.setUserAgentOverride', { userAgent: bot.ua });

      const errors = [];
      const errHandler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.method === 'Runtime.exceptionThrown') {
          errors.push(msg.params.exceptionDetails.text + (msg.params.exceptionDetails.exception?.description || ''));
        }
        if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
          const txt = msg.params.args.map(a => a.value || a.description).join(' ');
          if (!txt.includes('google-analytics') && !txt.includes('doubleclick')) {
            errors.push(txt);
          }
        }
      };
      ws.addEventListener('message', errHandler);

      await send('Page.navigate', { url: 'https://careerdost.blog/daily-updates' });
      await new Promise(r => setTimeout(r, 5000));

      const res = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          h1: document.querySelector('h1')?.innerText,
          bodySample: document.body.innerText.slice(0, 200).replace(/\\n+/g, ' '),
          hasSomethingWentWrong: document.body.innerText.includes('Something Went Wrong'),
          itemCount: document.querySelectorAll('article').length
        })`,
        returnByValue: true
      });

      console.log('  Result:', res.result.value);
      console.log('  Errors:', errors.length > 0 ? errors : 'None');
      ws.removeEventListener('message', errHandler);
    }
  } finally {
    await chrome.kill();
  }
}

runTest().catch(console.error);
