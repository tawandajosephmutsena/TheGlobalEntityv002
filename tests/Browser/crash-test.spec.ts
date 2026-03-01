import { test, expect } from '@playwright/test';

// Simple test to capture console errors
test('Capture console errors on Inquiries page', async ({ page }) => {
    const logs: string[] = [];
    
    // Listen to console events
    page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warn') {
            console.log(`BROWSER ${msg.type().toUpperCase()}: ${msg.text()}`);
        }
    });

    // Listen to uncaught exceptions
    page.on('pageerror', exception => {
        console.log(`BROWSER UNCAUGHT EXCEPTION: ${exception.message}`);
    });

    console.log('Navigating to login...');
    await page.goto('http://127.0.0.1:8000/login');
    
    // Login as admin
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    console.log('Navigating to inquiries...');
    // We navigate to the exact page the user is complaining about
    await page.goto('http://127.0.0.1:8000/admin/contact-inquiries');
    
    // Wait for the page to either render or crash
    await page.waitForTimeout(5000);
    
    console.log('Snapshot taking...');
    await page.screenshot({ path: 'inquiries-crash.png' });
    
    console.log('Done test');
});
