<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        :class="[
          'fixed inset-0 z-[1000] flex w-full justify-center bg-black/70',
          formMode ? 'items-end lg:items-center' : 'items-center'
        ]"
        @click.self="handleBackdropClose"
        tabindex="0"
      >
        <!-- Close button OUTSIDE the container -->
        <button
          v-if="showOutsideCloseBtn"
          class="absolute right-[50px] top-[50px] z-50 text-white transition hover:text-red-300 3xl:text-[28px]"
          @click="handleCancel"
        >
          ✕
        </button>
        <slot name="floating" />
        <!-- Modal container -->
        <component
          :is="formMode ? 'form' : 'div'"
          :class="[
            'styled-scrollbar mx-0 w-full transform transition-all',
            formMode
              ? 'h-[80vh] max-w-full rounded-3xl rounded-b-none bg-white lg:h-auto lg:max-w-lg lg:rounded-b-3xl'
              : 'max-w-lg bg-transparent',
            containerClass
          ]"
          @submit.prevent="handleSubmit"
          @keydown.esc="handleEsc"
        >
          <header
            v-if="$slots.header || title"
            :class="[
              'flex items-center justify-between border-gray-200 pt-[29px] dark:border-gray-700',
              headerClass
            ]"
          >
            <button
              type="button"
              @click="handleCancel"
              class="absolute end-[18px] top-[18px] hover:opacity-55 lg:end-5 lg:top-5"
            >
              <CloseIcon1 :size="gte('lg') ? 19 : 16" />
            </button>
            <slot name="header">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{{ title }}</h3>
            </slot>
          </header>

          <main :class="[bodyClass]">
            <slot />
          </main>

          <footer v-if="$slots.footer" :class="[footerClass]">
            <slot name="footer" />
          </footer>
        </component>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Classish } from '~/types/utils'

const props = withDefaults(
  defineProps<{
    open?: boolean
    formMode?: boolean
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
    canCloseByBackdrop?: boolean
    canCloseByEsc?: boolean
    showOutsideCloseBtn?: boolean
    title?: string
    containerClass?: Classish
    headerClass?: Classish
    bodyClass?: Classish
    footerClass?: Classish
  }>(),
  {
    open: false,
    formMode: false,
    canCloseByBackdrop: true,
    canCloseByEsc: true,
    showOutsideCloseBtn: true
  }
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
const open = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const { gte } = useBreakpoints()

useHead(() => ({
  bodyAttrs: {
    class: open.value ? 'overflow-hidden' : undefined
  }
}))
function close() {
  open.value = false
}

async function handleSubmit(e: SubmitEvent) {
  const form = e.currentTarget as HTMLFormElement | null
  if (props.formMode && form && !form.checkValidity()) {
    form.reportValidity?.()
    return
  }
  await props.onConfirm?.()
}

function handleCancel() {
  props.onCancel?.()
  close()
}

function handleBackdropClose() {
  if (props.canCloseByBackdrop) {
    handleCancel()
  }
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.canCloseByEsc) {
    handleCancel()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style></style>
