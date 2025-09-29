<template>
  <div
    ref="wrap"
    class="relative inline-block select-none overflow-hidden"
    :style="wrapperStyle"
    @wheel.prevent="onWheel"
  >
    <img
      ref="imgEl"
      :src="src"
      :alt="alt"
      :draggable="false"
      :class="[
        'block h-full max-w-full',
        scale > 1 ? (panning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in',
        ,
        imgClass
      ]"
      :loading="loading"
      :style="imgBaseStyle"
      @load="onLoad"
      @pointerdown="onPointerDown"
      @pointermove.passive="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @dblclick="onDblClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type CSSProperties } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    maxScale?: number
    initialScale?: number
    tapZoom?: number
    wheelZoom?: boolean
    maxHeight?: string | number
    imgClass?: string
    loading?: string
  }>(),
  {
    maxScale: 5,
    initialScale: 1,
    tapZoom: 2.5,
    wheelZoom: true,
    maxHeight: '100%',
    loading: 'lazy'
  }
)

const wrap = ref<HTMLDivElement | null>(null)
const imgEl = ref<HTMLImageElement | null>(null)

const rW = ref(0)
const rH = ref(0)

const scale = ref(props.initialScale)
const tx = ref(0)
const ty = ref(0)
const panning = ref(false)

let transitioning = false

type Pt = { id: number; x: number; y: number }
const pointers = new Map<number, Pt>()

let startTx = 0,
  startTy = 0
let startX = 0,
  startY = 0

let pinchStartDist = 0
let pinchStartScale = 1
let pinchFocusX = 0
let pinchFocusY = 0

let movedDuringTap = false

let wrapRectLeft = 0
let wrapRectTop = 0

let rafId = 0
function requestRender() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    renderNow()
  })
}
function renderNow() {
  const el = imgEl.value
  if (!el) return
  el.style.transform = `translate3d(${tx.value}px, ${ty.value}px, 0) scale(${scale.value})`
}

/** ✅ Typed as CSSProperties to satisfy Vue's StyleValue */
const wrapperStyle = computed<CSSProperties>(() => ({
  maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
  touchAction: 'none'
}))

/** ✅ Typed as CSSProperties (fixes the userSelect typing error) */
const imgBaseStyle = computed<CSSProperties>(() => ({
  transformOrigin: '0 0',
  willChange: 'transform',
  userSelect: 'none',
  transition: transitioning ? 'transform 200ms ease-out' : 'none'
}))

function updateWrapRect() {
  const el = wrap.value
  if (!el) return
  const r = el.getBoundingClientRect()
  wrapRectLeft = r.left
  wrapRectTop = r.top
}

function measureRenderedSize() {
  const el = imgEl.value
  if (!el) return
  rW.value = el.clientWidth
  rH.value = el.clientHeight
  clampTranslate()
  requestRender()
}

function imgPointFromClient(clientX: number, clientY: number) {
  return { x: clientX - wrapRectLeft, y: clientY - wrapRectTop }
}

function clampTranslate() {
  if (scale.value <= 1) {
    tx.value = 0
    ty.value = 0
    return
  }
  const sw = rW.value * scale.value
  const sh = rH.value * scale.value
  const minTx = Math.min(0, rW.value - sw)
  const minTy = Math.min(0, rH.value - sh)
  tx.value = Math.max(minTx, Math.min(0, tx.value))
  ty.value = Math.max(minTy, Math.min(0, ty.value))
}

function setScaleAround(fx: number, fy: number, nextScale: number) {
  const sOld = scale.value
  const sNew = Math.max(1, Math.min(props.maxScale, nextScale))
  if (sNew === sOld) return
  const tPrimeX = fx - (fx - tx.value) * (sNew / sOld)
  const tPrimeY = fy - (fy - ty.value) * (sNew / sOld)
  scale.value = sNew
  tx.value = tPrimeX
  ty.value = tPrimeY
  clampTranslate()
  requestRender()
}

function onLoad() {
  updateWrapRect()
  measureRenderedSize()
  scale.value = props.initialScale
  tx.value = 0
  ty.value = 0
  requestRender()
}

