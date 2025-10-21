import { ref, type Ref } from 'vue'
import { useNuxtApp } from '#imports'
import type { GLatLngLiteral, PlaceSearchRequest, LatLngLike } from '~/types/google-maps'

export interface UseNearestAirportReturn {
  nearestAirport: Ref<GLatLngLiteral | null>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  findNearestAirport: () => Promise<void>
}

export function useNearestAirport(initialCenter: LatLngLike): UseNearestAirportReturn {
  const nearestAirport = ref<GLatLngLiteral | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const { $googleMapsLoader } = useNuxtApp() as unknown as {
    $googleMapsLoader: { load(): Promise<typeof google> }
  }

  const toLiteral = (v: LatLngLike): GLatLngLiteral =>
    v instanceof google.maps.LatLng ? { lat: v.lat(), lng: v.lng() } : v

  const findNearestAirport = async (): Promise<void> => {
    if (nearestAirport.value || isLoading.value) return
    if (typeof window === 'undefined') return

    isLoading.value = true
    error.value = null

    try {
      const g = await $googleMapsLoader.load()
      const service = new g.maps.places.PlacesService(document.createElement('div'))

      const req: PlaceSearchRequest = {
        location: toLiteral(initialCenter),
        radius: 50_000, // if you switch to RankBy.DISTANCE, remove radius
        // rankBy: g.maps.places.RankBy.DISTANCE,
        type: 'airport'
      }

      await new Promise<void>((resolve, reject) => {
        service.nearbySearch(req, (results, status) => {
          const ok = status === g.maps.places.PlacesServiceStatus.OK
          const hasResults = Array.isArray(results) && results.length > 0
          if (ok && hasResults) {
            const first = results[0]!
            const loc = first.geometry?.location
            if (loc) {
              nearestAirport.value = { lat: loc.lat(), lng: loc.lng() }
              resolve()
              return
            }
          }
          reject(new Error(`No nearby airport found (status: ${status})`))
        })
      })
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      isLoading.value = false
    }
  }

  return { nearestAirport, findNearestAirport, isLoading, error }
}
