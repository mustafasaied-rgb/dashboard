<template>
  <BaseTimePicker
    ref="inner"
    :id="baseId"
    :modelValue="modelProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
  />
</template>

<script setup lang="ts">
/**
 * Validation wrapper for BaseTimePicker
 * - Forwards all non-validation props/attrs (config, placeholder, size, variant, disabled, borderedStart/End, slots…)
 * - Finds the underlying flatpickr <input> and uses it as nativeEl for focus/blur
 * - Validates on value change and blur (via passive DOM listener)
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, shallowRef, useAttrs } from 'vue'
import BaseTimePicker from '@/components/ui/form/base/BaseTimePicker.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: string | Date | null
    id?: string

    // Optional overrides
    status?: Status
    message?: string

    // Validation
    rules?: Array<any>
    validateOn?: ValidateOn
    realtimeMs?: number
    nativeMessages?: boolean
    showSuccess?: boolean
  }>(),
  {
    modelValue: null,
    status: 'default',
    message: '',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | Date | null): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/** pass-through everything else (config, placeholder, size, variant, disabled, required, borderedStart/End, slots…) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-time-${inst?.uid ?? '0'}`)

/** refs */
const inner = ref<InstanceType<typeof BaseTimePicker> | null>(null)
const nativeEl = shallowRef<HTMLInputElement | null>(null)

function resolveFlatpickrInput() {
  const root = inner.value?.$el as HTMLElement | undefined
  // flatpickr renders input.flatpickr-input
  nativeEl.value =
    (root?.querySelector('input.flatpickr-input') as HTMLInputElement | null) ??
    (root?.querySelector('input') as HTMLInputElement | null) ??
    null
}

let blurHandler: ((e: FocusEvent) => void) | null = null
function attachBlur() {
  detachBlur()
  const el = nativeEl.value
  if (!el) return
  blurHandler = (e: FocusEvent) => {
    emit('blur', e)
    field.onBlurValidate()
  }
  el.addEventListener('blur', blurHandler, true)
}
function detachBlur() {
  const el = nativeEl.value
  if (el && blurHandler) el.removeEventListener('blur', blurHandler, true)
  blurHandler = null
}

onMounted(() => {
  resolveFlatpickrInput()
  attachBlur()
})
onBeforeUnmount(() => detachBlur())

/** v-model proxy */
const modelProxy = computed<string | Date | null>({
  get: () => props.modelValue ?? null,
  set: (v) => emit('update:modelValue', v)
})

/** validation */
const field = useFormField(baseId.value, modelProxy as any, props.rules ?? [], {
  nativeEl, // Ref<HTMLInputElement | null>
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

const effectiveMessage = computed<string | null>(() => {
  if (props.message) return props.message
  return field.error.value ?? null
})
const effectiveStatus = computed<Status>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

/** events */
function onUpdate(v: string | Date | null) {
  emit('update:modelValue', v)
  field.onInputValidate()
}

/** expose */
defineExpose({
  focus: () => nativeEl.value?.focus(),
  getNativeEl: () => nativeEl.value
})
</script>
