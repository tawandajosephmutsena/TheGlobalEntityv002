import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://agent.test/', { waitUntil: 'networkidle' });
  
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      alt: img.alt
    }));
  });
  
  console.log("Images found:", images.length);
  images.forEach(img => {
    if (img.src.includes('.svg') || img.naturalWidth === 0) {
      console.log(`- ${img.src} (Width: ${img.naturalWidth}, Complete: ${img.complete}, Alt: ${img.alt})`);
    }
  });
  
  await browser.close();
})();
