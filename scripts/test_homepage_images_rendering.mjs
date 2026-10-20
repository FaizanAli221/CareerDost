import puppeteer from 'puppeteer-core';

async function testImages() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-quic', '--window-size=1280,1200']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });

  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  page.on('response', res => {
    if (res.url().includes('/images/')) {
      console.log(`[IMG_RES] ${res.status()} ${res.url()} (${res.headers()['content-type']})`);
    }
  });

  await page.goto('https://careerdost.blog', { waitUntil: 'networkidle2' });

  // Scroll down to trigger lazy loading
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'scratch/screenshots/04_homepage_scrolled.png', fullPage: true });

  const imagesStatus = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      loadingAttr: img.getAttribute('loading'),
      visible: img.getBoundingClientRect().height > 0
    }));
  });

  console.log('\n--- Image Evaluation After Scrolling ---');
  console.log(JSON.stringify(imagesStatus.slice(0, 15), null, 2));

  console.log('\n--- Failed Requests ---');
  console.log(JSON.stringify(failedRequests, null, 2));

  await browser.close();
}

testImages().catch(console.error);
