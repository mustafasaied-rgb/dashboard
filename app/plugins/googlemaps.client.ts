 
import { Loader } from '@googlemaps/js-api-loader'

export default defineNuxtPlugin(() => {
  const loader = new Loader({
   apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    // version: 'weekly',
    libraries: ['places', 'drawing']
  })

  return {
    provide: {
      googleMapsLoader: loader,
    },
  }
})