<template>
  <div class="w-full" ref="root">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-error-500">*</span>
    </label>

    <!-- Shell -->
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
          class="ds-input relative !overflow-visible"
          :data-variant="variant"
          :data-size="size"
          :data-status="status"
          :data-disabled="disabled ? 'true' : 'false'"
          data-has-start="false"
          data-has-end="true"
          role="combobox"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="menuId"
        >
          <div class="ds-control flex flex-wrap items-center gap-2 pr-9">
            <!-- placeholder when empty -->
            <span v-if="!selectedValueList.length" class="text-[var(--ds-ph)]">
              {{ placeholder || 'Select…' }}
            </span>

            <!-- chips -->
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

            <!-- single mode: plain text, no chip -->
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
              @click.stop="toggle(opt.value)"
              @keydown.enter.prevent="toggle(opt.value)"
              @keydown.space.prevent="toggle(opt.value)"
              @keydown.esc.prevent="close"
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
      v-if="message"
      :id="describedById"
      class="ds-helper"
      :class="{
        'ds-helper--error': status === 'error',
        'ds-helper--success': status === 'success',
        'ds-helper--default': status === 'default'
      }"
    >
      {{ message }}
    </p>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'
type Value = string | number | Record<string, any>
type Mode = 'single' | 'multiple'

interface Option {
  label: string
  value: Value
}

type InputOption = string | Option

const props = withDefaults(
  defineProps<{
    id?: string
    /** modelValue can be array or single depending on mode */
    modelValue?: Value | Option | Array<Value | Option>
    options?: InputOption[]
    label?: string
    placeholder?: string
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    required?: boolean
    /** When true, emits selected Option objects instead of values */
    returnObject?: boolean
    /** Selection mode: single or multiple */
    mode?: Mode
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    size: 'md',
    status: 'default',
    variant: 'outlined',
    returnObject: false,
    mode: 'multiple'
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const open = ref(false)
const menuId = `ms-${Math.random().toString(36).slice(2)}`

/** Normalize options */
const normalizedOptions = computed<Option[]>(() =>
  (props.options ?? []).map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
)

const optionsMap = computed(() => {
  const m = new Map<Value, Option>()
  for (const o of normalizedOptions.value) m.set(o.value, o)
  return m
})

/** Normalize model value to array for internal handling */
const selectedValueList = computed<Value[]>(() => {
  if (props.mode === 'single') {
    const val = props.modelValue
    if (!val) return []
    if (props.returnObject && typeof val === 'object') return [(val as Option).value]
    return [val as Value]
  }
  const mv = props.modelValue ?? []
  if (!props.returnObject) return mv as Value[]
  return (mv as Option[])
    .map((it) => (typeof it === 'object' && it ? (it as any).value : it))
    .filter((v) => v !== undefined) as Value[]
})

const selectedOptions = computed<Option[]>(
  () => selectedValueList.value.map((v) => optionsMap.value.get(v)).filter(Boolean) as Option[]
)
const selectedLabel = computed(() => selectedOptions.value[0]?.label ?? '')

function isSelected(v: Value) {
  return selectedValueList.value.some((x) => x === v)
}

/** Emit normalized output depending on mode & returnObject */
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

function toggle(v: Value) {
  if (props.disabled) return
  if (props.mode === 'single') {
    // single mode → replace existing value
    emitSelectionFromValues(isSelected(v) ? [] : [v])
    open.value = false
    return
  }
  const set = new Set(selectedValueList.value)
  set.has(v) ? set.delete(v) : set.add(v)
  emitSelectionFromValues(Array.from(set))
}

function remove(v: Value) {
  if (props.disabled) return
  if (props.mode === 'single') {
    emitSelectionFromValues([])
  } else {
    const next = selectedValueList.value.filter((x) => x !== v)
    emitSelectionFromValues(next)
  }
}
const describedById = computed(() => (props.id ? `${props.id}__desc` : undefined))
</script>
