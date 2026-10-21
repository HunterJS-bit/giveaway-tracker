export const useFavorites = () => {
    const favorites = useState<string[]>('favorites', () => []);

    onMounted(() => {
        const stored = localStorage.getItem('favorites');
        if (stored) {
            try {
                favorites.value = JSON.parse(stored);
            } catch (e) {
                console.error('Error parsing favorites:', e);
            }
        }
    });

    const toggleFavorite = (id: string) => {
        const index = favorites.value.indexOf(id);
        if (index === -1) {
            favorites.value.push(id);
        } else {
            favorites.value.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites.value));
    };

    const isFavorite = (id: string) => {
        return favorites.value.includes(id);
    };

    return {
        favorites,
        toggleFavorite,
        isFavorite
    };
};
