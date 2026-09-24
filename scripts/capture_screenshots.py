import os
import pathlib
from playwright.sync_api import sync_playwright

def main():
    repo_root = pathlib.Path(__file__).parent.parent.resolve()
    assets_dir = repo_root / "assets" / "screenshots"
    assets_dir.mkdir(parents=True, exist_ok=True)

    html_path = repo_root / "public" / "index.html"
    file_url = f"file://{html_path}"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 800, "height": 600})

        # Open page
        page.goto(file_url)
        page.wait_for_timeout(500)

        # Take screenshot of initial state
        initial_screenshot = assets_dir / "app_initial.png"
        page.screenshot(path=str(initial_screenshot))
        print(f"Captured initial screenshot: {initial_screenshot}")

        # Fill inputs and calculate
        page.fill("#base", "2")
        page.wait_for_timeout(300)
        page.fill("#exponent", "8")
        page.wait_for_timeout(300)
        page.click("#calculate-btn")
        page.wait_for_timeout(500)

        # Take screenshot of calculated result state
        result_screenshot = assets_dir / "app_result.png"
        page.screenshot(path=str(result_screenshot))
        print(f"Captured result screenshot: {result_screenshot}")

        browser.close()

if __name__ == "__main__":
    main()
