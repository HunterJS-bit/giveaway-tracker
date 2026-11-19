// Category to placeholder image mapping
// Using Unsplash Source API for reliable category-based images
export const getCategoryPlaceholderImage = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  const categoryImages: Record<string, string> = {
    'tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'elektronika': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'travel': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'putovanja': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'car': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    'automobili': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
    'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    'moda': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    'food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'hrana': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'ljepota': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'sports': 'https://images.unsplash.com/photo-1461896836934- voices-0f3e9e8c3e?w=800&q=80',
    'sport': 'https://images.unsplash.com/photo-1461896836934- voices-0f3e9e8c3e?w=800&q=80',
    'home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    'kucanstvo': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80',
    'gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    'igre': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    'music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    'muzika': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    'books': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    'knjige': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    'pets': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    'ljubimci': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    'health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    'zdravlje': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
  };

  // Return category-specific image or default
  return categoryImages[categoryLower] || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80';
};
