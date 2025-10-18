<!-- VBaseRadioGroup.vue -->
<template>
  <div class="w-full">
    <!-- Group Label -->
    <label v-if="label" :for="baseId" class="ds-label" :class="disabled ? 'cursor-not-allowed opacity-60' : ''">
      {{ label }} <span v-if="required" aria-hidden="true" class="text-error-500">*</span>
    </label>

    <!-- Group container (status ring + a11y hooks) -->
    <div
      :id="baseId"
      class="rounded-[var(--ds-input-radius)] p-2"
      role="radiogroup"
      :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
      :aria-describedby="effectiveMessage ? describedById : undefined"
      :data-status="effectiveStatus"
    >
      <!-- Render radios via options prop or slot -->
      <div class="flex flex-col gap-2">
        <template v-if="options?.length">
          <VBaseRadio
            v-for="(opt, i) in normalizedOptions"
            :key="i"
            :name="groupName"
            :value="opt.value"
            :label="opt.label"
            :size="size"
            :disabled="disabled"
            :modelValue="modelProxy"
            @update:modelValue="onChange"
            @blur="onBlur"
          />
        </template>

        <slot v-else
          :name="`default`"
          :nameProp="groupName"
          :modelValue="modelProxy"
          :onChange="onChange"
          :onBlur="onBlur"
        />
      </div>
    </div>

    <!-- Helper message -->
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
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'
type MV = string | number | boolean | null

interface Option { label: string; value: MV }

const props = withDefaults(defineProps<{
  name?: string
  id?: string
  modelValue?: MV
  label?: string
  size?: Size
  status?: Status
  variant?: Variant
  message?: string
  disabled?: boolean
  required?: boolean

  options?: Option[]     // optional: render from options OR provide <slot> with VBaseRadio items

  // validation (same API as other fields)
  rules?: Array<any>
  validateOn?: ValidateOn
  realtimeMs?: number
  showSuccess?: boolean
}>(), {
  modelValue: null,
  size: 'md',
  status: 'default',
  variant: 'outlined',
  options: () => [],
  validateOn: ValidateOn.Submit,
  realtimeMs: 150,
  showSuccess: false
})

const emit = defineEmits<{ (e:'update:modelValue', v:MV): void }>()

// SSR-safe ids/names
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-radio'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)
const groupName = computed(() => props.name ?? baseId.value)

// normalize options
const normalizedOptions = computed<Option[]>(() => props.options ?? [])

// v-model proxy
const modelProxy = computed<MV>({
  get: () => props.modelValue ?? null,
  set: (v) => emit('update:modelValue', v)
})

// register with AppForm; focus element = group container (focus() works)
const groupEl = ref<HTMLDivElement | null>(null)
const registryName = computed(() => groupName.value)

// Auto-merge required rule if you want (optional):
// import { builtinRules } from '@/validation/builtinRules'
// const mergedRules = computed(() => props.required ? [builtinRules.required, ...(props.rules ?? [])] : (props.rules ?? []))
const mergedRules = computed(() => props.rules ?? [])

const field = useFormField(registryName.value, modelProxy as any, mergedRules.value, {
  // cast so focusFirstInvalid can focus the group
  nativeEl: groupEl as unknown as any,
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

// events
function onChange(v: MV) {
  emit('update:modelValue', v)
  field.onInputValidate()
}
function onBlur() {
  field.onBlurValidate()
}
</script>
