import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

async function main() {
  const testUrl = process.argv[2] || 'https://careerdost.blog/jobs/sindh-minimum-wage-2026-workers-salary';
  console.log(`Launching headless Chrome for ${testUrl}...`);
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage'
    ],
    chromePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  console.log(`Chrome running on port ${chrome.port}. Running Lighthouse...`);
  try {
    const runnerResult = await lighthouse(testUrl, {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port,
      maxWaitForLoad: 45000,
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        disabled: false
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        requestLatencyMs: 562.5,
        downloadThroughputKbps: 1474.56,
        uploadThroughputKbps: 675,
        cpuSlowdownMultiplier: 4
      }
    });

    const lhr = runnerResult.lhr;
    console.log('\n=== LIGHTHOUSE MOBILE PERFORMANCE RESULTS ===');
    console.log(`Performance Score: ${Math.round(lhr.categories.performance.score * 100)}/100`);
    console.log(`FCP: ${lhr.audits['first-contentful-paint'].displayValue}`);
    console.log(`LCP: ${lhr.audits['largest-contentful-paint'].displayValue}`);
    console.log(`CLS: ${lhr.audits['cumulative-layout-shift'].displayValue}`);
    console.log(`TBT: ${lhr.audits['total-blocking-time'].displayValue}`);
    console.log(`Speed Index: ${lhr.audits['speed-index'].displayValue}`);
    
    if (lhr.audits['largest-contentful-paint-element']?.details?.items?.[0]) {
      const lcpItem = lhr.audits['largest-contentful-paint-element'].details.items[0];
      console.log(`LCP Element: ${lcpItem.node?.snippet || lcpItem.node?.nodeLabel}`);
    }

    // Save report
    if (!fs.existsSync('scratch')) fs.mkdirSync('scratch');
    fs.writeFileSync('scratch/lighthouse-report.json', JSON.stringify(lhr, null, 2));
    console.log('\nSaved full report to scratch/lighthouse-report.json');
  } finally {
    await chrome.kill();
  }
}

main().catch(err => {
  console.error('Lighthouse error:', err);
  process.exit(1);
});
