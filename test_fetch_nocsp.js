import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
      bypassCSP: true
  });
  const page = await context.newPage();
  
  page.on('console', msg => {
      const text = msg.text();
      // Only log what we need to avoid noise
      if (text.includes('AppLogo Render') || text.includes('Navigation Render')) {
          console.log(`[Browser Console] ${text}`);
      }
  });

  console.log('Navigating and bypassing CSP...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('networkidle');

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
        return logo ? logo.textContent : 'Could not find NO SITE/HAS SITE pre tag in DOM';
  });
  
  console.log("APP LOGO SITE STATE ON /SERVICES PAGE:", logoText);
  
  console.log('Clicking Logo to return home...');
  await page.evaluate(() => {
        const logoDiv = document.querySelector('.bg-agency-accent');
        if (logoDiv && logoDiv.closest('a')) logoDiv.closest('a').click();
        else console.log('Could not find Logo link');
  });
  
  await page.waitForTimeout(3000);
  
  const logoTextHome = await page.evaluate(() => {
        const logoSpans = Array.from(document.querySelectorAll('pre'));
        const logo = logoSpans.find(span => span.textContent.includes('NO SITE') || span.textContent.includes('HAS SITE'));
        return logo ? logo.textContent : 'Could not find NO SITE/HAS SITE pre tag in DOM';
  });
  
  console.log("APP LOGO SITE STATE AFTER RETURNING TO /:", logoTextHome);
  
  await browser.close();
})();
