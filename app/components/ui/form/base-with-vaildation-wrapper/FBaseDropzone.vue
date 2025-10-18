<template>
  <BaseDropzone
    ref="inner"
    :id="baseId"
    :modelValue="filesProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
    @added="(f) => $emit('added', f)"
    @removed="(f) => $emit('removed', f)"
    @error="(f, err) => $emit('error', f, err)"
  />
</template>

<script setup lang="ts">
/**
 * Validation wrapper for BaseDropzone
 * - Forwards behavior/UX props: accept, multiple, maxFiles, showPreviews, etc.
 * - Validates on change & blur, and exposes focus() to highlight the region
 * - Focus target is the region with role="region" inside BaseDropzone
 */

import { computed, getCurrentInstance, onMounted, ref, shallowRef, useAttrs } from 'vue'
import BaseDropzone, { type PreviewFile } from '@/components/ui/form/base/BaseDropzone.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue: PreviewFile[]

    id?: string
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
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: PreviewFile[]): void
  (e: 'added', file: File): void
  (e: 'removed', file: File): void
  (e: 'error', file: File | null, err: unknown): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/** forward all non-validation props/attrs */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-dropzone-${inst?.uid ?? '0'}`)

/** refs */
const inner = ref<InstanceType<typeof BaseDropzone> | null>(null)
  
const nativeEl = ref<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null)
let hiddenFocusInput: HTMLInputElement | null = null
// replace your onMounted that looked for [role="region"] only:
onMounted(() => {
  const root = inner.value?.$el as HTMLElement | undefined
  const region = (root?.querySelector('[role="region"]') as HTMLElement | null) ?? null

  // 1) Try to use the actual file input if present (matches allowed types)
  const fileInput = (root?.querySelector('input[type="file"]') as HTMLInputElement | null) ?? null

  if (fileInput) {
    nativeEl.value = fileInput // ✅ satisfies useFormField’s nativeEl type
    return
  }

  // 2) Otherwise create a hidden surrogate input for focus/blur + a11y glue
  if (region) {
    hiddenFocusInput = document.createElement('input')
    hiddenFocusInput.type = 'text'
    hiddenFocusInput.tabIndex = -1
    hiddenFocusInput.ariaHidden = 'true'
    hiddenFocusInput.style.position = 'absolute'
    hiddenFocusInput.style.opacity = '0'
    hiddenFocusInput.style.width = '0'
    hiddenFocusInput.style.height = '0'
    hiddenFocusInput.style.pointerEvents = 'none'
    region.appendChild(hiddenFocusInput)
    nativeEl.value = hiddenFocusInput // ✅ correct element type
  } else {
    nativeEl.value = null
  }
})

/** model proxy */
const filesProxy = computed<PreviewFile[]>({
  get: () => props.modelValue || [],
  set: (v) => emit('update:modelValue', [...v])
})

/** validation */
const field = useFormField(baseId.value, filesProxy as any, props.rules ?? [], {
  nativeEl, // Ref<HTMLElement | null> — focus the region on invalid
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
function onUpdate(next: PreviewFile[]) {
  emit('update:modelValue', next)
  field.onInputValidate()
}

/** Optional expose for forms that want to call focus() on first invalid */
defineExpose({
  focus: () => nativeEl.value?.focus(),
  getNativeEl: () => nativeEl.value
})
</script>
