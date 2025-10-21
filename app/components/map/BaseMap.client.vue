<template>
  <div ref="mapContainer" class="h-full w-full"></div>
</template>

<script setup lang="ts">
import type {
  DirectionsRenderer,
  Map,
  Marker,
  PlacesService,
  PlaceSearchRequest,
  LatLngLike
} from '~/types/google-maps'

import standardStyle from '~/assets/maps-standard.json'

const props = withDefaults(
  defineProps<{
    center: LatLngLike
    zoom?: number
    markers?: LatLngLike[]
    type?: string
    airportPosition?: LatLngLike | null
  }>(),
  { zoom: 12, markers: () => [], type: '', airportPosition: null }
)

/* ---------------- Local refs & vars (typed) ---------------- */
const mapContainer = ref<HTMLDivElement | null>(null)
const mapInstance = ref<Map | null>(null)
const directionsRenderer = ref<DirectionsRenderer | null>(null)

let placesService: PlacesService | null = null
let markerRefs: Marker[] = []

const { $googleMapsLoader } = useNuxtApp()

/* ---------------- Helpers / options ---------------- */
function getMapOptions(centerArg?: LatLngLike, zoomArg?: number): google.maps.MapOptions {
  const g = (window as unknown as { google?: typeof google }).google
  return {
    center: (centerArg ?? props.center) as LatLngLike,
    zoom: (zoomArg ?? props.zoom) as number,
    mapTypeId: g?.maps?.MapTypeId?.HYBRID ?? google.maps.MapTypeId.HYBRID,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  }
}

/* ---------------- Mount / init ---------------- */
onMounted(async () => {
  try {
    const google = await $googleMapsLoader.load()
    // create map (assert container present)
    if (!mapContainer.value) throw new Error('mapContainer not found')

    const map = new google.maps.Map(mapContainer.value, getMapOptions())
    mapInstance.value = map

    directionsRenderer.value = new google.maps.DirectionsRenderer({ map })
    placesService = new google.maps.places.PlacesService(map)

    renderMarkers()
    applyMapAction(props.type)
  } catch (error) {
    // preserve existing behaviour
    // eslint-disable-next-line no-console
    console.error('Google Maps failed to load:', error)
  }
})

/* ---------------- Watchers ---------------- */
watch(
  () => props.type,
  (newVal) => {
    if (!mapInstance.value) return
    resetMapSettings()
    clearMap()

    if (newVal !== 'get-from-the-airport') {
      renderMarkers()
    }
    applyMapAction(newVal)
  }
)

watch(
  () => props.center,
  (newCenter) => {
    if (mapInstance.value) {
      mapInstance.value.setCenter(newCenter as LatLngLike)
    }
  }
)

/* ---------------- Markers rendering ---------------- */
function renderMarkers(): void {
  const g = (window as unknown as { google?: typeof google }).google
  if (!g || !mapInstance.value) return

  // clear old markers
  markerRefs.forEach((m) => {
    try {
      m.setMap(null)
    } catch {}
  })
  markerRefs = []

  markerRefs = (props.markers || []).map((markerData) => {
    const position = markerData as LatLngLike
    const marker = new g.maps.Marker({
      position,
      map: mapInstance.value as Map
    }) as Marker

    const infoWindow = new g.maps.InfoWindow({
      content: `
        <div>
          <a 
            href="https://www.google.com/maps?q=${position.lat},${position.lng}" 
            target="_blank"
            style="text-decoration: none; color: #4285F4; height:20px;"
          >
            View on Google Maps
          </a>
        </div>
      `
    })

    marker.addListener('click', () => {
      try {
        infoWindow.open(mapInstance.value as Map, marker as Marker)
      } catch {}
    })

    return marker
  })
}

/* ---------------- Clear / reset ---------------- */
function clearMap(): void {
  if (directionsRenderer.value) {
    try {
      directionsRenderer.value.set('directions', null)
    } catch {}
  }

  markerRefs.forEach((marker) => {
    try {
      marker.setMap(null)
    } catch {}
  })
  markerRefs = []
}

function resetMapSettings(): void {
  const g = (window as unknown as { google?: typeof google }).google
  if (!mapInstance.value) return
  const options = getMapOptions(props.center, props.zoom)
  try {
    mapInstance.value.setCenter(options.center as LatLngLike)
    mapInstance.value.setZoom(options.zoom as number)
    if (options.mapTypeId != null) mapInstance.value.setMapTypeId(options.mapTypeId)
  } catch {}

  if (directionsRenderer.value) {
    try {
      directionsRenderer.value.set('directions', null)
    } catch {}
  }

  markerRefs.forEach((marker) => {
    try {
      marker.setMap(null)
    } catch {}
  })
  markerRefs = []
}

