import requests
from bs4 import BeautifulSoup
import re
import logging

class InstagramScraper:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def check_profile_for_giveaways(self, profile_url):
        self.logger.info(f"Checking Instagram profile: {profile_url}")
        # Note: Scrapping Instagram directly without API is unreliable
        # This is a basic placeholder that would need a real driver (Selenium/Playwright)
        # for a production-ready solution due to Instagram's dynamic loading.
        try:
            response = requests.get(profile_url, headers=self.headers)
            if response.status_code == 200:
                # In a real scenario, we'd parse JSON from the window.__additionalData
                # or use a headless browser.
                if "giveaway" in response.text.lower() or "nagradna" in response.text.lower():
                    return True
            return False
        except Exception as e:
            self.logger.error(f"Error checking Instagram: {e}")
            return False

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    scraper = InstagramScraper()
    # Example check
    is_giveaway = scraper.check_profile_for_giveaways("https://www.instagram.com/techshopsrbija")
    print(f"Giveaway detected: {is_giveaway}")
