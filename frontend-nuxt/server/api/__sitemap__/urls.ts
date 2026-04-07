export default defineEventHandler(async () => {
    try {
        const [giveaways, categories] = await Promise.all([
            $fetch<any[]>('http://localhost:3000/api/giveaways?limit=1000'),
            $fetch<any[]>('http://localhost:3000/api/categories')
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
