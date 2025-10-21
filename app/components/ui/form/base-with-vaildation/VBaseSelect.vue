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
      :class="[
        'ds-input',
        'relative', //take full width
        containerClass
      ]"
      :data-variant="variant"
      :data-size="size"
      :data-status="effectiveStatus"
      :data-disabled="disabled ? 'true' : 'false'"
    >
      <!-- Select -->
      <select
        ref="selectEl"
        :id="baseId"
        v-model="model"
        :disabled="disabled"
        :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
        :aria-describedby="effectiveMessage ? describedById : undefined"
        class="ds-control w-full cursor-pointer appearance-none"
        @change="onChange"
        @blur="onBlur"
      >
        <option v-if="placeholder" disabled value="">
          {{ placeholder }}
        </option>

        <option
          v-for="(option, idx) in options"
          :key="idx"
          :value="option.value"
          class="text-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Chevron Icon -->
      <span
        class="ds-adorn ds-adorn--end pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 justify-center ps-1 pe-3"
      >
        <ChevronDownIcon />
      </span>
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
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'
type ModelValue = string | number | null

interface Option {
  label: string
  value: ModelValue
}

const props = withDefaults(
  defineProps<{
    name?: string
    id?: string
    modelValue?: ModelValue
    label?: string
    containerClass?: string
    placeholder?: string
    options?: Option[]
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    required?: boolean

    // Validation
    rules?: Array<any> // Rule | LegacyRule
    validateOn?: ValidateOn
    realtimeMs?: number
    nativeMessages?: boolean // if you want native <select required> messages
    showSuccess?: boolean
  }>(),
  {
    size: 'md',
    status: 'default',
    variant: 'outlined',
    options: () => [],
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: ModelValue): void
  (e: 'change', ev: Event): void
  (e: 'blur', ev: FocusEvent): void
}>()

// SSR-safe base id
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-select'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)

// model proxy (ensures we keep '' for placeholder when nullish)
const model = computed<ModelValue>({
  get: () => props.modelValue ?? (props.placeholder ? '' : null),
  set: (val) => emit('update:modelValue', val as ModelValue)
})

const selectEl = ref<HTMLSelectElement | null>(null)

// register with AppForm using name || baseId for clean snapshot keys
const registryName = computed(() => props.name ?? baseId.value)
const field = useFormField(registryName.value, model as any, props.rules ?? [], {
  nativeEl: selectEl,
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

// effective visuals
const effectiveMessage = computed<string | null>(() => props.message ?? field.error.value ?? null)
const effectiveStatus = computed<Status>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

// events
function onChange() {
  // treat change like input for selects
  field.onInputValidate()
}
function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate()
}

// optional expose
defineExpose({
  focus: () => selectEl.value?.focus(),
  reset: field.reset,
  resetValidation: field.resetValidation
})
</script>
