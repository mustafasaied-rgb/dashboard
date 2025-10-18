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
      <!-- start adornment (inline, natural width) -->
      <span v-if="hasStart" class="ds-adorn ds-adorn--start" :class="isBordered ? 'bordered' : ''">
        <slot name="start" />
      </span>

      <!-- control -->
      <input
        ref="inputEl"
        :id="baseId"
        v-bind="$attrs"
        :type="actualType"
        :value="modelValue"
        @input="onInput"
        @blur="onBlur"
        @focus="$emit('focus', $event)"
        :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
        :aria-describedby="effectiveMessage ? describedById : undefined"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :readonly="Boolean(readonly)"
        class="ds-control"
      />

      <!-- end adornment: password toggle or icon -->
      <button
        v-if="revealable && type === 'password'"
        type="button"
        :tabindex="disabled ? -1 : 0"
        class="ds-adorn ds-adorn--end"
        @click="toggleReveal()"
        :disabled="disabled"
        aria-label="Toggle password visibility"
      >
        <slot name="revealIcon" v-if="!show"><eye-icon /></slot>
        <slot name="concealIcon" v-else><eye-off-icon /></slot>
      </button>

      <span
        v-else-if="hasEnd"
        class="ds-adorn ds-adorn--end"
        :class="[isBordered ? 'bordered' : '', endClass]"
      >
        <slot name="end" />
      </span>
    </div>

    <!-- helper -->
    <p
      v-if="effectiveMessage"
      :id="describedById"
      class="ds-helper"
      :class="{
        'ds-helper--error': effectiveStatus === 'error',
        'ds-helper--success': effectiveStatus === 'success',
        'ds-helper--default': effectiveStatus === 'default'
      }"
    >
      {{ effectiveMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, getCurrentInstance } from 'vue'
import type { InputHTMLAttributes } from 'vue'
import { useFormField } from '@/validation/useFormField' // <— your composable
import { ValidateOn } from '@/validation/types' // <— enum

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue?: string | number | null
    label?: string
    placeholder?: string
    type?: string
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    readonly?: InputHTMLAttributes['readonly']
    required?: boolean
    isBordered?: boolean // add divider on adornments
    revealable?: boolean // password toggle
    autocomplete?: string
    endClass?: string

    // Validation (internal, via provider)
    rules?: Array<any> // Rule | LegacyRule
    validateOn?: ValidateOn
    realtimeMs?: number
    nativeMessages?: boolean
    showSuccess?: boolean
  }>(),
  {
    type: 'text',
    size: 'md',
    status: 'default',
    variant: 'outlined',
    isBordered: false,
    revealable: false,

    // validation defaults
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

const slots = useSlots()
const hasStart = computed(() => !!slots.start)
const hasEnd = computed(() => !!slots.end)

const show = ref(false)
const toggleReveal = () => {
  show.value = !show.value
}
const actualType = computed(() =>
  props.revealable && props.type === 'password' ? (show.value ? 'text' : 'password') : props.type
)
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${'ui-input'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)

const inputEl = ref<HTMLInputElement | null>(null) // NEW: native el ref
const effectiveMessage = computed<string | null>(() => props.message ?? field.error.value ?? null)

// v-model proxy (read/write; safe for useFormField.reset())
const modelProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})
const field = useFormField(baseId.value, modelProxy, props.rules ?? [], {
  nativeEl: inputEl,
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})
const effectiveStatus = computed<Status>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})
function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
  field.onInputValidate() // trigger reactive validation
}
function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate() // trigger blur validation
}
</script>
