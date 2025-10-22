<template>
  <div class="w-full">
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

    <!-- Container (same shell as input) -->
    <div
      :class="[
        'ds-input',
        'relative', //take full width
        containerClass
      ]"
      :data-variant="variant"
      :data-size="size"
      :data-status="status"
      :data-disabled="disabled ? 'true' : 'false'"
    >
      <!-- Select field -->
      <select
        ref="selectEl"
        :id="id"
        v-model="model"
        :disabled="disabled"
        @change="$emit('change', $event)"
        :readonly="Boolean(readonly)"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        :aria-describedby="message ? describedById : undefined"
        class="ds-control w-full cursor-pointer appearance-none"
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
        :class="[
          'ds-adorn ds-adorn--end pointer-events-none justify-center ps-1 pe-3',
          'absolute end-0 top-1/2 -translate-y-1/2' //take full width
        ]"
      >
        <ChevronDownIcon />
      </span>
    </div>

    <!-- Helper message -->
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
import { computed } from 'vue'
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'
type ModelValue = string | number | null | Record<string, any>

interface Option {
  label: string
  value: ModelValue
}

const props = withDefaults(
  defineProps<{
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
    readonly?: boolean
    required?: boolean
  }>(),
  {
    size: 'md',
    status: 'default',
    variant: 'outlined',
    options: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: ModelValue): void
  (e: 'change', ev: Event): void
}>()

const model = computed({
  get: () => props.modelValue ?? '',
  set: (val) => emit('update:modelValue', val)
})

const describedById = computed(() => (props.id ? `${props.id}__desc` : undefined))
const selectEl = ref<HTMLSelectElement | null>(null)
defineExpose({
  selectEl: computed(() => selectEl.value)
})
export type ElExpose = { selectEl: HTMLSelectElement }
</script>
