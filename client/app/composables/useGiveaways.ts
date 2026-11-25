export const GIVEAWAYS_PAGE_SIZE = 9;

type FeedQuery = Record<string, string | string[] | null | undefined>;

export interface FeedQueryValues {
    page: number;
    category: string;
    platform: string;
    sort: string;
    searchQuery: string;
}

const readQueryValue = (value: FeedQuery[string]): string => {
    if (Array.isArray(value)) return value[0] ?? '';
    return value ?? '';
};

const parsePage = (value: string): number => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

/** Translate homepage query params into feed state. Search uses `q`. */
export const parseFeedQuery = (query: FeedQuery): FeedQueryValues => ({
    page: parsePage(readQueryValue(query.page)),
    category: readQueryValue(query.category) || 'All',
    platform: readQueryValue(query.platform) || 'All',
    sort: readQueryValue(query.sort),
    searchQuery: readQueryValue(query.q),
});

/** Build the canonical query object for the current feed state. */
export const buildFeedQuery = ({
    page,
    category,
    platform,
    sort,
    searchQuery,
}: FeedQueryValues): Record<string, string> => {
    const query: Record<string, string> = {};

    if (page > 1) query.page = String(page);
    if (category && category !== 'All') query.category = category;
    if (platform && platform !== 'All') query.platform = platform;
    if (sort) query.sort = sort;
    if (searchQuery) query.q = searchQuery;

    return query;
};

const isSameQuery = (current: FeedQuery, next: Record<string, string>): boolean => {
    const keys = new Set([...Object.keys(current), ...Object.keys(next)]);
    return [...keys].every(key => readQueryValue(current[key]) === (next[key] ?? ''));
};

export const useGiveaways = () => {
    const config = useRuntimeConfig();
    const route = useRoute();
    const router = useRouter();

    const initialQuery = parseFeedQuery(route.query);
    const giveaways = useState<any[]>('giveaways', () => []);
    const isLoading = useState<boolean>('giveaways-loading', () => false);
    const totalCount = useState<number>('giveaways-total', () => 0);
    const page = useState<number>('giveaways-page', () => initialQuery.page);

    const limit = GIVEAWAYS_PAGE_SIZE;

    // Filtering State
    const category = useState<string>('giveaways-category', () => initialQuery.category);
    const platform = useState<string>('giveaways-platform', () => initialQuery.platform);
    const searchQuery = useState<string>('giveaways-search', () => initialQuery.searchQuery);
    const sort = useState<string>('giveaways-sort', () => initialQuery.sort);

    const apiBase = config.public.apiBase || 'http://localhost:3000';
    const baseUrl = `${apiBase}/api`;

    const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / limit)));

    const feedQuery = computed(() => buildFeedQuery({
        page: page.value,
        category: category.value,
        platform: platform.value,
        sort: sort.value,
        searchQuery: searchQuery.value,
    }));

    /** Apply route query values to state. Returns true when anything changed. */
    const applyRouteQuery = (query: FeedQuery): boolean => {
        const next = parseFeedQuery(query);
        const changed = next.page !== page.value
            || next.category !== category.value
            || next.platform !== platform.value
            || next.sort !== sort.value
            || next.searchQuery !== searchQuery.value;

        if (changed) {
            page.value = next.page;
            category.value = next.category;
            platform.value = next.platform;
            sort.value = next.sort;
            searchQuery.value = next.searchQuery;
        }

        return changed;
    };

    /** Reflect the current feed state in the URL so filters/pages are shareable. */
    const syncRouteQuery = async (targetPage: number) => {
        if (import.meta.client && route.path === '/') {
            const nextQuery = buildFeedQuery({
                page: targetPage,
                category: category.value,
                platform: platform.value,
                sort: sort.value,
                searchQuery: searchQuery.value,
            });

            if (!isSameQuery(route.query, nextQuery)) {
                await router.replace({ path: '/', query: nextQuery });
            }
        }
    };

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
                sort: sort.value,
            };

            if (category.value !== 'All') queryParams.category = category.value;
            if (platform.value !== 'All') queryParams.platform = platform.value;
            if (searchQuery.value) queryParams.search = searchQuery.value;

            const response: any = await $fetch(`${baseUrl}/giveaways`, {
                query: queryParams,
            });

            giveaways.value = response.data || [];
            totalCount.value = response.totalCount || 0;
            page.value = nextPage;

            await syncRouteQuery(nextPage);
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
        feedQuery,
        applyRouteQuery,
        fetchGiveaways,
        goToPage,
        submitGiveaway,
    };
};
