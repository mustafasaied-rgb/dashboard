<template>
  <BaseTextarea
    ref="inner"
    :id="baseId"
    :modelValue="modelValue"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
    @blur="onBlur"
    @focus="$emit('focus', $event)"
  />
</template>

<script setup lang="ts">
/**
 * Validation wrapper for BaseTextarea (no changes to BaseTextarea needed).
 * - Forwards all non-validation attrs/props to BaseTextarea.
 * - Adds validation via useFormField and computes status/message.
 */

import { computed, getCurrentInstance, onMounted, shallowRef, ref, useAttrs } from 'vue'
import BaseTextarea from '@/components/ui/form/base/BaseTextarea.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    /** v-model */
    modelValue?: string | null

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
    modelValue: '',
    status: 'default',
    message: '',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | null): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/** Pass EVERYTHING else straight to BaseTextarea (rows, placeholder, size, variant, label, required, disabled, readonly, resizable, aria-*, etc.) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** Stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-textarea-${inst?.uid ?? '0'}`)

/** DOM refs */
const inner = ref<InstanceType<typeof BaseTextarea> | null>(null)
type Native = HTMLTextAreaElement
const nativeEl = shallowRef<Native | null>(null)

onMounted(() => {
  const root = inner.value?.$el as HTMLElement | undefined
  const el = root?.querySelector('textarea') as Native | null
  nativeEl.value = el ?? null
})

/** v-model proxy */
const modelProxy = computed({
  get: () => props.modelValue,
  set: (v: any) => emit('update:modelValue', v)
})

/** Validation */
const field = useFormField(baseId.value, modelProxy, props.rules ?? [], {
  nativeEl, // Ref<HTMLTextAreaElement | null>
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

/** Derived message/status for BaseTextarea */
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
function onUpdate(v: string) {
  emit('update:modelValue', v)
  field.onInputValidate()
}

function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate()
}

/** (Optional) expose focus() for “focus first invalid” flows */
defineExpose({
  focus: () => nativeEl.value?.focus(),
  getNativeEl: () => nativeEl.value
})
</script>
