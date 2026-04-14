import os
import sys
from playwright.sync_api import sync_playwright

PAGES = [
    {"name": "Home", "url": "http://localhost:8080/"},
    {"name": "Blog_Index", "url": "http://localhost:8080/blog"},
    {"name": "Blog_Show", "url": "http://localhost:8080/blog/future-of-web-development-2024"},
    {"name": "Podcasts_Index", "url": "http://localhost:8080/podcasts"},
    {"name": "Services", "url": "http://localhost:8080/services"},
    {"name": "Contact", "url": "http://localhost:8080/contact"},
]

OUTPUT_DIR = "dev-lab/screenshots/mobile"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def capture_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 13 Pro dimensions: 390x844
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        for page_info in PAGES:
            print(f"Capturing {page_info['name']}...")
            try:
                page.goto(page_info['url'], wait_until="networkidle")
                # Wait for potential animations to settle
                page.wait_for_timeout(2000)
                
                output_path = f"{OUTPUT_DIR}/{page_info['name'].lower()}.png"
                page.screenshot(path=output_path, full_page=True)
                print(f"Saved to {output_path}")
            except Exception as e:
                print(f"Failed to capture {page_info['name']}: {e}")

        browser.close()

if __name__ == "__main__":
    capture_screenshots()
