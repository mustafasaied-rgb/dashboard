<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="baseId"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }} <span v-if="required" aria-hidden="true" class="text-error-500">*</span>
    </label>

    <!-- Shell -->
    <div
      class="ds-input"
      :data-variant="variant"
      :data-size="size"
      :data-status="effectiveStatus"
      :data-disabled="disabled ? 'true' : 'false'"
    >
      <textarea
        ref="taEl"
        :id="baseId"
        v-bind="$attrs"
        :rows="rows"
        :value="modelProxy ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="Boolean(readonly)"
        :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
        :aria-describedby="effectiveMessage ? describedById : undefined"
        class="ds-control"
        :class="[resizable ? 'ds-control--textarea' : 'resize-none']"
        @input="onInput"
        @blur="onBlur"
        @focus="$emit('focus', $event)"
      />
    </div>

    <!-- Helper -->
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
import { computed, getCurrentInstance, ref } from 'vue'
import type { TextareaHTMLAttributes } from 'vue'
import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(defineProps<{
  name?: string
  id?: string
  modelValue?: string | null
  label?: string
  placeholder?: string
  rows?: number
  size?: Size
  status?: Status
  variant?: Variant
  message?: string
  disabled?: boolean
  readonly?: TextareaHTMLAttributes['readonly']
  required?: boolean
  resizable?: boolean

  // validation
  rules?: Array<any>
  validateOn?: ValidateOn
  realtimeMs?: number
  nativeMessages?: boolean
  showSuccess?: boolean
}>(), {
  rows: 6,
  size: 'md',
  status: 'default',
  variant: 'outlined',
  resizable: true,

  validateOn: ValidateOn.Submit,
  realtimeMs: 150,
  nativeMessages: false,
  showSuccess: false
})

const emit = defineEmits<{
  (e:'update:modelValue', v:string): void
  (e:'blur', ev: FocusEvent): void
  (e:'focus', ev: FocusEvent): void
}>()

// ids / a11y
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-textarea'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)

// native el
const taEl = ref<HTMLTextAreaElement | null>(null)

// v-model proxy
const modelProxy = computed({
  get: () => props.modelValue,
  set: (v: any) => emit('update:modelValue', v)
})

// validation registration
const registryName = computed(() => props.name ?? baseId.value)
const field = useFormField(registryName.value, modelProxy as any, props.rules ?? [], {
  nativeEl: taEl,
  nativeMessages: props.nativeMessages, // allow native required/maxlength if you pass them via $attrs
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

// derived visuals
const effectiveMessage = computed<string | null>(() => props.message ?? field.error.value ?? null)
const effectiveStatus = computed<Status>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

// events
function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  field.onInputValidate()
}
function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate()
}
</script>
