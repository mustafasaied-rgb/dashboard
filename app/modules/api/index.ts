import { defineNuxtModule, createResolver, addImportsDir, addPlugin, resolveFiles } from '@nuxt/kit'
export interface ApiModuleOptions {
  baseURL?: string
  retry?: number
  timeout?: number
  tokenCookie?: string
  autoImportComponents?: boolean
  autoImportComposables?: boolean
  autoImportServices?: boolean
}
export default defineNuxtModule<ApiModuleOptions>({
  meta: {
    name: 'api-module',
    configKey: 'api'
  },
  defaults: {
    baseURL: process.env.BASE_URL,
    retry: 1,
    timeout: 30_000,
    tokenCookie: 'redirect_token',
    autoImportComponents: true,
    autoImportComposables: true,
    autoImportServices: true
  },
  async setup(options, nuxt) {
    
    // expose options to runtime plugin
    nuxt.options.runtimeConfig.public.api = {
      ...(nuxt.options.runtimeConfig.public.api || {}),
      baseURL: options.baseURL,
      retry: options.retry,
      timeout: options.timeout,
      tokenCookie: options.tokenCookie
    }

    const { resolve } = createResolver(import.meta.url)

    if (options.autoImportComponents) addImportsDir(resolve('./components'))
    if (options.autoImportComposables) addImportsDir(resolve('./composables'))
    if (options.autoImportServices) addImportsDir(resolve('./services'))

    // wait until all modules finished registering -- including third-party
    nuxt.hook('modules:done', async () => {
      const pluginDir = resolve('./plugins')
      const plugins = await resolveFiles(pluginDir, '**/*.{ts,js}')
      // add each plugin using Nuxt helper
      for (const pluginPath of plugins) {
        addPlugin(pluginPath)
      }
    })
  }
})
