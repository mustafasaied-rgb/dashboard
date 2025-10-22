<template>
  <BaseInput
    type="tel"
    :placeholder="placeholder"
    :modelValue="modelValue"
    @update:modelValue="onInput"
    :isBordered="true"
    v-bind="$attrs"
    endClass="px-0"
  >
    <!-- Country picker in END adornment so BaseInput handles layout -->
    <template #end>
      <BaseSelect
      containerClass="!ring-0"
        variant="plain"
        v-model="selectedIso"
        :options="countryOptions"
        :disabled="disabled"
        placeholder="Country"
      />
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type CountryOption = {
  iso: string // e.g. 'US'
  dial: string // e.g. '+1'
  label?: string // e.g. 'United States'
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    disabled?: boolean
    placeholder?: string
    defaultIso?: string
    countries?: CountryOption[]
  }>(),
  {
    disabled: false,
    placeholder: '+1 (555) 000-0000',
    defaultIso: 'US',
    countries: () => [
      { iso: 'US', dial: '+1', label: 'US' },
      { iso: 'GB', dial: '+44', label: 'GB' },
      { iso: 'CA', dial: '+1', label: 'CA' },
      { iso: 'AU', dial: '+61', label: 'AU' }
    ]
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'change:country', payload: { iso: string; dial: string }): void
}>()

/** keep a quick lookup of iso -> dial */
const dialByIso = computed<Record<string, string>>(() =>
  Object.fromEntries(props.countries.map((c) => [c.iso, c.dial]))
)

/** BaseSelect wants {label, value} */
const countryOptions = computed(() =>
  props.countries.map((c) => ({
    label: c.label ?? c.iso,
    value: c.iso
  }))
)

const selectedIso = ref(props.defaultIso)
const prevDial = ref(dialByIso.value[selectedIso.value] ?? '+1')

watch(selectedIso, (iso) => {
  const next = dialByIso.value[iso] ?? prevDial.value
  replacePrefix(next)
  prevDial.value = next
  emit('change:country', { iso, dial: next })
})

/** When user types, ensure the selected dial code is present (light touch, no full masking) */
const onInput = (val: string) => {
  const ensured = ensurePrefix(val ?? '', dialByIso.value[selectedIso.value] ?? '+')
  emit('update:modelValue', ensured)
}

/** Replace current leading dial code with the selected one */
const replacePrefix = (nextDial: string) => {
  const current = (props.modelValue ?? '').toString()
  const replaced = swapLeadingDial(current, nextDial)
  emit('update:modelValue', replaced)
}

/** --- helpers (simple, non-destructive) --- */

/** ensure value starts with the given dial; if not, add it once */
function ensurePrefix(value: string, dial: string): string {
  if (!value) return dial + ' '
  // if value already starts with any dial "+<digits>"
  const m = value.match(/^\+\d+/)
  if (m) {
    // if it matches the selected dial, keep as-is; else swap
    return m[0] === dial ? value : value.replace(/^\+\d+/, dial)
  }
  // strip leading zeros/spaces and add dial
  return `${dial} ${value.replace(/^0+/, '')}`
}

/** swap whatever leading "+digits" there is with next dial, or prepend if none */
function swapLeadingDial(value: string, nextDial: string): string {
  if (!value) return nextDial + ' '
  if (/^\+\d+/.test(value)) return value.replace(/^\+\d+/, nextDial)
  return `${nextDial} ${value}`
}
</script>
