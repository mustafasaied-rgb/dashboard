<template>
  <div class="h-full w-full">
    <iframe
      v-if="type === 'get-from-the-airport' && !isNearestAirportLoading && embedUrl"
      :src="embedUrl"
      width="100%"
      height="100%"
      style="border: 0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>

    <BaseMap
      v-else
      :center="center"
      :zoom="zoom"
      :markers="markers"
      :type="type"
      :airport-position="airportPosition"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useNearestAirport } from '~/composables/useNearestAirport'
import type { LatLngLike } from '~/types/google-maps'
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

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

const {
  nearestAirport,
  findNearestAirport,
  isLoading: isNearestAirportLoading
} = useNearestAirport(props.center)

watch(
  () => props.type,
  async (val) => {
    if (val === 'get-from-the-airport' && !props.airportPosition) {
      await findNearestAirport()
    }
  },
  { immediate: true }
)

const embedUrl = computed(() => {
  if (props.type !== 'get-from-the-airport') return null

  const originCoords = props.airportPosition ?? nearestAirport.value
  if (!originCoords) return null

  const origin = `${originCoords.lat},${originCoords.lng}`
  const destination = `${props.center.lat},${props.center.lng}`

  return (
    `https://www.google.com/maps/embed/v1/directions` +
    `?key=${apiKey}` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    `&mode=driving` +
    `&maptype=satellite`
  )
})
</script>
