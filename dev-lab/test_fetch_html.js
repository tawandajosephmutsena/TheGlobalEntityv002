import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
      console.log(`[Browser Console] ${msg.text()}`);
  });

  console.log('Navigating to http://agent.test/ ...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('networkidle');

  console.log('Dumping Navigation HTML...');
  const navHtml = await page.evaluate(() => {
        const nav = document.querySelector('nav');
        return nav ? nav.outerHTML : 'No Nav Element Found';
  });
  console.log(navHtml.substring(0, 1500));
  
  await browser.close();
})();
