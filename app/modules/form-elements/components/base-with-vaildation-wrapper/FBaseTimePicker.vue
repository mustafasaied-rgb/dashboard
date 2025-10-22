<template>
  <BaseTimePicker
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
import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import BaseTimePicker from '@/modules/form-elements/components/base/BaseTimePicker.vue'
import type { ElExpose } from '@/modules/form-elements/components/base/BaseTimePicker.vue'
import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'

type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: string | Date | null
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
    modelValue: null,
    status: 'default',
    message: '',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: true,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | Date | null): void
}>()

/** forward everything else (label, placeholder, size, variant, disabled, required, bordered*, config, slots…) */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-time-${inst?.uid ?? '0'}`)

/** grab exposed native input from base */
const inner = ref<ComponentPublicInstance<ElExpose> | null>(null)
const nativeEl = computed<HTMLInputElement | null>(() => inner.value?.nativeEl?.value ?? null)

/** v-model proxy */
const modelProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v as any)
})

/** validation */
const field = useFormField(baseId.value, modelProxy as any, props.rules ?? [], {
  nativeEl, // ✅ actual HTMLInputElement
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

/** on change -> validate */
function onUpdate(v: any) {
  emit('update:modelValue', v)
  field.onInputValidate()
}

/** optional expose */
defineExpose({
  focus: () => nativeEl.value?.focus(),
  getNativeEl: () => nativeEl.value
})
</script>