function onPointerDown(e: PointerEvent) {
  if (!imgEl.value) return
  imgEl.value.setPointerCapture(e.pointerId)
  const { x, y } = imgPointFromClient(e.clientX, e.clientY)
  pointers.set(e.pointerId, { id: e.pointerId, x, y })
  movedDuringTap = false

  if (pointers.size === 1) {
    startX = x
    startY = y
    startTx = tx.value
    startTy = ty.value
    panning.value = scale.value > 1
  } else if (pointers.size === 2) {
    const [p1, p2] = Array.from(pointers.values()) as [Pt, Pt]
    pinchStartDist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
    pinchStartScale = scale.value
    const m = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
    pinchFocusX = m.x
    pinchFocusY = m.y
    panning.value = false
  }
}

function onPointerMove(e: PointerEvent) {
  if (!pointers.has(e.pointerId)) return
  const { x, y } = imgPointFromClient(e.clientX, e.clientY)
  const pt = pointers.get(e.pointerId)!
  if (Math.abs(x - pt.x) > 3 || Math.abs(y - pt.y) > 3) movedDuringTap = true
  pt.x = x
  pt.y = y

  if (pointers.size === 2) {
    const [p1, p2] = Array.from(pointers.values()) as [Pt, Pt]
    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
    const m = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
    pinchFocusX = m.x
    pinchFocusY = m.y
    const scaleTarget = pinchStartScale * (dist / pinchStartDist)
    setScaleAround(pinchFocusX, pinchFocusY, scaleTarget)
  } else if (pointers.size === 1 && panning.value) {
    tx.value = startTx + (x - startX)
    ty.value = startTy + (y - startY)
    clampTranslate()
    requestRender()
  }
}

function onPointerUp(e: PointerEvent) {
  if (imgEl.value && imgEl.value.hasPointerCapture(e.pointerId)) {
    try {
      imgEl.value.releasePointerCapture(e.pointerId)
    } catch {}
  }
  pointers.delete(e.pointerId)

  if (pointers.size === 0) {
    const tapped = !movedDuringTap
    if (tapped) {
      const { x, y } = imgPointFromClient(e.clientX, e.clientY)
      toggleZoomAt(x, y)
    }
    panning.value = false
  } else if (pointers.size === 1) {
    const [only] = Array.from(pointers.values()) as [Pt]
    startX = only.x
    startY = only.y
    startTx = tx.value
    startTy = ty.value
    panning.value = scale.value > 1
  }
}

function onDblClick(e: MouseEvent) {
  const { x, y } = imgPointFromClient(e.clientX, e.clientY)
  toggleZoomAt(x, y, true)
}

function toggleZoomAt(x: number, y: number, preferOut = false) {
  transitioning = true
  if (imgEl.value) imgEl.value.style.transition = 'transform 200ms ease-out'

  if (scale.value > 1 && (preferOut || scale.value >= props.tapZoom)) {
    scale.value = 1
    tx.value = 0
    ty.value = 0
  } else {
    setScaleAround(x, y, Math.min(props.maxScale, props.tapZoom))
  }
  clampTranslate()
  requestRender()

  window.setTimeout(() => {
    transitioning = false
    if (imgEl.value) imgEl.value.style.transition = 'none'
  }, 210)
}

function onWheel(e: WheelEvent) {
  if (!props.wheelZoom) return
  const { x, y } = imgPointFromClient(e.clientX, e.clientY)
  const factor = Math.exp(-e.deltaY * 0.0015)
  setScaleAround(x, y, scale.value * factor)
}

let ro: ResizeObserver | null = null
function observeResize() {
  ro = new ResizeObserver(() => {
    updateWrapRect()
    measureRenderedSize()
  })
  if (wrap.value) ro.observe(wrap.value)
  if (imgEl.value) ro.observe(imgEl.value)
}
onMounted(() => {
  updateWrapRect()
  measureRenderedSize()
  observeResize()
  window.addEventListener('scroll', updateWrapRect, { passive: true })
})
onBeforeUnmount(() => {
  if (ro) ro.disconnect()
  window.removeEventListener('scroll', updateWrapRect)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>
