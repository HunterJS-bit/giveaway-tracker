import json
import logging
import os
from datetime import datetime

class LocalDataStorage:
    def __init__(self, output_file="scraped_data.json"):
        self.output_file = output_file
        self.logger = logging.getLogger(__name__)

    def save_data(self, giveaway_data):
        self.logger.info(f"Saving data to local file: {giveaway_data.get('title')}")
        try:
            # Metadata for when it was scraped
            giveaway_data['scraped_at'] = datetime.now().isoformat()
            
            data = []
            if os.path.exists(self.output_file):
                with open(self.output_file, 'r', encoding='utf-8') as f:
                    try:
                        data = json.load(f)
                        if not isinstance(data, list):
                            data = []
                    except json.JSONDecodeError:
                        data = []

            # Duplicate detection based on entryUrl
            entry_url = giveaway_data.get('entryUrl')
            if entry_url:
                is_duplicate = any(item.get('entryUrl') == entry_url for item in data)
                if is_duplicate:
                    self.logger.info(f"Duplicate found for URL: {entry_url}. Skipping.")
                    return False

            data.append(giveaway_data)

            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            
            self.logger.info(f"Successfully saved to {self.output_file}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to save data: {e}")
            return False

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    storage = LocalDataStorage()
    # Mock save
    # storage.save_data({"title": "Test giveaway", "brand": "Test", "entryUrl": "http://test.com"})
