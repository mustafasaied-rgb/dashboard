import type { ApiFetch } from '~/modules/api/plugins/api-fetch'

declare module '#app' {
  interface NuxtApp {
    $apiFetch: ApiFetch
    $googleMapsLoader: { load(): Promise<typeof google> }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $apiFetch: ApiFetch
    $googleMapsLoader: { load(): Promise<typeof google> }
  }
}

export {}