/* ---------------- Actions & routing/directions ---------------- */
function applyMapAction(type?: string): void {
  const g = (window as unknown as { google?: typeof google }).google
  if (!mapInstance.value || !g) return

  switch (type) {
    case 'map':
      // intentionally left commented as original
      break

    case 'get-from-the-airport':
      if (!props.airportPosition) {
        findNearestAirport(props.center)
      } else {
        drawRouteFromAirport(props.airportPosition)
      }
      break

    case 'hotels-around':
      searchNearby('hotel')
      break

    case 'nearest-metro-station':
      multiSearchNearby(['metro', 'subway_station'])
      break

    default:
      try {
        mapInstance.value.setMapTypeId(g.maps.MapTypeId.ROADMAP)
      } catch {}
      break
  }
}

/* ---------------- Directions drawing ---------------- */
function drawRouteFromAirport(origin: LatLngLike): void {
  const g = (window as unknown as { google?: typeof google }).google
  if (!g || !mapInstance.value) return

  const directionsService = new g.maps.DirectionsService()

  directionsService.route(
    {
      origin: origin as LatLngLike,
      destination: props.center as LatLngLike,
      travelMode: g.maps.TravelMode.DRIVING
    },
    (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === g.maps.DirectionsStatus.OK) {
        if (directionsRenderer.value) {
          try {
            directionsRenderer.value.setOptions({
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#0F53FF',
                strokeWeight: 5,
                strokeOpacity: 0.7
              }
            })
            directionsRenderer.value.setDirections(result as google.maps.DirectionsResult)
          } catch {}
        }

        // fit map to route
        try {
          const bounds = new g.maps.LatLngBounds()
          result!?.routes?.[0]!.overview_path.forEach((point) => bounds.extend(point))
          mapInstance.value!.fitBounds(bounds)

          const leg = result!.routes[0]!.legs[0]

          const originMarker = new g.maps.Marker({
            position: leg?.start_location,
            map: mapInstance.value,
            icon: {
              path: g.maps.SymbolPath.CIRCLE,
              fillColor: 'white',
              fillOpacity: 1,
              scale: 6,
              strokeColor: '#A9AEB8',
              strokeWeight: 2
            }
          })

          const destinationMarker = new g.maps.Marker({
            position: leg?.end_location,
            map: mapInstance.value
          })

          markerRefs.push(originMarker as Marker, destinationMarker as Marker)
        } catch {}
      } else {
        // keep behaviour identical
        // eslint-disable-next-line no-console
        console.error('Failed to fetch directions', status)
      }
    }
  )
}

/* ---------------- Places / nearest airport ---------------- */
function findNearestAirport(center: LatLngLike): void {
  const g = (window as unknown as { google?: typeof google }).google
  if (!g || !placesService) return

  const request: google.maps.places.PlaceSearchRequest = {
    location: center as LatLngLike,
    radius: 50000,
    keyword: 'airport'
  }

  placesService.nearbySearch(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === g.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const nearestAirport = results[0]!?.geometry!.location
        drawRouteFromAirport(nearestAirport as LatLngLike)
      } else {
        // eslint-disable-next-line no-console
        console.error('No nearby airports found or request failed:', status)
      }
    }
  )
}

/* ---------------- Search nearby (hotels, metro, ...) ---------------- */
function searchNearby(keyword: string): void {
  const g = (window as unknown as { google?: typeof google }).google
  if (!g || !placesService) return

  // // Remove existing markers
  // markerRefs.forEach((m) => m.setMap(null))
  // markerRefs = []

  const request: PlaceSearchRequest = {
    location: props.center as LatLngLike,
    radius: 3000,
    keyword
  }

  placesService.nearbySearch(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      if (status === g.maps.places.PlacesServiceStatus.OK && results) {
        // map results to markers
        markerRefs = results.map((place) => {
          const marker = new g.maps.Marker({
            map: mapInstance.value as google.maps.Map,
            position: place?.geometry?.location,
            title: place.name,
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          })
          return marker as Marker
        })
      } else {
        // eslint-disable-next-line no-console
        console.error('Places search failed:', status)
      }
    }
  )
}
function multiSearchNearby(keywordOrKeywords: string | string[]): void {
  const keywords = Array.isArray(keywordOrKeywords) ? keywordOrKeywords : [keywordOrKeywords]
  keywords.forEach((kw) => {
    searchNearby(kw)
  })
}
/* ---------------- Cleanup ---------------- */
onBeforeUnmount(() => {
  if (directionsRenderer.value) {
    try {
      directionsRenderer.value.set('directions', null)
    } catch {}
  }

  markerRefs.forEach((m) => {
    try {
      m.setMap(null)
    } catch {}
  })
  markerRefs = []
})
</script>
