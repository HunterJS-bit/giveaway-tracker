import { defineEventHandler, setHeader } from 'h3'

const RSS_ITEM_LIMIT = 25

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
}

const escapeXml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, char => XML_ESCAPES[char])

const formatPubDate = (value?: string): string => {
  if (!value) return new Date().toUTCString()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString()
}

interface RssGiveaway {
  id: string
  title: string
  description?: string
  category?: string
  createdAt?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const configuredBaseUrl = String(config.public.siteUrl || '').replace(/\/+$/, '')
  const baseUrl = /sslip\.io/i.test(configuredBaseUrl) || /^http:\/\/svenagradneigre\.rs/i.test(configuredBaseUrl)
    ? 'https://svenagradneigre.rs'
    : configuredBaseUrl || 'https://svenagradneigre.rs'
  const backendUrl = `${config.apiBase}/api`

  try {
    const response = await $fetch<{ data?: RssGiveaway[] }>(`${backendUrl}/giveaways`, {
      query: { limit: RSS_ITEM_LIMIT },
    })

    const giveaways = Array.isArray(response?.data)
      ? response.data.slice(0, RSS_ITEM_LIMIT)
      : []

    const rssItems = giveaways
      .filter(giveaway => giveaway?.id)
      .map((giveaway) => {
        const itemUrl = `${baseUrl}/giveaways/${escapeXml(giveaway.id)}`

        return `
    <item>
      <title>${escapeXml(giveaway.title)}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${escapeXml(formatPubDate(giveaway.createdAt))}</pubDate>
      <description>${escapeXml(giveaway.description || '')}</description>
      <category>${escapeXml(giveaway.category || '')}</category>
    </item>`
      })
      .join('')

    const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sve Nagradne Igre</title>
    <link>${escapeXml(baseUrl)}/</link>
    <description>Najnovije nagradne igre na Balkanu (Srbija, Hrvatska, BIH)</description>
    <language>sr-rs</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml" />${rssItems}
  </channel>
</rss>`

    setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
    return rssContent
  } catch (error) {
    console.error('RSS error:', error)
    setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>Sve Nagradne Igre</title><description>Najnovije nagradne igre na Balkanu (Srbija, Hrvatska, BIH)</description></channel></rss>`
  }
})
