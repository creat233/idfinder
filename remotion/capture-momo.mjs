import puppeteer from 'puppeteer-core';
const url = 'https://idfinder.lovable.app/m/tableaux-385888';
const browser = await puppeteer.launch({
  executablePath: '/bin/chromium',
  args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 2, isMobile: true });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 4000));
const dir = '/dev-server/remotion/public/screenshots';

// Detect the scrollable container (page is often a flex container with internal overflow)
const scrollSelector = await page.evaluate(() => {
  const all = [...document.querySelectorAll('*')];
  const scrollable = all.find(el => {
    const s = getComputedStyle(el);
    return (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 50;
  });
  if (scrollable) {
    scrollable.id = scrollable.id || 'cap-scroll-target';
    return '#' + scrollable.id;
  }
  return null;
});
console.log('scroll target:', scrollSelector);

async function shoot(name, scrollY) {
  if (scrollSelector) {
    await page.evaluate((sel, y) => { document.querySelector(sel).scrollTop = y; }, scrollSelector, scrollY);
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: `${dir}/${name}.png` });
  console.log('shot', name);
}

await shoot('momo-hero', 0);
await shoot('momo-about', 700);
await shoot('momo-products', 1400);
await shoot('momo-products2', 2200);
await shoot('momo-bottom', 3200);

await browser.close();
console.log('done');
