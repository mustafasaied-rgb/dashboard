<template>
  <BaseSelect
    ref="inner"
    :id="baseId"
    :modelValue="modelProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
    @change="onChange"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, shallowRef, useAttrs } from 'vue'
import BaseSelect from '@/modules/form-elements/components/base/BaseSelect.vue'
import type { ElExpose } from '@/modules/form-elements/components/base/BaseSelect.vue'

import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'
type Status = 'default' | 'success' | 'error'
/** Use a DIFFERENT name and include object case to match BaseSelect */
type SelectValue = string | number | null | Record<string, any>

const props = withDefaults(
  defineProps<{
    modelValue?: SelectValue
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
    status: 'default',
    message: '',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: SelectValue): void
  (e: 'change', ev: Event): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `form-select-${inst?.uid ?? '0'}`)
const inner = ref<(InstanceType<typeof BaseSelect> & Partial<ElExpose>) | null>(null)

const placeholderPresent = computed<boolean>(() => Boolean((attrs as any)?.placeholder))

const modelProxy = computed<SelectValue>({
  get: () => (props.modelValue ?? (placeholderPresent.value ? '' : null)) as SelectValue,
  set: (v) => emit('update:modelValue', v as SelectValue)
})

const field = useFormField(baseId.value, modelProxy as any, props.rules ?? [], {
  nativeEl: computed(() => inner.value?.selectEl ?? null) as any,
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

function onUpdate(v: SelectValue) {
  emit('update:modelValue', v)
  field.onInputValidate()
}
function onChange(ev: Event) {
  emit('change', ev)
  field.onInputValidate()
}
function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate()
}

defineExpose({
  focus: () => inner.value?.selectEl?.focus(),
  getNativeEl: () => inner.value?.selectEl
})
</script>
