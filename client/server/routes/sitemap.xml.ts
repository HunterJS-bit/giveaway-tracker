import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://nagradne-igre-tracker.com'
  const backendUrl = `${config.apiBase}/api`

  try {
    const giveaways: any = await $fetch(`${backendUrl}/giveaways?limit=100`)

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/submit</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${giveaways.map((g: any) => `
  <url>
    <loc>${baseUrl}/giveaways/${g.id}</loc>
    <lastmod>${new Date(g.updatedAt || g.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml')
    return sitemapContent
  } catch (error) {
    console.error('Sitemap error:', error)
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${baseUrl}/</loc></url></urlset>`
  }
})
