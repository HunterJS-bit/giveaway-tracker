import argparse
import logging
from google_scraper import GoogleScraper
from instagram_scraper import InstagramScraper
from web_scraper import WebScraper
from bridge import LocalDataStorage

def main():
    parser = argparse.ArgumentParser(description="Balkan Giveaway Scraper")
    parser.add_argument("--query", type=str, default="nagradna igra srbija 2026", help="Search query for Google")
    parser.add_argument("--insta", type=str, help="Instagram profile URL to check")
    parser.add_argument("--url", type=str, help="Specific website URL to scrape")
    parser.add_argument("--limit", type=int, default=5, help="Number of Google results to process")
    parser.add_argument("--output", type=str, default="scraped_data.json", help="Local file to save results")

    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    storage = LocalDataStorage(output_file=args.output)
    web_scraper = WebScraper()

    # 1. Google Search
    if args.query:
        google = GoogleScraper()
        links = google.find_giveaways(args.query, num_results=args.limit)
        for link in links:
            if "instagram" in link:
                insta = InstagramScraper()
                if insta.check_profile_for_giveaways(link):
                    logger.info(f"Potential giveaway link found (Instagram): {link}")
                    # Save Instagram link info too? Scraper seems to only save web data for now.
                    # We can add more logic here if needed.
            else:
                data = web_scraper.scrape_url(link)
                if data:
                    storage.save_data(data)

    # 2. Specific Instagram profile
    if args.insta:
        insta = InstagramScraper()
        if insta.check_profile_for_giveaways(args.insta):
            logger.info(f"Giveaway detected on: {args.insta}")

    # 3. Specific URL
    if args.url:
        data = web_scraper.scrape_url(args.url)
        if data:
            storage.save_data(data)

if __name__ == "__main__":
    main()
