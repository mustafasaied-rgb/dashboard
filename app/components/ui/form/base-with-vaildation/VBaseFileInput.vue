<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="baseId"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <!-- Shell -->
    <div
      class="ds-input relative flex items-stretch gap-3 overflow-hidden"
      :data-variant="variant"
      :data-status="effectiveStatus"
      :data-fixedsize="size"
      :data-disabled="disabled ? 'true' : 'false'"
    >
      <!-- File input (visually hidden, still focusable for a11y) -->
      <input
        :id="baseId"
        ref="inputEl"
        type="file"
        :multiple="multiple"
        :disabled="disabled"
        :required="required"
        :class="['absolute inset-0 z-10 cursor-pointer opacity-0', 'sr-only']"
        @change="onFileChange"
        @blur="onBlur"
        :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
        :aria-describedby="effectiveMessage ? describedById : undefined"
      />

      <!-- Upload button -->
      <button
        type="button"
        class="z-0 flex h-full shrink-0 items-center rounded-s-[calc(var(--ds-input-radius)_-_2px)] border border-[var(--ds-input-divider)] bg-[color-mix(in_oklab,var(--color-gray-100)_40%,transparent)] px-3 text-sm font-medium text-[var(--ds-text)] hover:bg-[color-mix(in_oklab,var(--color-gray-100)_60%,transparent)] focus:outline-hidden dark:border-[var(--ds-input-divider-dark)] dark:bg-white/5 dark:hover:bg-white/10"
        :disabled="disabled"
        @click="onBrowseClick"
        :aria-controls="baseId"
      >
        <slot name="button-label">
          {{ buttonLabel }}
        </slot>
      </button>

      <!-- File names -->
      <div
        class="flex min-w-0 flex-1 flex-wrap items-center gap-2 overflow-hidden text-sm text-[var(--ds-text)]"
      >
        <span
          v-if="!selectedFiles.length"
          class="truncate text-[var(--ds-ph)] dark:text-[var(--ds-ph-dark)]"
        >
          {{ placeholder || 'No file chosen' }}
        </span>

        <template v-else>
          <span
            v-for="(file, i) in selectedFiles"
            :key="i"
            class="inline-flex items-center gap-1 rounded-full border border-[var(--ds-input-divider)] bg-[color-mix(in_oklab,var(--color-gray-100)_40%,transparent)] px-2.5 py-0.5 text-xs dark:border-[var(--ds-input-divider-dark)] dark:bg-white/5"
          >
            <span class="max-w-[150px] truncate">{{ file.name }}</span>
            <button
              type="button"
              class="text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] dark:text-[var(--color-gray-400)] dark:hover:text-[var(--color-gray-300)]"
              aria-label="Remove"
              @click.stop="removeFile(i)"
            >
              ✕
            </button>
          </span>
        </template>
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
import { ref, computed, getCurrentInstance } from 'vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(
  defineProps<{
    name?: string
    id?: string
    modelValue?: File[]
    label?: string
    placeholder?: string
    buttonLabel?: string
    multiple?: boolean
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    required?: boolean

    // Validation (same API as inputs/select/combobox)
    rules?: Array<any> // Rule | LegacyRule
    validateOn?: ValidateOn
    realtimeMs?: number
    nativeMessages?: boolean // file inputs support native required validity
    showSuccess?: boolean
  }>(),
  {
    modelValue: () => [],
    buttonLabel: 'Choose File',
    multiple: false,
    size: 'md',
    status: 'default',
    variant: 'outlined',

    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: true, // default true for file inputs (nice UX for required)
    showSuccess: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: File[]): void }>()

// SSR-safe id
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-file'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)

const inputEl = ref<HTMLInputElement | null>(null)

const selectedFiles = computed<File[]>(() => props.modelValue || [])

// v-model proxy (read/write; safe for reset())
const modelProxy = computed<File[]>({
  get: () => props.modelValue || [],
  set: (files) => emit('update:modelValue', files || [])
})

// Register in AppForm
const registryName = computed(() => props.name ?? baseId.value)
const field = useFormField(registryName.value, modelProxy as any, props.rules ?? [], {
  nativeEl: inputEl, // focus & native validity (required)
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

// Derive visuals
const effectiveMessage = computed<string | null>(() => props.message ?? field.error.value ?? null)
const effectiveStatus = computed<Status>(() => {
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

// Events
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files ? Array.from(target.files) : []
  emit('update:modelValue', files)
  field.onInputValidate()
}
function removeFile(index: number) {
  const files = [...selectedFiles.value]
  files.splice(index, 1)
  emit('update:modelValue', files)
  field.onInputValidate()
}
function onBrowseClick() {
  if (props.disabled) return
  inputEl.value?.click()
}
function onBlur() {
  field.onBlurValidate()
}

// Optional expose
defineExpose({
  focus: () => inputEl.value?.focus(),
  reset: field.reset,
  resetValidation: field.resetValidation
})
</script>

<style scoped>
/* Make hidden input still clickable by button; we trigger click() anyway */
.ds-input input[type='file'] {
  cursor: pointer;
}
</style>
