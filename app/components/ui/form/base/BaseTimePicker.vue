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

      <!-- flatpickr time-only -->
      <flat-pickr
        :id="id"
        v-model="innerValue"
        :config="computedConfig"
        :disabled="disabled"
        :placeholder="placeholder"
        class="ds-control"
        :class="[hasStart ? 'pl-3' : 'pl-4', 'pr-3']"
      />

      <!-- end adornment (clock icon default) -->
      <span class="ds-adorn ds-adorn--end" :class="{ bordered: borderedEnd }">
        <slot name="end">
          <clock-icon/>
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

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    modelValue: null,
    size: 'md',
    status: 'default',
    variant: 'outlined',
    borderedStart: false,
    borderedEnd: false,
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

/** sensible defaults for time picker */
const baseConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:i',
  time_24hr: true,
  allowInput: false
}
const computedConfig = computed(() => ({ ...baseConfig, ...props.config }))
</script>

<script lang="ts">
export default {
  components: { FlatPickr }
}
</script>
