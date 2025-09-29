import { ref, onMounted, onUnmounted } from 'vue'
const ORDER = ['sm', 'md', 'lg', 'xl', '2xl'] as const
export type Breakpoint = (typeof ORDER)[number]

export interface UseBreakpoints {
  breakpoint: Ref<Breakpoint>
  gte: (name: Breakpoint) => boolean
  lte: (name: Breakpoint) => boolean
}
export default function useBreakpoints(): UseBreakpoints {
  const breakpoint = ref<Breakpoint>('sm')

  const update = () => {
    const w = window.innerWidth
    if (w >= 1536) {
      breakpoint.value = '2xl'
    } else if (w >= 1280) {
      breakpoint.value = 'xl'
    } else if (w >= 1024) {
      breakpoint.value = 'lg'
    } else if (w >= 768) {
      breakpoint.value = 'md'
    } else {
      breakpoint.value = 'sm'
    }
  }

  if (typeof window !== 'undefined') update()
  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))
  const idx = (name: Breakpoint) => ORDER.indexOf(name)
  function gte(name: Breakpoint) {
    return idx(breakpoint.value) >= idx(name)
  }
  function lte(name: Breakpoint) {
    return idx(breakpoint.value) <= idx(name)
  }

  return { breakpoint, gte, lte }
}
