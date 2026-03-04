import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime, timedelta

class WebScraper:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape_url(self, url):
        self.logger.info(f"Scraping generic website: {url}")
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                self.logger.error(f"Failed to fetch: {url}. Status: {response.status_code}")
                return None
            
            soup = BeautifulSoup(response.content, 'lxml')
            
            # This is a generic heuristic scraper. 
            # In a real MVP, we'd have specific parser functions for popular sites.
            title = soup.find('h1').text.strip() if soup.find('h1') else "Untitled Giveaway"
            description = soup.find('p').text.strip() if soup.find('p') else "No description available."
            
            # Simple prize detection
            prize = "Check website"
            # Logic here to look for "Nagrada:", "Osvoji:", "Prize:" etc.
            
            return {
                "title": title,
                "description": description,
                "prize": prize,
                "entryUrl": url,
                "brand": url.split("//")[-1].split("/")[0], # Simple brand from domain
                "country": "RS", # Default for now
                "category": "General",
                "startDate": datetime.now().isoformat(),
                "endDate": (datetime.now() + timedelta(days=7)).isoformat() # Placeholder
            }
        except Exception as e:
            self.logger.error(f"Error scraping {url}: {e}")
            return None

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    scraper = WebScraper()
    data = scraper.scrape_url("https://www.google.com") # Just to test
    print(data)
