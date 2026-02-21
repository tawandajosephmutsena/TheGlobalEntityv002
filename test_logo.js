import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs, including errors
  page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
      console.log(`[Browser Error] ${err.message}`);
  });

  console.log('Navigating to http://agent.test/ ...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('networkidle');
  
  console.log('Clicking Services link...');
  await page.evaluate(() => {
    const link = document.querySelector('nav .hidden.lg\\:flex a[href="/services"]');
    if (link) link.click();
    else console.log('Could not find /services link');
  });
  await page.waitForTimeout(2000);
  
  console.log('Clicking Logo to return home...');
  await page.evaluate(() => {
    const link = document.querySelector('nav a[href="/"]');
    if (link) link.click();
    else console.log('Could not find / link');
  });
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
