import type { SitemapUrlInput } from '#sitemap/types'

interface Giveaway {
  id: string
  createdAt?: string
  updatedAt?: string
}

interface Category {
  slug: string
}

// Keep each API request bounded; the loop below walks all pages so large feeds
// are still represented in the sitemap.
const PAGE_SIZE = 100
const MAX_PAGES = 1000

const toLastmod = (value?: string): string | undefined => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const fetchAllGiveaways = async (apiBase: string): Promise<Giveaway[]> => {
  const all: Giveaway[] = []

  for (let pageIndex = 0; pageIndex < MAX_PAGES; pageIndex += 1) {
    const response = await $fetch<{ data?: Giveaway[]; totalCount?: number }>(
      `${apiBase}/api/giveaways`,
      {
        query: {
          limit: PAGE_SIZE,
          offset: pageIndex * PAGE_SIZE,
        },
      },
    )

    const batch = Array.isArray(response?.data) ? response.data : []
    all.push(...batch)

    if (batch.length < PAGE_SIZE) break
    if (response?.totalCount && all.length >= response.totalCount) break
  }

  return all
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiBase = config.apiBase || config.public.apiBase || 'http://localhost:3000'

  try {
    const [giveaways, categories] = await Promise.all([
      fetchAllGiveaways(apiBase),
      $fetch<Category[]>(`${apiBase}/api/categories`),
    ])

    const urls: SitemapUrlInput[] = [
      { loc: '/expired', changefreq: 'daily', priority: 0.6 },
    ]

    for (const giveaway of giveaways) {
      if (!giveaway?.id) continue
      urls.push({
        loc: `/giveaways/${giveaway.id}`,
        lastmod: toLastmod(giveaway.updatedAt || giveaway.createdAt),
        changefreq: 'weekly',
        priority: 0.8,
      })
    }

    if (Array.isArray(categories)) {
      for (const category of categories) {
        if (!category?.slug) continue
        urls.push({
          loc: `/category/${category.slug}`,
          changefreq: 'weekly',
          priority: 0.7,
        })
      }
    }

    return urls
  } catch (error) {
    console.error('Error generating sitemap URLs', error)
    // Keep the module source alive even if the API is briefly unavailable.
    return [{ loc: '/expired', changefreq: 'daily', priority: 0.6 }]
  }
})
