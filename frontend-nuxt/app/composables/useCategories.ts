export interface Category {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    giveawayCount?: number;
}

const BASE_URL = 'http://localhost:3000';

// Module-level cache so categories are fetched once per app session
const _categories = ref<Category[]>([]);
const _loaded = ref(false);

export const useCategories = () => {
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const fetchCategories = async () => {
        if (_loaded.value) return;
        isLoading.value = true;
        try {
            const data = await $fetch<Category[]>(`${BASE_URL}/api/categories`);
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
