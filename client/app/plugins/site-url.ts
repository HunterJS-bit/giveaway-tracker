const PRODUCTION_SITE_URL = 'https://svenagradneigre.rs'

/**
 * Canonical URLs must never point at a staging host or at plain HTTP.
 * SITE_URL can be injected at build *or* runtime (e.g. by Dokploy), so guard
 * the runtime config as well as the value baked into nuxt.config.ts.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const current = String(config.public.siteUrl || '').replace(/\/+$/, '')

  if (/sslip\.io/i.test(current) || /^http:\/\/svenagradneigre\.rs/i.test(current)) {
    config.public.siteUrl = PRODUCTION_SITE_URL
  }
})
