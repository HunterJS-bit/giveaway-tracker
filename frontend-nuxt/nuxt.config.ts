// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Nagradne Igre Tracker',
      titleTemplate: '%s | Nagradne Igre Tracker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Najveća baza aktivnih nagradnih igara na Balkanu.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Nagradne Igre Tracker' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/fonts',
    'nuxt-delay-hydration',
    '@nuxtjs/sitemap'
  ],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://balkangiveawaytracker.com',
    name: 'Nagradne Igre Tracker'
  },
  sitemap: {
    sources: [
      '/api/__sitemap__/urls'
    ]
  },
  fonts: {
    families: [
      { name: 'Outfit', provider: 'google' },
      { name: 'Inter', provider: 'google' }
    ]
  },
  delayHydration: {
    mode: 'init' // Delays hydration until interaction to maximize Lighthouse score
  },
  colorMode: {
    classSuffix: ''
  },
  routeRules: {
    '/': { swr: 3600 },
    '/api/**': { swr: 600 }
  },
  nitro: {
    compressPublicAssets: true
  },
  experimental: {
    viewTransition: true
  },
  future: {
    compatibilityVersion: 4,
  },
})
