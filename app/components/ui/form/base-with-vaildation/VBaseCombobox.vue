<template>
  <div class="w-full" ref="root">
    <!-- Label -->
    <label
      v-if="label"
      :for="baseId"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-error-500">*</span>
    </label>

    <!-- Shell / Trigger -->
    <FloatingWrapper
      v-model="open"
      placement="bottom-start"
      :offset="6"
      class="w-full"
      :matchWidth="true"
      :closeOnClickOutside="true"
    >
      <template #trigger="{ open: isOpen }">
        <div
          ref="triggerEl"
          :id="baseId"
          class="ds-input relative !overflow-visible"
          :data-variant="variant"
          :data-size="size"
          :data-status="effectiveStatus"
          :data-disabled="disabled ? 'true' : 'false'"
          data-has-start="false"
          data-has-end="true"
          role="combobox"
          tabindex="0"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="menuId"
          :aria-invalid="effectiveStatus === 'error' ? 'true' : undefined"
          :aria-describedby="effectiveMessage ? describedById : undefined"
          @blur="onTriggerBlur"
          @keydown.esc.prevent="open = false"
        >
          <div class="ds-control flex flex-wrap items-center gap-2 pr-9">
            <!-- placeholder -->
            <span v-if="!selectedValueList.length" class="text-[var(--ds-ph)]">
              {{ placeholder || 'Select…' }}
            </span>

            <!-- chips for multiple -->
            <template v-else-if="mode === 'multiple'">
              <Badge
                v-for="opt in selectedOptions"
                :key="`tag-${String(opt.value)}`"
                @click.stop
                :color="'light'"
                variant="solid"
              >
                {{ opt.label }}
                <template #end>
                  <button
                    type="button"
                    class="ml-1 text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] dark:text-[var(--color-gray-400)] dark:hover:text-[var(--color-gray-300)]"
                    aria-label="Remove"
                    @click="remove(opt.value)"
                  >
                    ✕
                  </button>
                </template>
              </Badge>
            </template>

            <!-- single: plain text -->
            <template v-else>
              <span class="truncate text-[var(--ds-text)]">
                {{ selectedLabel }}
              </span>
            </template>
          </div>

          <!-- Chevron -->
          <span
            class="ds-adorn ds-adorn--end pointer-events-none absolute end-1 top-1/2 -translate-y-1/2 ps-1 pe-2"
            aria-hidden="true"
          >
            <ChevronDownIcon
              :class="isOpen ? 'rotate-180 transition-transform' : 'transition-transform'"
            />
          </span>
        </div>
      </template>

      <!-- Menu -->
      <template #floating="{ close }">
        <div
          :id="menuId"
          role="listbox"
          aria-multiselectable="true"
          class="shadow-theme-xs mt-1 w-full origin-top overflow-hidden rounded-lg border border-[var(--ds-input-border)] bg-white dark:border-[var(--ds-input-border-dark)] dark:bg-[var(--ds-bg-dark)]"
          @keydown.stop
        >
          <ul
            class="custom-scrollbar max-h-60 divide-y divide-[var(--ds-input-divider)] overflow-y-auto dark:divide-[var(--ds-input-divider-dark)]"
          >
            <li
              v-for="(opt, idx) in normalizedOptions"
              :key="`opt-${String(opt.value)}`"
              class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-[var(--ds-text)] hover:bg-[color-mix(in_oklab,var(--color-gray-100)_60%,transparent)] dark:hover:bg-white/5"
              :class="
                isSelected(opt.value)
                  ? 'bg-[color-mix(in_oklab,var(--color-gray-100)_40%,transparent)] dark:bg-white/5'
                  : ''
              "
              role="option"
              :aria-selected="isSelected(opt.value) ? 'true' : 'false'"
              tabindex="0"
              @click.stop="toggle(opt.value, close)"
              @keydown.enter.prevent="toggle(opt.value, close)"
              @keydown.space.prevent="toggle(opt.value, close)"
              @keydown.esc.prevent="closeMenu(close)"
            >
              <span
                v-if="mode === 'multiple'"
                class="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-[var(--ds-input-border)] text-[10px] leading-none dark:border-[var(--ds-input-border-dark)]"
                :class="isSelected(opt.value) ? 'bg-brand-500 border-brand-500 text-white' : ''"
                aria-hidden="true"
              >
                <span v-if="isSelected(opt.value)">✓</span>
              </span>
              <span class="truncate">{{ opt.label }}</span>
            </li>
          </ul>
        </div>
      </template>
    </FloatingWrapper>

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
import { computed, getCurrentInstance, ref, watch } from 'vue'
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue'
import { useFormField } from '@/validation/useFormField'
import { ValidateOn } from '@/validation/types'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'
type Value = string | number | Record<string, any>
type Mode = 'single' | 'multiple'
type ModelValue = Value | Array<Value> | Record<string, any> | Array<Record<string, any>>

