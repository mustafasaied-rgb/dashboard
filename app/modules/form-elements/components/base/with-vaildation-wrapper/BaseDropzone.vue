<template>
  <UiDropzone
    ref="inner"
    :id="baseId"
    :modelValue="filesProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
/**
 * Validation wrapper for BaseDropzone (3rd pattern).
 * - Forwards all non-validation props/attrs.
 * - Uses BaseDropzone's exposed `regionEl` (focusable shell) as nativeEl for useFormField.
 */

import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import UiDropzone, {
  type ElExpose,
  // type UiDropzoneEmits
} from '~/modules/form-elements/components/UI-without-vaildation/UiDropzone.vue'
import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'

export interface PreviewFile {
  id: string
  src: string | null
  file?: File
  originalFile?: File
  progress?: number
  isProcessing?: boolean
  processingProgress?: number
  alt?: string
}

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: PreviewFile[]
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
    nativeMessages: false, // Dropzones aren't native inputs; keep false unless you polyfill
    showSuccess: false
  }
)

type UiDropzoneEmits = {
  (e: 'update:modelValue', v: PreviewFile[]): void
  (e: 'added', file: File): void
  (e: 'removed', file: File): void
  (e: 'error', file: File | null, err: unknown): void
  (e: 'blur', ev: FocusEvent): void
}
const emit = defineEmits<UiDropzoneEmits>()

/** pass-through everything else (accept, multiple, maxFiles, maxFilesizeMB, label, placeholder/message slot, variant, size, disabled, required, useNativePicker, showPreviews, etc.) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-dropzone-${inst?.uid ?? '0'}`)

/** base expose ref */
const inner = ref<ComponentPublicInstance<ElExpose> | null>(null)

/** ✅ provide the actual focusable element to the validator */
const nativeEl = computed<HTMLDivElement | any | null>(() => inner.value?.regionEl ?? null)

/** v-model proxy */
const filesProxy = computed<PreviewFile[]>({
  get: () => props.modelValue || [],
  set: (v) => emit('update:modelValue', [...(v || [])])
})

/** validation */
const field = useFormField(baseId.value, filesProxy as any, props.rules ?? [], {
  nativeEl, // focus/scroll to the dropzone shell
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
function onUpdate(next: PreviewFile[]) {
  emit('update:modelValue', next)
  field.onInputValidate()
}
function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate()
}

/** optional: expose focus helper for external forms */
defineExpose({
  focus: () => nativeEl.value?.focus(),
  getNativeEl: () => nativeEl.value
})
</script>
