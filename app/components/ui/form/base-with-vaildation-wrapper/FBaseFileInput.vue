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
 * Validation wrapper for BaseFileInput
 * - Forwards all non-validation props/attrs (label, placeholder, buttonLabel, multiple, size, variant, disabled, required…)
 * - Uses the native <input type="file"> inside BaseFileInput as `nativeEl` for focus/blur + native required validity
 * - Validates on change; also validates on blur via a passive DOM listener
 */

import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useAttrs
} from 'vue'
import BaseFileInput from '@/components/ui/form/base/BaseFileInput.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'
import type { ElExpsoe } from '~/components/ui/form/base/BaseFileInput.vue'

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
    nativeMessages: true, // file inputs support nice native messages for required
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: File[]): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/** Pass-through everything else (label, placeholder, buttonLabel, multiple, size, variant, disabled, required…) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-file-${inst?.uid ?? '0'}`)

/** refs */
const inner = ref<ComponentPublicInstance<ElExpsoe> | null>(null)

/** v-model proxy */
const filesProxy = computed<File[]>({
  get: () => props.modelValue || [],
  set: (v) => emit('update:modelValue', [...(v || [])])
})

/** validation */
const field = useFormField(baseId.value, filesProxy as any, props.rules ?? [], {
  nativeEl: inner?.value?.inputEl, // Ref<HTMLInputElement | null>
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
function onUpdate(next: File[]) {
  emit('update:modelValue', next)
  field.onInputValidate()
}
</script>