interface Option {
  label: string
  value: Value
}
type InputOption = string | Option

const props = withDefaults(
  defineProps<{
    name?: string
    id?: string
    modelValue?: ModelValue
    options?: InputOption[]
    label?: string
    placeholder?: string
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    required?: boolean
    returnObject?: boolean
    mode?: Mode

    // Validation (same API as VBaseInput)
    rules?: Array<any>
    validateOn?: ValidateOn
    realtimeMs?: number
    showSuccess?: boolean
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    size: 'md',
    status: 'default',
    variant: 'outlined',
    returnObject: false,
    mode: 'multiple',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    showSuccess: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLElement | null>(null)

const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-combobox'}-${inst?.uid ?? '0'}`)
const describedById = computed(() => `${baseId.value}__desc`)
const menuId = `ms-${inst?.uid ?? Math.random().toString(36).slice(2)}`

// normalize options
const normalizedOptions = computed<Option[]>(() =>
  (props.options ?? []).map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)
const optionsMap = computed(() => {
  const m = new Map<Value, Option>()
  for (const o of normalizedOptions.value) m.set(o.value, o)
  return m
})

// selected (internal) as list of values
const selectedValueList = computed<Value[]>(() => {
  if (props.mode === 'single') {
    const val = props.modelValue as any
    // Treat null/undefined/empty-array as "no selection"
    if (val == null || (Array.isArray(val) && val.length === 0)) return []
    // If returning objects, extract their value (but ignore arrays)
    if (props.returnObject && typeof val === 'object' && !Array.isArray(val)) {
      const v = (val as Option).value
      return v == null ? [] : [v]
    }
    return [val as Value]
  }
  // MULTIPLE mode
  const mv = (props.modelValue ?? []) as any[]
  if (!props.returnObject) return mv as Value[]
  // Array of Option objects → map to their value
  return (mv as Option[])
    .map((o) => (o && typeof o === 'object' ? (o as any).value : o))
    .filter((v) => v !== undefined) as Value[]
})

const selectedOptions = computed<Option[]>(
  () => selectedValueList.value.map((v) => optionsMap.value.get(v)).filter(Boolean) as Option[]
)
const selectedLabel = computed(() => selectedOptions.value[0]?.label ?? '')

function isSelected(v: Value) {
  return selectedValueList.value.some((x) => x === v)
}

// model proxy for useFormField (we keep the external v-model shape)
const modelProxy = computed({
  get: () => props.modelValue,
  set: (val: any) => emit('update:modelValue', val)
})

const registryName = computed(() => props.name ?? baseId.value)
// Pass the trigger element to the form so focusFirstInvalid can focus it
const field = useFormField(registryName.value, modelProxy as any, props.rules ?? [], {
  nativeEl: triggerEl as unknown as any,
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

// emit normalized selection
function emitSelectionFromValues(nextValues: Value[]) {
  if (props.mode === 'single') {
    const v = nextValues[0] ?? null
    if (props.returnObject) {
      const opt = v ? optionsMap.value.get(v) : null
      emit('update:modelValue', opt ?? null)
    } else {
      emit('update:modelValue', v)
    }
  } else {
    if (props.returnObject) {
      const nextOptions = nextValues.map((v) => optionsMap.value.get(v)).filter(Boolean) as Option[]
      emit('update:modelValue', nextOptions)
    } else {
      emit('update:modelValue', nextValues)
    }
  }
}

// selection handlers
function toggle(v: Value, close?: () => void) {
  if (props.disabled) return
  if (props.mode === 'single') {
    emitSelectionFromValues(isSelected(v) ? [] : [v])
    field.onInputValidate()
    open.value = false
    close?.()
    return
  }
  const set = new Set(selectedValueList.value)
  set.has(v) ? set.delete(v) : set.add(v)
  emitSelectionFromValues(Array.from(set))
  field.onInputValidate()
}

function remove(v: Value) {
  if (props.disabled) return
  if (props.mode === 'single') {
    emitSelectionFromValues([])
  } else {
    emitSelectionFromValues(selectedValueList.value.filter((x) => x !== v))
  }
  field.onInputValidate()
}

function closeMenu(close: () => void) {
  close()
  open.value = false
  // treat close like blur: validate on blur modes
  field.onBlurValidate()
}

// trigger blur (when the trigger element itself loses focus)
function onTriggerBlur() {
  field.onBlurValidate()
}

// when the popup closes (by outside click), also treat as blur for validation
watch(open, (isOpen) => {
  if (!isOpen) field.onBlurValidate()
})
</script>
