<template>
  <UiDatePicker
    ref="inner"
    :id="baseId"
    :modelValue="modelValue"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
  />
</template>

<script setup lang="ts">
/**
 * Validation wrapper for BaseDatePicker.
 * - Forwards all non-validation attrs/props to BaseDatePicker.
 * - Uses BaseDatePicker's exposed `nativeEl` (HTMLInputElement) for focus/scroll + native messages.
 */

import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import UiDatePicker from '~/modules/form-elements/components/UI-without-vaildation/UiDatePicker.vue'
import type { ElExpose } from '~/modules/form-elements/components/UI-without-vaildation/UiDatePicker.vue'
import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(defineProps<{
  /** v-model */
  modelValue?: string | Date | null

  /** Optional overrides */
  id?: string
  status?: Status
  message?: string

  /** Validation */
  rules?: Array<any>
  validateOn?: ValidateOn
  realtimeMs?: number
  nativeMessages?: boolean
  showSuccess?: boolean
}>(), {
  modelValue: null,
  status: 'default',
  message: '',
  validateOn: ValidateOn.Submit,
  realtimeMs: 150,
  nativeMessages: true, // browser gives decent messages for required date inputs
  showSuccess: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | Date | null): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/** pass-through (label, placeholder, size, variant, disabled, required, borderedStart, borderedEnd, mode, config, slots…) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-date-${inst?.uid ?? '0'}`)

/** access BaseDatePicker's exposed native input */
const inner = ref<ComponentPublicInstance<ElExpose> | null>(null)
const nativeEl = computed<HTMLInputElement | null>(() => inner.value?.nativeEl?.value ?? null)

/** v-model proxy */
const modelProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v as any)
})

/** validation */
const field = useFormField(baseId.value, modelProxy as any, props.rules ?? [], {
  nativeEl,                  // ✅ true HTMLInputElement from flatpickr
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

/** derived status/message */
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
function onUpdate(v: any) {
  emit('update:modelValue', v)
  field.onInputValidate()
}
</script>
