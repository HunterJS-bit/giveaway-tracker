export interface Category {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    giveawayCount?: number;
}

export const useCategories = () => {
    const config = useRuntimeConfig();
    // useState keeps the cache SSR-safe: the server-fetched list is serialized
    // into the payload so the client hydrates with the same categories.
    const _categories = useState<Category[]>('categories', () => []);
    const _loaded = useState<boolean>('categories-loaded', () => false);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchCategories = async () => {
        if (_loaded.value) return;
        isLoading.value = true;

        const apiBase = config.public.apiBase || 'http://localhost:3000';

        try {
            const data = await $fetch<Category[]>(`${apiBase}/api/categories`);
            _categories.value = data;
            _loaded.value = true;
        } catch (e) {
            error.value = 'Greška pri učitavanju kategorija.';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        categories: _categories,
        isLoading,
        error,
        fetchCategories,
    };
};
