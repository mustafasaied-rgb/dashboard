<template>
  <!-- Trigger (stays in-place) -->
  <span ref="referenceEl" @click="!controlled && toggle()" class="inline-block" v-bind="$attrs">
    <slot name="trigger" :open="open" :toggle="toggle" :openFn="openFn" :close="close" />
  </span>

  <!-- Floating content (teleported to body so it's above everything) -->
  <Teleport :to="teleportTo">
    <transition name="fade-scale">
      <div
        v-show="open"
        ref="floatingEl"
        role="dialog"
        :style="floatingStyle"
        :data-placement="placement"
        :aria-hidden="open ? 'false' : 'true'"
        class="z-[99999] will-change-transform"
        @keydown.esc.stop.prevent="close"
      >
        <slot name="floating" :open="open" :close="close" :placement="placement" />
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    placement?:
      | 'bottom-start'
      | 'bottom-end'
      | 'top-start'
      | 'top-end'
      | 'right-start'
      | 'left-start'
    offset?: number
    matchWidth?: boolean
    strategy?: 'fixed' | 'absolute'
    teleportTo?: string
    closeOnClickOutside?: boolean
    controlled?: boolean
  }>(),
  {
    modelValue: false,
    placement: 'bottom-start',
    offset: 6,
    matchWidth: true,
    strategy: 'fixed',
    teleportTo: 'body',
    closeOnClickOutside: true,
    controlled: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = ref(!!props.modelValue)
watch(
  () => props.modelValue,
  (v) => (open.value = !!v)
)
watch(open, (v) => emit('update:modelValue', v))

const referenceEl = ref<HTMLElement | null>(null)
const floatingEl = ref<HTMLElement | null>(null)

let cleanupAutoUpdate: (() => void) | null = null

const floatingStyle = ref<Record<string, string>>({
  position: props.strategy,
  left: '0px',
  top: '0px',
  minWidth: '0px'
})

async function updatePosition() {
  if (!referenceEl.value || !floatingEl.value) return
  const { x, y, placement } = await computePosition(referenceEl.value, floatingEl.value, {
    placement: props.placement,
    strategy: props.strategy,
    middleware: [offset(props.offset), flip(), shift({ padding: 8 })]
  })
  floatingStyle.value = {
    position: props.strategy,
    left: `${x}px`,
    top: `${y}px`,
    zIndex: '99999',
    minWidth: props.matchWidth && referenceEl.value ? `${referenceEl.value.offsetWidth}px` : 'auto'
  }
  // store resolved placement for consumers if they care
  ;(wrapperPlacement as any).value = placement
}

const wrapperPlacement = ref(props.placement)

function openFn() {
  open.value = true
}
function close() {
  open.value = false
}
function toggle() {
  open.value = !open.value
}

function onDocPointerDown(e: MouseEvent | PointerEvent) {
  if (!props.closeOnClickOutside || !open.value) return
  const t = e.target as Node
  const r = referenceEl.value
  const f = floatingEl.value
  if (r && r.contains(t)) return
  if (f && f.contains(t)) return
  close()
}

watch(open, async (v) => {
  if (v) {
    await nextTick()
    if (referenceEl.value && floatingEl.value) {
      cleanupAutoUpdate = autoUpdate(referenceEl.value, floatingEl.value, updatePosition)
      updatePosition()
    }
    document.addEventListener('pointerdown', onDocPointerDown, { capture: true })
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
  } else {
    cleanup()
  }
})

function cleanup() {
  document.removeEventListener('pointerdown', onDocPointerDown, { capture: true } as any)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  if (cleanupAutoUpdate) {
    cleanupAutoUpdate()
    cleanupAutoUpdate = null
  }
}

onMounted(() => {
  if (open.value) updatePosition()
})
onBeforeUnmount(cleanup)
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
    transform 0.12s ease,
    opacity 0.12s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  transform: scale(0.98);
  opacity: 0;
}
</style>
