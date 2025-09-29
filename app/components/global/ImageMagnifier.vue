<template>
  <div class="relative h-full w-full">
    <img
      ref="imgEl"
      :src="src"
      :alt="alt"
      :class="['object-contain', imgClass]"
      @load="onLoad"
      @pointerenter="show = true"
      @pointerleave="show = false"
      @pointermove="onMove"
      @pointerdown="show = true"
      @pointerup="show = false"
    />
    <div
      v-show="show && ready"
      class="pointer-events-none absolute rounded-full shadow-xl ring-2 ring-white/70"
      :style="lensStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    zoom?: number
    lensSize?: number
    imgClass?: string
  }>(),
  {
    zoom: 2.2,
    lensSize: 200
  }
)

const imgEl = ref<HTMLImageElement | null>(null)
const show = ref(false)
const ready = ref(false)

// Rendered size
const rW = ref(0)
const rH = ref(0)
// Natural size
const nW = ref(0)
const nH = ref(0)

const bgW = computed(() => nW.value * props.zoom)
const bgH = computed(() => nH.value * props.zoom)
const ratioX = computed(() => (rW.value ? bgW.value / rW.value : 1))
const ratioY = computed(() => (rH.value ? bgH.value / rH.value : 1))

const state = reactive({
  x: 0,
  y: 0,
  bgX: 0,
  bgY: 0
})

const lensStyle = computed(() => ({
  width: `${props.lensSize}px`,
  height: `${props.lensSize}px`,
  left: `${state.x - props.lensSize / 2}px`,
  top: `${state.y - props.lensSize / 2}px`,
  backgroundImage: `url(${props.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: `${bgW.value}px ${bgH.value}px`,
  backgroundPosition: `${state.bgX}px ${state.bgY}px`
}))

function onLoad() {
  const el = imgEl.value!
  // rendered dims (after modal/layout)
  rW.value = el.clientWidth
  rH.value = el.clientHeight
  // intrinsic dims
  nW.value = el.naturalWidth
  nH.value = el.naturalHeight
  ready.value = !!(rW.value && rH.value && nW.value && nH.value)
}

function onMove(e: PointerEvent) {
  const el = imgEl.value!
  const rect = el.getBoundingClientRect()
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  // clamp within the rendered image box
  x = Math.max(0, Math.min(rW.value, x))
  y = Math.max(0, Math.min(rH.value, y))
  state.x = x
  state.y = y
  // position the zoomed background so the cursor is centered
  state.bgX = -(x * ratioX.value - props.lensSize / 2)
  state.bgY = -(y * ratioY.value - props.lensSize / 2)
}
</script>
<!-- <ClickZoom
  img-class="w-full object-contain max-h-[90vh]"
  :src="selectedCertificate.image"
  :zoom="1.2"
  :lens-size="420"
/> -->
