import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://nagradne-igre-tracker.com'
  const backendUrl = `${config.apiBase}/api`

  try {
    const giveaways: any = await $fetch(`${backendUrl}/giveaways?limit=25`)

    const rssItems = giveaways.map((g: any) => `
  <item>
    <title><![CDATA[${g.title}]]></title>
    <link>${baseUrl}/giveaways/${g.id}</link>
    <guid isPermaLink="true">${baseUrl}/giveaways/${g.id}</guid>
    <pubDate>${new Date(g.createdAt).toUTCString()}</pubDate>
    <description><![CDATA[${g.description || ''}]]></description>
    <category>${g.category}</category>
  </item>`).join('')

    const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Balkan Nagradne Igre Tracker</title>
  <link>${baseUrl}/</link>
  <description>Najnovije nagradne igre na Balkanu (Srbija, Hrvatska, BIH)</description>
  <language>sr-rs</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
  ${rssItems}
</channel>
</rss>`

    setHeader(event, 'Content-Type', 'application/xml')
    return rssContent
  } catch (error) {
    console.error('RSS error:', error)
    return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Balkan Nagradne Igre Tracker</title></channel></rss>`
  }
})
