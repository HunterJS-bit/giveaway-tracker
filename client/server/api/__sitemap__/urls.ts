export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    try {
        const [giveaways, categories] = await Promise.all([
            $fetch<any[]>(`${config.apiBase}/api/giveaways?limit=1000`),
            $fetch<any[]>(`${config.apiBase}/api/categories`)
        ]);

        const urls: { loc: string, lastmod?: string }[] = [];

        if (Array.isArray(giveaways)) {
            giveaways.forEach((g) => {
                urls.push({
                    loc: `/giveaways/${g.id}`,
                    lastmod: g.createdAt || new Date().toISOString()
                });
            });
        }

        if (Array.isArray(categories)) {
            categories.forEach((c) => {
                urls.push({
                    loc: `/category/${c.slug}`
                });
            });
        }

        return urls;
    } catch (e) {
        console.error('Error generating sitemap URLs', e);
        return [];
    }
});
