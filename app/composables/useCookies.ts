import { getCookie as h3Get, setCookie as h3Set } from 'h3'

export function useCookies() {
  const event = import.meta.server ? useRequestEvent() : null

  function getCookie(name: string): string | null {
    if (import.meta.server && event) return h3Get(event, name) ?? null
    if (import.meta.client) {
      const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'))
      return m ? decodeURIComponent(m[1] as string) : null
    }
    return null
  }

  function setCookie(name: string, value: string, days = 365) {
    if (import.meta.server && event) {
      h3Set(event, name, value, { path: '/', maxAge: days * 86400, sameSite: 'lax' })
    } else if (import.meta.client) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString()
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`
    }
  }

  return { getCookie, setCookie }
}
