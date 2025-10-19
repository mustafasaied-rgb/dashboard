<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="baseId"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }} <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <div
      class="ds-input"
      :data-variant="variant"
      :data-status="effectiveStatus"
      :data-size="size"
      :data-disabled="disabled ? 'true' : 'false'"
      :data-has-start="hasStart ? 'true' : 'false'"
      :data-has-end="'true'"
    >
      <span v-if="hasStart" class="ds-adorn ds-adorn--start" :class="{ bordered: borderedStart }">
        <slot name="start" />
      </span>

      <flat-pickr
        :id="baseId"
        ref="pickerEl"
        v-model="modelProxy"
        :config="computedConfig"
        :disabled="disabled"
        :placeholder="placeholder"
        class="ds-control"
        :class="[hasStart ? 'ps-3' : 'ps-4', 'pe-3']"
        :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
        :aria-describedby="effectiveMessage ? describedById : undefined"
        @on-change="onChange"
        @on-close="onClose"
        @blur="onBlur"
      />

      <span class="ds-adorn ds-adorn--end" :class="{ bordered: borderedEnd }">
        <slot name="end"><clock-icon/></slot>
      </span>
    </div>

    <p
      v-if="effectiveMessage"
      :id="describedById"
      class="ds-helper"
      :class="{
        'ds-helper--error': effectiveStatus === 'error',
        'ds-helper--success': effectiveStatus === 'success',
        'ds-helper--default': effectiveStatus === 'default'
      }"
      aria-live="polite"
    >
      {{ effectiveMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots, getCurrentInstance, ref } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(defineProps<{
  name?: string
  modelValue?: string | Date | null
  id?: string
  label?: string
  placeholder?: string
  size?: Size
  status?: Status
  variant?: Variant
  message?: string
  disabled?: boolean
  required?: boolean
  borderedStart?: boolean
  borderedEnd?: boolean
  config?: Record<string, any>

  // validation
  rules?: Array<any>
  validateOn?: ValidateOn
  realtimeMs?: number
  showSuccess?: boolean
}>(), {
  modelValue: null,
  size: 'md',
  status: 'default',
  variant: 'outlined',
  borderedStart: false,
  borderedEnd: false,
  config: () => ({}),
  validateOn: ValidateOn.Submit,
  realtimeMs: 150,
  showSuccess: false
})

const slots = useSlots()
const hasStart = computed(() => !!slots.start)

const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-time'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)

const emit = defineEmits<{ (e:'update:modelValue', v:any): void }>()
const modelProxy = computed({
  get: () => props.modelValue as any,
  set: (v) => emit('update:modelValue', v)
})

const pickerEl = ref<InstanceType<typeof FlatPickr> | null>(null)

// register with form
const registryName = computed(() => props.name ?? baseId.value)
const field = useFormField(registryName.value, modelProxy as any, props.rules ?? [], {
  // focus this element when invalid
  nativeEl: pickerEl as unknown as any,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

const effectiveMessage = computed<string | null>(() => props.message ?? field.error.value ?? null)
const effectiveStatus = computed<Status>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

/** default time-only config */
const baseConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:i',
  time_24hr: true,
  allowInput: false
}
const computedConfig = computed(() => ({ ...baseConfig, ...props.config }))

function onChange() { field.onInputValidate() }
function onClose() { field.onBlurValidate() }
function onBlur()  { field.onBlurValidate() }

</script>

<script lang="ts">
export default { components: { FlatPickr } }
</script>
