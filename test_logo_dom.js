import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  
  console.log('Navigating to Home...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('domcontentloaded');

  const getLogoHtml = async () => {
      return await page.evaluate(() => {
          const nav = document.querySelector('nav');
          if (!nav) return 'No Nav';
          const link = nav.querySelector('a[href="/"]');
          if (!link) return 'No Logo Link';
          return link.innerHTML;
      });
  };

  console.log("HOME LOGO HTML:", await getLogoHtml());

  console.log('Clicking Services link...');
  await page.evaluate(() => {
        const allLinks = Array.from(document.querySelectorAll('a'));
        const servicesLink = allLinks.find(a => a.href.includes('/services') && a.textContent.toLowerCase().includes('services'));
        if (servicesLink) servicesLink.click();
  });
  await page.waitForTimeout(2000);

  console.log("SERVICES LOGO HTML:", await getLogoHtml());
  
  console.log('Clicking Logo to return Home...');
  await page.evaluate(() => {
        const nav = document.querySelector('nav');
        if (nav) {
            const link = nav.querySelector('a[href="/"]');
            if (link) link.click();
        }
  });
  await page.waitForTimeout(2000);

  console.log("BACK TO HOME LOGO HTML:", await getLogoHtml());
  
  await browser.close();
})();
