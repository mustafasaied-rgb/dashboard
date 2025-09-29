<template>
  <section ref="sectionEl" class="relative h-screen w-screen overflow-hidden bg-[#0D1667]">
    <BaseImg
      format="webp"
      :src="sectionData?.image?.webp"
      :placeholder="sectionData?.image?.avif"
      class="h-full w-full flex-1 object-cover"
      :alt="`sky_parallax_1`"
      loading="lazy"
      fetchpriority="low"
    />
    <div
      ref="maskEl"
      class="clip-diagonal absolute inset-0 z-10 overflow-hidden will-change-transform"
    >
      <img
        ref="fgImg"
        :src="sky2"
        alt="sky2"
        loading="lazy"
        fetchpriority="low"
        class="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import sky2 from '~/assets/images/main/sky_parallax_2.png?url'
import type { PageSectionItem } from '~/services/pages-section.service'
defineProps<{ sectionData: PageSectionItem }>()

const sectionEl = ref<HTMLElement | null>(null)
const maskEl = ref<HTMLElement | null>(null)
const fgImg = ref<HTMLElement | null>(null)

let raf = 0
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

const update = () => {
  if (!sectionEl.value || !maskEl.value || !fgImg.value) {
    raf = 0
    return
  }

  const rect = sectionEl.value.getBoundingClientRect()
  const viewH = window.innerHeight
  const total = rect.height + viewH

  // 0..1 progress within this section
  const progress = clamp((viewH - rect.top) / total, 0, 1)

  const shift = -progress * sectionEl.value.clientWidth // mask moves LEFT

  // 1) move mask left
  maskEl.value.style.transform = `translate3d(${shift}px,0,0) translateZ(0)`
  // 2) move img right by the SAME amount (opposite sign)
  fgImg.value.style.transform = `translate3d(${-shift}px,0,0) translateZ(0)`

  raf = 0
}
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.clip-diagonal {
  --clip-path: 0 0, 58% 0, 100% 100%, 0% 100%;
  @media (min-width: 1024px) {
    --clip-path: 0 0, 61% 0, 95% 100%, 0% 100%;
  }
  @media (min-width: 1600px) {
    --clip-path: 0 0, 61% 0, 85% 100%, 0% 100%;
  }

  clip-path: polygon(var(--clip-path));
  -webkit-clip-path: polygon(var(--clip-path));
}
</style>
