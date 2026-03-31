import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
      bypassCSP: true
  });
  const page = await context.newPage();
  
  page.on('console', msg => {
      const text = msg.text();
      if (text.includes('AppLogo Render') || text.includes('Navigation Render')) {
          console.log(`[Browser Console] ${text}`);
      }
  });

  console.log('Navigating...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('domcontentloaded');

  console.log('Clicking Services link...');
  await page.evaluate(() => {
        const allLinks = Array.from(document.querySelectorAll('a'));
        const servicesLink = allLinks.find(a => a.href.includes('/services') && a.textContent.toLowerCase().includes('services'));
        if (servicesLink) servicesLink.click();
  });

  await page.waitForTimeout(3000);
  
  const logoText = await page.evaluate(() => {
        const logoSpans = Array.from(document.querySelectorAll('pre'));
        const logo = logoSpans.find(span => span.textContent.includes('NO SITE') || span.textContent.includes('HAS SITE'));
        return logo ? logo.textContent : 'none';
  });
  console.log("APP LOGO TEXT:", logoText);
  
  await browser.close();
})();
