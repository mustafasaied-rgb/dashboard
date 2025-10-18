<template>
  <BaseDatePicker
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
 * Validation wrapper for BaseDatePicker
 * - Forwards all non-validation props/attrs: mode, config, placeholder, size, variant, disabled, borderedStart/End, slots…
 * - Computes status/message via useFormField
 * - Focus target is the underlying flatpickr <input>
 */

import { computed, getCurrentInstance, onMounted, ref, shallowRef, useAttrs } from 'vue'
import BaseDatePicker from '@/components/ui/form/base/BaseDatePicker.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: string | Date | null
    id?: string

    /** Optional overrides */
    status?: Status
    message?: string

    /** Validation */
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

/** Pass through every non-validation prop/attr to BaseDatePicker */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-date-${inst?.uid ?? '0'}`)

/** refs */
const inner = ref<InstanceType<typeof BaseDatePicker> | null>(null)
/** We’ll target the real flatpickr <input> inside BaseDatePicker */
type Native = HTMLInputElement
const nativeEl = shallowRef<Native | null>(null)

onMounted(() => {
  const root = inner.value?.$el as HTMLElement | undefined
  // flatpickr renders input.flatpickr-input
  nativeEl.value =
    (root?.querySelector('input.flatpickr-input') as Native | null) ??
    (root?.querySelector('input') as Native | null) ??
    null
})

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

/** Optional expose for "focus first invalid" */
defineExpose({
  focus: () => nativeEl.value?.focus(),
  getNativeEl: () => nativeEl.value
})
</script>
