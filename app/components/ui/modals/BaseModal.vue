<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto"
      role="dialog"
      :aria-modal="true"
      :aria-labelledby="labelId"
      @keydown="onKeydown"
    >
      <!-- Backdrop -->
      <div
        v-if="fullScreenBackdrop"
        class="fixed inset-0 z-[99999] h-full w-full bg-gray-900/80 backdrop-blur-[1px] dark:bg-white/10"
        aria-hidden="true"
        @click="onBackdrop"
      />

      <!-- Align wrapper -->
      <div
        class="relative z-[99999] flex w-fit"
        :class="{
          'items-start': align === 'top',
          'items-center': align === 'center'
        }"
      >
        <!-- Surface -->
        <div
          ref="surface"
          class="no-scrollbar relative mx-auto max-h-svh w-full overflow-y-auto bg-white text-[rgb(var(--foreground))] shadow-[--shadow-theme-lg] transition duration-200 ease-out dark:bg-gray-900 dark:text-[--color-gray-50]"
          :class="[sizeClass, rounded ? 'rounded-3xl' : '', padded ? 'p-4 sm:p-6' : '']"
          tabindex="-1"
        >
          <!-- Header (optional) -->
          <header v-if="$slots.header" class="mb-4">
            <slot name="header" :close="emitClose" />
          </header>

          <!-- Corner close (default) -->
          <button
            v-if="showDefaultClose"
            type="button"
            class="absolute end-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-[--color-gray-600] hover:bg-[--color-gray-100] focus-visible:shadow-[--shadow-focus-ring] focus-visible:outline-none dark:text-[--color-gray-300] dark:hover:bg-white/10"
            @click="emitClose"
            aria-label="Close"
          >
            <slot name="close-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" class="fill-current">
                <path
                  d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.41Z"
                />
              </svg>
            </slot>
          </button>

          <!-- Body -->
          <div>
            <slot name="body" />
          </div>

          <!-- Footer (optional) -->
          <footer v-if="$slots.footer" class="mt-6">
            <slot name="footer" :close="emitClose" />
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type Align = 'center' | 'top'

interface ModalProps {
  modelValue: boolean
  fullScreenBackdrop?: boolean
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  size?: ModalSize
  align?: Align
  rounded?: boolean
  padded?: boolean
  hideDefaultClose?: boolean
  labelledBy?: string
}

const props = withDefaults(defineProps<ModalProps>(), {
  fullScreenBackdrop: true,
  closeOnBackdrop: true,
  closeOnEsc: true,
  size: 'sm',
  align: 'center',
  rounded: true,
  padded: true,
  hideDefaultClose: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'open'): void
}>()

/* ARIA */
const labelId = computed(() => props.labelledBy || undefined)

/* Refs */
const surface = ref<HTMLDivElement | null>(null)
let lastFocused: Element | null = null

/* Sizes */
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm'
    case 'md':
      return 'max-w-lg'
    case 'lg':
      return 'max-w-2xl'
    case 'xl':
      return 'max-w-4xl'
    case 'full':
      return 'max-w-[min(92vw,1400px)]'
    default:
      return 'max-w-lg'
  }
})

const showDefaultClose = computed(() => !props.hideDefaultClose)

/* Open/close side effects (no focus trap / no animations) */
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      emit('open')
      lockScroll(true)
      lastFocused = document.activeElement
    } else {
      lockScroll(false)
      if (lastFocused instanceof HTMLElement) lastFocused.focus()
    }
  },
  { immediate: false }
)

onMounted(() => {
  if (props.modelValue) {
    lockScroll(true)
    lastFocused = document.activeElement
  }
})
onUnmounted(() => lockScroll(false))

/* Handlers */
function onBackdrop() {
  if (props.closeOnBackdrop) emitClose()
}
function onKeydown(e: KeyboardEvent) {
  if (props.closeOnEsc && e.key === 'Escape') emitClose()
}

function emitClose() {
  emit('update:modelValue', false)
  emit('close')
}

/* Utils */
function lockScroll(lock: boolean) {
  const root = document.documentElement
  lock ? root.classList.add('overflow-hidden') : root.classList.remove('overflow-hidden')
}
</script>
