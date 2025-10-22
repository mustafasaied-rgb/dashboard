<template>
  <UiTextarea
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
 * Validation wrapper for BaseTextarea.
 * - Uses BaseTextarea's exposed textarea ref (inputEl) directly.
 * - Forwards all non-validation attrs/props.
 */

import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import UiTextarea from '~/modules/form-elements/components/UI-without-vaildation/UiTextarea.vue'
import type { ElExpose } from '~/modules/form-elements/components/UI-without-vaildation/UiTextarea.vue'
import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    id?: string
    status?: Status
    message?: string

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

/** pass-through (rows, placeholder, size, variant, label, required, disabled, readonly, resizable, aria-*) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-textarea-${inst?.uid ?? '0'}`)

/** access BaseTextarea's exposed textarea ref */
const inner = ref<ComponentPublicInstance<ElExpose> | null>(null)
const nativeEl = computed<HTMLTextAreaElement | null>(() => inner.value?.nativeEl ?? null)

/** v-model proxy */
const modelProxy = computed({
  get: () => props.modelValue,
  set: (v: any) => emit('update:modelValue', v)
})

/** validation */
const field = useFormField(baseId.value, modelProxy, props.rules ?? [], {
  nativeEl, // ✅ real textarea element
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

/** derive status/message */
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
function onUpdate(v: string) {
  emit('update:modelValue', v)
  field.onInputValidate()
}

function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate()
}

/** optional: expose focus helper */
defineExpose({
  focus: () => nativeEl.value?.focus(),
  getNativeEl: () => nativeEl.value
})
</script>
