<template>
  <BaseCombobox
    ref="inner"
    :id="baseId"
    :modelValue="modelProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @update:modelValue="onUpdate"
    @blur="onInnerBlur"
  />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import BaseCombobox from '@/components/ui/form/base/BaseCombobox.vue'
import type { ElExpose } from '@/components/ui/form/base/BaseCombobox.vue'

import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

const props = withDefaults(
  defineProps<{
    name?: string
    id?: string
    modelValue?: any
    message?: string
    rules?: Array<any>
    validateOn?: ValidateOn
    realtimeMs?: number
    showSuccess?: boolean
  }>(),
  {
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    showSuccess: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

// ids / registry
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-combobox'}-${inst?.uid ?? '0'}`)

// attrs passthrough (strip validation-controlled keys)
const attrs = useAttrs()
const BLOCKED = new Set([
  'id',
  'modelValue',
  'status',
  'message',
  'name',
  'rules',
  'validateOn',
  'realtimeMs',
  'showSuccess'
])
const passthroughAttrs = computed(() => {
  const out: Record<string, any> = {}
  for (const k in attrs) if (!BLOCKED.has(k)) out[k] = (attrs as any)[k]
  return out
})

 const inner = ref<(InstanceType<typeof BaseCombobox> & Partial<ElExpose>) | null>(null)

const modelProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

// pass nativeEl as a reactive getter; no event binding
const field = useFormField(
  computed(() => props.name ?? baseId.value).value,
  modelProxy as any,
  props.rules ?? [],
  {
    nativeEl: computed(() => inner.value?.triggerEl ?? null) as any,
    validateOn: props.validateOn,
    realtimeMs: props.realtimeMs
  }
)

type Status = 'default' | 'success' | 'error'
const effectiveMessage = computed<string | null>(() => props.message ?? field.error.value ?? null)
const effectiveStatus = computed<Status>(() => {
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

function onUpdate(v: any) {
  emit('update:modelValue', v)
  field.onInputValidate()
}
function onInnerBlur() {
  field.onBlurValidate()
}

// optional: expose focus programmatically for parents
defineExpose({
  focus: () => inner.value?.triggerEl?.focus(),
  triggerEl: computed(() => inner.value?.triggerEl ?? null)
})
</script>
