import { matchPattern } from '~/utils/route-patterns'

export default defineNuxtRouteMiddleware((to) => {
  // const forbiddenRoutes = [
  //   //
  //   // '/news',
  //   // '/about',
  //   // 'product-details/:slug'
  // ]
  // const { matched, pattern, groups } = matchPattern(to.path, forbiddenRoutes, { exact: false })

  // if (matched) {
  //   return navigateTo('/')
  // }
  
  // const nearbyRoutes = {
  //   ['/about']: ['/about-us']
  // }
  // const matchedRoute = Object.keys(nearbyRoutes).find((key) => nearbyRoutes[key].includes(to.path))

  // if (matchedRoute) {
  //   return navigateTo(matchedRoute)
  // }
})
