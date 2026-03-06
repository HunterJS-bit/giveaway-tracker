from googlesearch import search
import logging

class GoogleScraper:
    def __init__(self, country='RS', language='sr'):
        self.country = country
        self.language = language
        self.logger = logging.getLogger(__name__)

    def find_giveaways(self, query="nagradna igra srbija 2026", num_results=10):
        self.logger.info(f"Searching Google for: {query}")
        links = []
        try:
            # Use 'region' if supported by the library, otherwise it uses global search
            for url in search(query, num_results=num_results, lang=self.language):
                links.append(url)
        except Exception as e:
            self.logger.error(f"Error during Google search: {e}")
        
        return list(set(links))

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    scraper = GoogleScraper()
    results = scraper.find_giveaways()
    for res in results:
        print(res)
