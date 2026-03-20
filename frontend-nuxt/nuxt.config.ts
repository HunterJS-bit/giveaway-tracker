// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/fonts',
    'nuxt-delay-hydration'
  ],
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
  future: {
    compatibilityVersion: 4,
  },
})
