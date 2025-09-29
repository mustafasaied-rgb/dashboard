<template>
  <div class="relative w-full" ref="containerRef">
    <!-- Scrollable Track -->
    <div
      ref="trackRef"
      :class="[
        'no-scrollbar flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth',
        trackClass
      ]"
      @scroll.passive="onScroll"
      :dir="isRTL ? 'rtl' : 'ltr'"
    >
      <slot />
    </div>

    <!-- Prev Button -->
    <button
      role="button"
      v-if="showPrev"
      @click="scrollBy(-1)"
      :disabled="atStart"
      aria-label="Previous slide"
      class="absolute start-0 top-1/2 z-10 hidden h-[60px] w-[60px] -translate-y-1/2 place-items-center rounded-full bg-white/70 p-2 shadow backdrop-blur-sm transition-colors hover:bg-white lg:grid xl:h-[80px] xl:w-[80px]"
    >
      <ArrowIcon aria-hidden="true" ltrLeft />
    </button>

    <!-- Next Button -->
    <button
      role="button"
      v-if="showNext"
      @click="scrollBy(1)"
      :disabled="atEnd"
      aria-label="Next slide"
      class="absolute end-0 top-1/2 z-10 hidden h-[60px] w-[60px] -translate-y-1/2 place-items-center rounded-full bg-white/70 p-2 shadow backdrop-blur-sm transition-colors hover:bg-white lg:grid xl:h-[80px] xl:w-[80px]"
    >
      <span v-if="isLoading" class="animate-spin">⟳</span>
      <span v-else>
        <ArrowIcon aria-hidden="true" ltrRight />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    loadMore?: (() => void | Promise<void>) | null
    isLoading?: boolean
    debounceTime?: number
    trackClass?: string
  }>(),
  {
    loadMore: null,
    isLoading: false,
    debounceTime: 100,
    trackClass: ''
  }
)

const trackRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const scrollTimeout = ref<number | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
const showPrev = ref(false)
const showNext = ref(false)

const { locale } = useI18n()
const isRTL = computed(() => locale.value === 'ar')

// Compute scroll amount (one-third of container)
const scrollAmount = (): number => (containerRef.value?.clientWidth ?? 0) / 3

// Scroll handler (debounced)
const onScroll = (): void => {
  if (scrollTimeout.value !== null) {
    window.clearTimeout(scrollTimeout.value)
  }
  scrollTimeout.value = window.setTimeout(checkEdges, props.debounceTime)
}

// Check whether we’re at start/end and if arrows should show
function checkEdges(): void {
  const el = trackRef.value
  if (!el) return

  const { scrollLeft, scrollWidth, clientWidth } = el
  const abs = Math.abs(scrollLeft)

  atStart.value = isRTL.value ? scrollLeft >= 0 : scrollLeft === 0
  atEnd.value = isRTL.value
    ? abs >= scrollWidth - clientWidth - 1
    : scrollLeft + clientWidth >= scrollWidth - 1

  // show arrows only if there's overflow
  showPrev.value = !atStart.value
  showNext.value = !atEnd.value

  // if reached end, trigger loadMore once
  if (!props.isLoading && atEnd.value && typeof props.loadMore === 'function') {
    props.loadMore()
  }
}

// Imperative scroll by pages
function scrollBy(direction = 1): void {
  const el = trackRef.value
  if (!el) return
  const delta = scrollAmount() * direction * (isRTL.value ? -1 : 1)
  el.scrollBy({ left: delta, behavior: 'smooth' })
}

// on mount, check initial state
onMounted(() => {
  nextTick(() => {
    checkEdges()
    // watch for resizing (optional)
    window.addEventListener('resize', checkEdges)
  })
})

// cleanup
onUnmounted(() => {
  window.removeEventListener('resize', checkEdges)
  if (scrollTimeout.value !== null) {
    window.clearTimeout(scrollTimeout.value)
  }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
