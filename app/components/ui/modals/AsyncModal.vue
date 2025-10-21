<template>
  <BaseModal
    v-model="isOpen"
    :rounded="true"
    :hideDefaultClose="true"
    :size="options.size ?? 'sm'"
    :fullScreenBackdrop="true"
    :closeOnBackdrop="options.closeOnBackdrop ?? true"
    :closeOnEsc="options.closeOnEsc ?? true"
    @close="onClose"
  >
    <template #body>
      <div class="text-center">
        <!-- Optional status blob -->
        <div v-if="iconConfig" class="relative z-1 mb-7 flex items-center justify-center">
          <svg :class="iconConfig.blobClass" width="90" height="90" viewBox="0 0 90 90" fill="none">
            <path
              d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
            />
          </svg>
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <component :is="iconConfig.icon" />
          </span>
        </div>

        <!-- Title -->
        <h4
          v-if="options.title"
          class="sm:text-title-sm mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90"
        >
          {{ options.title }}
        </h4>

        <!-- Message -->
        <p v-if="options.message" class="text-sm leading-6 text-gray-500 dark:text-gray-400">
          {{ options.message }}
        </p>

        <!-- Actions -->
        <div class="mt-7 flex w-full items-center justify-center gap-3">
          <Button v-if="options.showCancel" variant="outline" color="gray" @click="onCancel">
            {{ options.cancelText ?? 'Cancel' }}
          </Button>

          <Button variant="solid" :color="confirmColor" @click="onConfirm">
            {{ options.confirmText ?? 'Confirm' }}
          </Button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

type AsyncVariant = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

interface AsyncModalOptions {
  title?: string
  message?: string
  variant?: AsyncVariant
  size?: 'sm' | 'md' | 'lg'
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
}

interface AsyncResult {
  action: 'confirm' | 'cancel' | 'close'
}

const isOpen = ref(false)
const options = ref<AsyncModalOptions>({})
let _resolve: ((result: AsyncResult) => void) | null = null

/** Open programmatically and await result */
function open(newOptions: AsyncModalOptions = {}): Promise<AsyncResult> {
  options.value = { variant: 'neutral', showCancel: true, ...newOptions }
  isOpen.value = true
  return new Promise((resolve) => (_resolve = resolve))
}

/** Actions */
function resolveAndClose(action: AsyncResult['action']) {
  isOpen.value = false
  _resolve?.({ action })
  _resolve = null
}
function onConfirm() {
  resolveAndClose('confirm')
}
function onCancel() {
  resolveAndClose('cancel')
}
function onClose() {
  resolveAndClose('close')
}

/** Color + Icon by variant */
const confirmColor = computed(() => {
  switch (options.value.variant) {
    case 'success':
      return 'success'
    case 'info':
      return 'info'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'error'
    default:
      return 'primary'
  }
})

const iconConfig = computed(() => {
  switch (options.value.variant) {
    case 'success':
      return { blobClass: 'fill-success-50 dark:fill-success-500/15', icon: SuccessIcon }
    case 'info':
      return { blobClass: 'fill-blue-light-50 dark:fill-blue-light-500/15', icon: InfoIcon }
    case 'warning':
      return { blobClass: 'fill-warning-50 dark:fill-warning-500/15', icon: WarningIcon }
    case 'danger':
      return { blobClass: 'fill-error-50 dark:fill-error-500/15', icon: DangerIcon }
    default:
      return null
  }
})

defineExpose({ open })
</script>

<!-- inline icons -->
<script lang="ts">
import { defineComponent, h } from 'vue'
export const SuccessIcon = defineComponent({
  setup: () => () =>
    h(
      'svg',
      {
        class: 'fill-success-600 dark:fill-success-500',
        width: 38,
        height: 38,
        viewBox: '0 0 38 38'
      },
      [
        h('path', {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004Z'
        })
      ]
    )
})
export const InfoIcon = defineComponent({
  setup: () => () =>
    h(
      'svg',
      {
        class: 'fill-blue-light-600 dark:fill-blue-light-500',
        width: 38,
        height: 38,
        viewBox: '0 0 24 24'
      },
      [
        h('path', {
          d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM10.75 10.5h2.5v7h-2.5v-7Z'
        })
      ]
    )
})
export const WarningIcon = defineComponent({
  setup: () => () =>
    h(
      'svg',
      {
        class: 'fill-warning-600 dark:fill-warning-500',
        width: 38,
        height: 38,
        viewBox: '0 0 24 24'
      },
      [
        h('path', {
          d: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z'
        })
      ]
    )
})
export const DangerIcon = defineComponent({
  setup: () => () =>
    h(
      'svg',
      { class: 'fill-error-600 dark:fill-error-500', width: 38, height: 38, viewBox: '0 0 24 24' },
      [
        h('path', {
          d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.54 5.46a1.25 1.25 0 0 1 0 1.77L13.77 11l1.77 1.77a1.25 1.25 0 0 1-1.77 1.77L12 12.77l-1.77 1.77a1.25 1.25 0 1 1-1.77-1.77L10.23 11 8.46 9.23a1.25 1.25 0 1 1 1.77-1.77L12 9.23l1.77-1.77a1.25 1.25 0 0 1 1.77 0Z'
        })
      ]
    )
})
</script>
