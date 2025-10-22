import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: true, // SSR is default, but be explicit
  compatibilityDate: '2024-05-07',
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL,
      SITE_URL: process.env.NUXT_PUBLIC_SITE_URL
    }
  },
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/videos/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/ar/**': { redirect: '/**' },
      '/en/**': { redirect: '/**' },
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    build: {
      cssCodeSplit: false
    },
    plugins: [tailwindcss()]
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    head: {
      meta: [
        {
          name: 'color-scheme',
          content: 'only light'
        },
        {
          name: 'theme-color',
          content: '#ffffff'
        }
      ]
    }
  },
  build: {
    transpile: ['@googlemaps/js-api-loader']
  },
  devtools: { enabled: true },
  //----------------------for modules----------------------
  modules: [
    '~/modules/api',
    '~/modules/form-elements',
    '@nuxt/image',
    'nuxt-svgo',
    '@nuxtjs/i18n',
    'vue-sonner/nuxt'
  ],

  vueSonner: { css: true },
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.ts', name: 'English' },
      { code: 'ar', iso: 'ar-SA', file: 'ar.ts', name: 'العربية', dir: 'rtl' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    restructureDir: 'app',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false
    }
  },
  svgo: {
    autoImportPath: './assets/icons/', // Path to your SVG folder
    componentPrefix: 'Svgo', // Matches our component name
    dts: true // Enable TypeScript support
  },
  //----------------------for auto imports----------------------
  imports: {
    autoImport: true,
    dirs: ['services']
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false, // Important for section imports
      extensions: ['.vue']
    }
  ],
  pages: {
    pattern: ['**/*.vue', '!**/_*']
  },

  //----------------------others----------------------
  experimental: {
    // inlineSSRStyles: true, // inline critical CSS from SSR → removes render-blocking for above-the-fold
    componentIslands: true // keep your setting
  },

  typescript: {
    shim: false,
    typeCheck: false, // Disable if you don't need runtime type checking
    tsConfig: {
      compilerOptions: {
        // types: ['nuxt', 'vite/client']
        include: ['types/**/*.d.ts'],
        // you can also tuck vueCompilerOptions here if you prefer:
        vueCompilerOptions: { strictTemplates: true }
      }
    }
  }
})
