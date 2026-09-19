export const useGiveaways = () => {
    const config = useRuntimeConfig();
    const giveaways = useState<any[]>('giveaways', () => []);
    const isLoading = useState<boolean>('giveaways-loading', () => false);
    const hasMore = useState<boolean>('giveaways-has-more', () => true);
    const offset = useState<number>('giveaways-offset', () => 0);
    const limit = 12;

    // Filtering State
    const category = useState<string>('giveaways-category', () => 'All');
    const platform = useState<string>('giveaways-platform', () => 'All');
    const searchQuery = useState<string>('giveaways-search', () => '');
    const sort = useState<string>('giveaways-sort', () => 'endingSoonest');

    const baseUrl = `${config.public.apiBase}/api`;

    const fetchGiveaways = async (refresh = false) => {
        if (isLoading.value || (!hasMore.value && !refresh)) return;

        isLoading.value = true;
        if (refresh) {
            offset.value = 0;
            hasMore.value = true;
        }

        try {
            const queryParams: any = {
                limit,
                offset: offset.value,
            };

            if (category.value !== 'All') queryParams.category = category.value;
            if (platform.value !== 'All') queryParams.platform = platform.value;
            if (searchQuery.value) queryParams.search = searchQuery.value;
            queryParams.sort = sort.value;

            const response: any = await $fetch(`${baseUrl}/giveaways`, {
                query: queryParams,
            });

            const fetchedData = response.data || [];
            const fetchedCount = response.totalCount || 0;

            if (refresh) {
                giveaways.value = fetchedData;
            } else {
                giveaways.value.push(...fetchedData);
            }

            if (giveaways.value.length >= fetchedCount || fetchedData.length < limit) {
                hasMore.value = false;
            } else {
                offset.value += limit;
            }
        } catch (error) {
            console.error('Error fetching giveaways:', error);
        } finally {
            isLoading.value = false;
        }
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
        hasMore,
        category,
        platform,
        searchQuery,
        sort,
        fetchGiveaways,
        submitGiveaway,
    };
};
