<template>
  <div class="relative" ref="root">
    <slot name="trigger" :open="isOpen" :toggle="toggle" :openFn="openFn" :closeFn="closeFn" />

    <transition name="fade" appear>
      <div
        v-show="isOpen"
        class="shadow-theme-lg dark:bg-gray-dark absolute z-[999] mt-[var(--dd-offset)] rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800"
        :class="[placeClass, panelClass, sameWidth ? 'w-full' : '']"
        :style="{ '--dd-offset': `${offset}px` }"
      >
        <slot :open="isOpen" :closeFn="closeFn" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open?: boolean
    placement?: 'bottom-start' | 'bottom-end' | 'bottom-center'
    sameWidth?: boolean
    offset?: number // vertical gap in px
    panelClass?: string // extra classes for panel
    closeOnClickOutside?: boolean
    closeOnEsc?: boolean
  }>(),
  {
    open: undefined,
    placement: 'bottom-end',
    sameWidth: false,
    offset: 12,
    panelClass: '',
    closeOnClickOutside: true,
    closeOnEsc: true
  }
)

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'open-change', v: boolean): void
}>()

const root = ref<HTMLElement | null>(null)
const internalOpen = ref(false)
const isControlled = computed(() => props.open !== undefined)
const isOpen = computed({
  get: () => (isControlled.value ? !!props.open : internalOpen.value),
  set: (v) => {
    if (isControlled.value) emit('update:open', v)
    else internalOpen.value = v
    emit('open-change', v)
  }
})

const openFn = () => (isOpen.value = true)
const closeFn = () => (isOpen.value = false)
const toggle = () => (isOpen.value = !isOpen.value)

const onDocClick = (e: MouseEvent) => {
  if (!props.closeOnClickOutside || !isOpen.value) return
  const el = root.value
  if (el && !el.contains(e.target as Node)) closeFn()
}

const onKey = (e: KeyboardEvent) => {
  if (!props.closeOnEsc || !isOpen.value) return
  if (e.key === 'Escape') closeFn()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

watch(
  () => props.open,
  (v) => {
    if (isControlled.value && typeof v === 'boolean') emit('open-change', v)
  }
)

const placeClass = computed(() => {
  switch (props.placement) {
    case 'bottom-start':
      return 'left-0'
    case 'bottom-center':
      return 'left-1/2 -translate-x-1/2'
    case 'bottom-end':
    default:
      return 'right-0'
  }
})
defineExpose({
  closeFn,
  openFn,
  toggle
})
</script>
<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
</style>
