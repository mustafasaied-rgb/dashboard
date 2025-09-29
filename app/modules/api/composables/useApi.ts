import type { ApiFetch } from '~/modules/api/plugins/api-fetch'

type CacheValue = { v: unknown; t: number }

export function useApi() {
  const apiFetch = useNuxtApp().$apiFetch as ApiFetch
  
  // client-only, per-tab cache with Nuxt state (survives within the SPA session)
  const cache = import.meta.client
    ? useState<Map<string, CacheValue>>('api-cache', () => new Map())
    : null

  function makeKey(url: string, query: any, token: string | null, locale: string) {
    return JSON.stringify({ url, query, token, locale })
  }

  async function cachedGet<T>(url: string, query?: any, ttlMs = 5_000): Promise<T> {
    const token = useCookie<string | null>('redirect_token').value || null
    const locale = useNuxtApp().$i18n?.locale?.value || 'en'
    const key = makeKey(url, query, token, locale)
    const now = Date.now()

    if (import.meta.client && cache!.value.has(key)) {
      const hit = cache!.value.get(key)!
      if (now - hit.t < ttlMs) return hit.v as T
      cache!.value.delete(key)
    }

    const v = await apiFetch<T>(url, { query })
    if (import.meta.client) cache!.value.set(key, { v, t: now })
    return v
  }

  // optional helpers
  function invalidate(url: string, query?: any) {
    if (!import.meta.client) return
    const token = useCookie<string | null>('redirect_token').value || null
    const locale = useNuxtApp().$i18n?.locale?.value || 'en'
    const key = makeKey(url, query, token, locale)
    cache!.value.delete(key)
  }

  function clearAll() {
    if (import.meta.client) cache!.value.clear()
  }

  return { apiFetch, cachedGet, invalidate, clearAll }
}
