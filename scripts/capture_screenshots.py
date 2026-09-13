import time
import os
import traceback
from playwright.sync_api import sync_playwright

os.makedirs('assets/screenshots', exist_ok=True)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel='chrome')
        context = browser.new_context(viewport={'width': 1366, 'height': 850})

        # 1. HITL Flight Booking Intercept
        print("1. Opening Streamlit at http://localhost:8501...")
        page = context.new_page()
        page.goto("http://localhost:8501", wait_until="load")
        time.sleep(3)

        print("Typing flight booking query...")
        ta = page.locator("textarea").last
        ta.fill("Book flight from Bangalore to Patna on 25th October under 6000 INR")
        ta.press("Enter")
        print("Waiting for response...")
        time.sleep(6)
        page.screenshot(path="assets/screenshots/hitl_flight_boundary.png")
        print("Saved assets/screenshots/hitl_flight_boundary.png")
        page.close()

        # 2. Deep Research MoE vs Dense
        print("2. Opening Streamlit for MoE research...")
        page2 = context.new_page()
        page2.goto("http://localhost:8501", wait_until="load")
        time.sleep(3)
        ta2 = page2.locator("textarea").last
        ta2.fill("DeepSeek-V3 MoE vs Llama 3.3 70B architecture and benchmarks comparison")
        ta2.press("Enter")
        print("Waiting for research response...")
        time.sleep(6)
        page2.screenshot(path="assets/screenshots/deep_research_moe.png")
        print("Saved assets/screenshots/deep_research_moe.png")
        page2.close()

        # 3. Full-Stack React Web App
        print("3. Opening React App at http://localhost:5000...")
        page3 = context.new_page()
        page3.goto("http://localhost:5000", wait_until="load")
        time.sleep(4)
        page3.screenshot(path="assets/screenshots/react_web_app.png")
        print("Saved assets/screenshots/react_web_app.png")
        page3.close()

        browser.close()
        print("ALL SCREENSHOTS CAPTURED SUCCESSFULLY!")
except Exception as e:
    print("Error during screenshot capture:", e)
    traceback.print_exc()
