export const GIVEAWAYS_PAGE_SIZE = 9;

export const useGiveaways = () => {
    const config = useRuntimeConfig();
    const giveaways = useState<any[]>('giveaways', () => []);
    const isLoading = useState<boolean>('giveaways-loading', () => false);
    const totalCount = useState<number>('giveaways-total', () => 0);
    const page = useState<number>('giveaways-page', () => 1);

    const limit = GIVEAWAYS_PAGE_SIZE;

    // Filtering State
    const category = useState<string>('giveaways-category', () => 'All');
    const platform = useState<string>('giveaways-platform', () => 'All');
    const searchQuery = useState<string>('giveaways-search', () => '');
    const sort = useState<string>('giveaways-sort', () => 'endingSoonest');

    const apiBase = config.public.apiBase || 'http://localhost:3000';
    const baseUrl = `${apiBase}/api`;

    const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / limit)));

    /**
     * Fetch one page of giveaways, replacing the current list.
     *
     * @param target Page to load. Pass `true` to reset to the first page
     *               (used when filters/search/sort change).
     */
    const fetchGiveaways = async (target: number | true = page.value) => {
        if (isLoading.value) return;

        const nextPage = target === true ? 1 : Math.max(1, target);

        isLoading.value = true;

        try {
            const queryParams: any = {
                limit,
                offset: (nextPage - 1) * limit,
            };

            if (category.value !== 'All') queryParams.category = category.value;
            if (platform.value !== 'All') queryParams.platform = platform.value;
            if (searchQuery.value) queryParams.search = searchQuery.value;
            queryParams.sort = sort.value;

            const response: any = await $fetch(`${baseUrl}/giveaways`, {
                query: queryParams,
            });

            giveaways.value = response.data || [];
            totalCount.value = response.totalCount || 0;
            page.value = nextPage;
        } catch (error) {
            console.error('Error fetching giveaways:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const goToPage = async (nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages.value || nextPage === page.value) return;
        await fetchGiveaways(nextPage);
    };

    const submitGiveaway = async (url: string) => {
        try {
            await $fetch(`${baseUrl}/submissions`, {
                method: 'POST',
                body: { url },
            });
            return { success: true };
        } catch (error: any) {
            console.error('Error submitting giveaway:', error);
            return {
                success: false,
                error: error.data?.error || 'Failed to submit'
            };
        }
    };

    return {
        giveaways,
        isLoading,
        totalCount,
        page,
        totalPages,
        limit,
        category,
        platform,
        searchQuery,
        sort,
        fetchGiveaways,
        goToPage,
        submitGiveaway,
    };
};
