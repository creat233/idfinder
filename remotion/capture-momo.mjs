import puppeteer from 'puppeteer-core';
const url = 'https://idfinder.lovable.app/m/tableaux-385888';
const browser = await puppeteer.launch({
  executablePath: '/bin/chromium',
  args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 2, isMobile: true });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 3500));
const dir = '/dev-server/remotion/public/screenshots';
// 1) hero/profile
await page.screenshot({ path: `${dir}/momo-hero.png` });
// 2) scroll to products
await page.evaluate(() => {
  const el = [...document.querySelectorAll('*')].find(e => /produits|services|boutique|🛍/i.test(e.textContent || ''));
  if (el) el.scrollIntoView({ block: 'start' });
  else window.scrollBy(0, 900);
});
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: `${dir}/momo-products.png` });
// 3) scroll further for more products
await page.evaluate(() => window.scrollBy(0, 800));
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: `${dir}/momo-products2.png` });
// 4) full page
await page.screenshot({ path: `${dir}/momo-full.png`, fullPage: true });
await browser.close();
console.log('done');
