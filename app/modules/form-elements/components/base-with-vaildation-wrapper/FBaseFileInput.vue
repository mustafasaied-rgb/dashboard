<template>
  <BaseFileInput
    ref="inner"
    :id="baseId"
    :modelValue="filesProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
  />
</template>

<script setup lang="ts">
/**
 * Validation wrapper for BaseFileInput:
 * - Forwards all non-validation props/attrs (label, placeholder, buttonLabel, multiple, size, variant, disabled, required…)
 * - Uses the exposed inputEl (native <input type="file">) for focus/scroll + native messages
 * - Validates on change and on blur (handled by useFormField based on validateOn)
 */

import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import BaseFileInput from '@/modules/form-elements/components/base/BaseFileInput.vue'
import type { ElExpose } from '@/modules/form-elements/components/base/BaseFileInput.vue'
import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: File[]
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
    modelValue: () => [],
    status: 'default',
    message: '',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: true, // file inputs have good native validity messages
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: File[]): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/** Pass-through everything else to BaseFileInput */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-file-${inst?.uid ?? '0'}`)

/** ref to the base component (which exposes inputEl: Ref<HTMLInputElement|null>) */
const inner = ref<ComponentPublicInstance<ElExpose> | null>(null)

/** supply the ACTUAL element to the validator (ComputedRef<HTMLInputElement|null>) */
const nativeEl = computed<HTMLInputElement | null>(() => inner.value?.inputEl?.value ?? null)

/** v-model proxy */
const filesProxy = computed<File[]>({
  get: () => props.modelValue || [],
  set: (v) => emit('update:modelValue', [...(v || [])])
})

/** validation */
const field = useFormField(baseId.value, filesProxy as any, props.rules ?? [], {
  nativeEl, // ✅ correct shape for focusing/scrolling to invalid
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
function onUpdate(next: File[]) {
  emit('update:modelValue', next)
  field.onInputValidate()
}
</script>
