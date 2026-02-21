import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
      const text = msg.text();
      if (text.includes('AppLogo Render') || text.includes('Navigation Render') || text.includes('TypeError')) {
          console.log(`[Browser Console] ${text}`);
      }
  });

  console.log('Navigating to http://agent.test/ ...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('networkidle');

  console.log('Clicking Services link...');
  await page.evaluate(() => {
        // Try alternate selector because hydration might change DOM
        const allLinks = Array.from(document.querySelectorAll('a'));
        const servicesLink = allLinks.find(a => a.href.includes('/services') && a.textContent.toLowerCase().includes('services'));
        if (servicesLink) {
            console.log('Found services link, clicking...');
            servicesLink.click();
        } else {
            console.log('Could not find /services link');
        }
  });

  await page.waitForTimeout(3000);
  
  console.log('Clicking Logo to return home...');
  await page.evaluate(() => {
        const allLinks = Array.from(document.querySelectorAll('a'));
        const homeLink = allLinks.find(a => a.getAttribute('href') === '/' && a.querySelector('img, svg'));
        if (homeLink) {
            console.log('Found home link, clicking...');
            homeLink.click();
        } else {
            console.log('Could not find / link');
        }
  });
  
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
