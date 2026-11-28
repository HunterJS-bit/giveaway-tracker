const PRODUCTION_SITE_URL = 'https://svenagradneigre.rs'

const isUnsafeSiteUrl = (value: unknown): boolean => {
  const url = String(value || '')
  return /sslip\.io/i.test(url) || /^http:\/\/svenagradneigre\.rs/i.test(url)
}

const normalizeSiteUrl = (value: unknown): string => {
  const url = String(value || '').replace(/\/+$/, '')
  return isUnsafeSiteUrl(url) || !url ? PRODUCTION_SITE_URL : url
}

/**
 * Canonical URLs must never point at a staging host or at plain HTTP. SITE_URL
 * can be injected at build time *and* at runtime (Dokploy/GitHub vars), so the
 * value needs guarding in both places.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    const config = useRuntimeConfig(event)
    config.public.siteUrl = normalizeSiteUrl(config.public.siteUrl)

    const siteConfig = config['nuxt-site-config'] as { stack?: Array<{ url?: string }> } | undefined
    if (Array.isArray(siteConfig?.stack)) {
      for (const entry of siteConfig.stack) {
        if (entry?.url && isUnsafeSiteUrl(entry.url)) entry.url = PRODUCTION_SITE_URL
      }
    }
  })

  // nuxt-site-config applies runtime env (NUXT_PUBLIC_SITE_URL) with priority 0
  // after the request hook runs, so override it here before the sitemap builder
  // resolves canonical URLs.
  nitroApp.hooks.hook('site-config:init', ({ siteConfig }: { siteConfig: { get: () => { url?: string }; push: (entry: Record<string, unknown>) => void } }) => {
    if (isUnsafeSiteUrl(siteConfig.get().url)) {
      siteConfig.push({
        _context: 'canonical-guard',
        _priority: 1,
        url: PRODUCTION_SITE_URL,
      })
    }
  })
})
