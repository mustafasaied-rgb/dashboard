<template>
  <BaseCombobox
    ref=" "
    :id="baseId"
    :modelValue="modelProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
  />
</template>

<script setup lang="ts">

import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import BaseCombobox from '@/components/ui/form/base/BaseCombobox.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'
 
type Status = 'default' | 'success' | 'error'
/** Match BaseCombobox’s flexibility: single or multiple; value or option objects */
type Value = string | number | Record<string, any>
type ComboModel =
  | Value
  | { label: string; value: Value }
  | Array<Value | { label: string; value: Value }>

const props = withDefaults(
  defineProps<{
    /** v-model */
    modelValue?: ComboModel

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
  }>(),
  {
    status: 'default',
    message: '',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: ComboModel): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/** Pass everything else (options, label, placeholder, size, variant, disabled, required, returnObject, mode…) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** Stable id for registry + a11y */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-combobox-${inst?.uid ?? '0'}`)

/** Refs */
const inner = ref<InstanceType<typeof BaseCombobox> | null>(null)
/** v-model proxy */
const modelProxy = computed<ComboModel>({
  get: () => (props.modelValue ?? ([] as any)) as ComboModel,
  set: (v) => emit('update:modelValue', v as ComboModel)
})

/** Validation */
const field = useFormField(baseId.value, modelProxy as any, props.rules ?? [], {
  nativeEl: inner?.value?.triggerEl as any, // Ref<HTMLInputElement | null>
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

/** Derived visuals passed back to BaseCombobox */
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

/** Events */
function onUpdate(v: ComboModel) {
  emit('update:modelValue', v)
  field.onInputValidate()
}
</script>
