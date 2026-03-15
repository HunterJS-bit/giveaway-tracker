export const useGiveaways = () => {
    const giveaways = useState<any[]>('giveaways', () => []);
    const isLoading = useState<boolean>('giveaways-loading', () => false);
    const hasMore = useState<boolean>('giveaways-has-more', () => true);
    const offset = useState<number>('giveaways-offset', () => 0);
    const limit = 12;

    // Change this to match your actual backend URL or use runtimeConfig
    const baseUrl = 'http://localhost:3000/api';

    const fetchGiveaways = async (refresh = false) => {
        if (isLoading.value || (!hasMore.value && !refresh)) return;

        isLoading.value = true;
        if (refresh) {
            offset.value = 0;
            hasMore.value = true;
        }

        try {
            const data: any = await $fetch(`${baseUrl}/giveaways`, {
                query: {
                    limit,
                    offset: offset.value,
                },
            });

            if (refresh) {
                giveaways.value = data;
            } else {
                giveaways.value.push(...data);
            }

            if (data.length < limit) {
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
        fetchGiveaways,
        submitGiveaway,
    };
};
