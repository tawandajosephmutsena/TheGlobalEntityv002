import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs, including errors
  page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
      if (msg.text().includes('AppLogo Render')) {
          console.log(`[Browser Console] Found AppLogo Render: ${msg.text()}`);
      }
  });

  console.log('Navigating to http://agent.test/ ...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('networkidle');

  console.log('Clicking Services link (real browser click)...');
  await page.evaluate(() => {
    const link = document.querySelector('nav .hidden.lg\\:flex a[href="/services"]');
    if (link) link.click();
    else {
        // Try alternate selector
        const allLinks = Array.from(document.querySelectorAll('a'));
        const servicesLink = allLinks.find(a => a.href.includes('/services') && a.textContent.toLowerCase().includes('services'));
        if (servicesLink) {
            console.log('Found services link via text match, clicking...');
            servicesLink.click();
        } else {
            console.log('Could not find /services link');
        }
    }
  });

  await page.waitForTimeout(5000); // Give it time to break and Log
  
  await browser.close();
})();
