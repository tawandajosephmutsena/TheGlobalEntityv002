import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs, including errors
  page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  });

  console.log('Navigating to http://agent.test/ ...');
  await page.goto('http://agent.test/');
  await page.waitForLoadState('networkidle');
  
  // Get the current version to use in our fetch
  const version = await page.evaluate(() => window.document.querySelector('[data-page]')?.getAttribute('data-page') ? JSON.parse(window.document.querySelector('[data-page]').getAttribute('data-page')).version : null);
  console.log("Inertia Version:", version);

  console.log('Triggering manual Inertia fetch to /services...');
  await page.evaluate(async (v) => {
    try {
        const res = await fetch('/services', {
            headers: {
                'X-Inertia': 'true',
                'X-Inertia-Version': v,
                'Accept': 'text/html, application/xhtml+xml',
                // Mimic standard inertia navigation
                'X-Requested-With': 'XMLHttpRequest' 
            }
        });
        const data = await res.json();
        console.log("MANUAL FETCH PROPS:", Object.keys(data.props));
        console.log("HAS SITE IN MANUAL FETCH:", !!data.props.site);
    } catch(err) {
        console.error("Fetch Error:", err);
    }
  }, version);
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
