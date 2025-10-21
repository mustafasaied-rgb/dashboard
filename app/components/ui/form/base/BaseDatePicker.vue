<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }} <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <!-- Shell -->
    <div
      class="ds-input"
      :data-variant="variant"
      :data-status="status"
      :data-size="size"
      :data-disabled="disabled ? 'true' : 'false'"
      :data-has-start="hasStart ? 'true' : 'false'"
      :data-has-end="'true'"
    >
      <!-- start adornment (optional) -->
      <span v-if="hasStart" class="ds-adorn ds-adorn--start" :class="{ bordered: borderedStart }">
        <slot name="start" />
      </span>

      <!-- flatpickr input -->
      <flat-pickr
        :id="id"
        v-model="innerValue"
        :config="computedConfig"
        :disabled="disabled"
        :placeholder="placeholder"
        class="ds-control"
        :class="[
          // small tweak: if there is a start adornment use smaller left padding
          hasStart ? 'ps-3' : 'ps-4',
          'pe-3'
        ]"
        @on-ready="onReady"
      />

      <!-- end adornment (calendar icon by default) -->
      <span class="ds-adorn ds-adorn--end" :class="{ bordered: borderedEnd }">
        <slot name="end">
          <!-- default calendar icon -->
          <Calendar2Line />
        </slot>
      </span>
    </div>

    <!-- helper -->
    <p
      v-if="message"
      class="ds-helper"
      :class="
        status === 'error'
          ? 'ds-helper--error'
          : status === 'success'
            ? 'ds-helper--success'
            : 'ds-helper--default'
      "
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'
type Mode = 'single' | 'multiple' | 'range'

const props = withDefaults(
  defineProps<{
    modelValue?: string | Date | null
    id?: string
    label?: string
    placeholder?: string
    size?: Size
    mode?: Mode
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    required?: boolean
    borderedStart?: boolean
    borderedEnd?: boolean
    config?: Record<string, any> // flatpickr options
  }>(),
  {
    modelValue: null,
    size: 'md',
    status: 'default',
    variant: 'outlined',
    borderedStart: false,
    borderedEnd: false,
    mode: 'single',
    config: () => ({})
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const slots = useSlots()
const hasStart = computed(() => !!slots.start)

const innerValue = computed({
  get: () => props.modelValue as any,
  set: (v) => emit('update:modelValue', v)
})

/** sensible defaults for a date picker */
const baseConfig = {
  mode: props.mode,
  altInput: true,
  altFormat: 'F j, Y', // Displayed text → "October 15, 2025"
  dateFormat: 'Y-m-d', // Actual model value → "2025-10-16"
  allowInput: false,
  locale: { rangeSeparator: ' / ' } // your custom separator
  // maxDate: '15.12.2017',
  // maxDate: new Date().fp_incr(14) // 14 days from now,
  // minDate: 'today',
  //  disable: ["2025-01-30", "2025-02-21", "2025-03-08", new Date(2025, 4, 9) ],
}
const computedConfig = computed(() => ({ ...baseConfig, ...props.config }))


/** ✅ Expose the real INPUT element used by flatpickr (altInput or input) */
const nativeEl = shallowRef<HTMLInputElement | null>(null)
function onReady(_selected: any, _dateStr: string, instance: any) {
  // Prefer altInput when altInput:true, else fallback to the raw input
  nativeEl.value = (instance?.altInput ?? instance?._input ?? instance?.input) as HTMLInputElement | null
}
defineExpose({ nativeEl })
export type ElExpose = { nativeEl: typeof nativeEl }
</script>
 
