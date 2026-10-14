import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

async function main() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  try {
    // Connect via CDP
    const versionRes = await fetch(`http://127.0.0.1:${chrome.port}/json/version`).then(r => r.json());
    const endpoint = versionRes.webSocketDebuggerUrl;
    console.log('Debugger endpoint:', endpoint);

    // Create a new tab
    const newTab = await fetch(`http://127.0.0.1:${chrome.port}/json/new?https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary`, { method: 'PUT' }).then(r => r.json());
    console.log('Tab opened:', newTab.url, 'Title:', newTab.title);

    // Wait 3 seconds
    await new Promise(r => setTimeout(r, 3000));
    
    // Check tab info
    const tabs = await fetch(`http://127.0.0.1:${chrome.port}/json`).then(r => r.json());
    console.log('Current tabs:', tabs.map(t => ({ url: t.url, title: t.title })));
  } finally {
    await chrome.kill();
  }
}

main().catch(console.error);
