// nuxt.d.ts
import type { ModuleOptions } from '@nuxtjs/tailwindcss'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    tailwindcss?: ModuleOptions
  }
}