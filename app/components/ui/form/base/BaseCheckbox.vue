<template>
  <label
    class="ds-check"
    :data-size="size"
    :data-status="status"
    :data-disabled="disabled ? 'true' : 'false'"
  >
    <!-- Native checkbox input -->
    <input
      ref="inputEl"
      type="checkbox"
      class="ds-check__input"
      :checked="model"
      :disabled="disabled"
      :required="required"
      :aria-invalid="status === 'error' ? 'true' : undefined"
      @change="onChange"
    />

    <!-- Visual box -->
    <span class="ds-check__box" aria-hidden="true">
      <!-- ✅ Checked -->
      <template v-if="model && !indeterminate">
        <slot name="checkedIcon">
          <svg
            class="ds-check__icon"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="white"
              stroke-width="1.94437"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </template>

      <!-- ➖ Indeterminate -->
      <template v-else-if="indeterminate">
        <slot name="indeterminateIcon">
          <svg
            class="ds-check__icon"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="3"
              y1="7"
              x2="11"
              y2="7"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </slot>
      </template>

      <!-- ⬜ Unchecked -->
      <template v-else>
        <slot name="uncheckedIcon">
          <span class="block h-3.5 w-3.5"></span>
        </slot>
      </template>
    </span>

    <!-- Label (hidden if no slot/prop) -->
    <span v-if="hasLabel">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    size?: Size
    status?: Status
    disabled?: boolean
    required?: boolean
    indeterminate?: boolean
  }>(),
  {
    size: 'md',
    status: 'default',
    modelValue: false,
    indeterminate: false
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const inputEl = ref<HTMLInputElement | null>(null)
const model = computed({
  get: () => Boolean(props.modelValue),
  set: (v: boolean) => emit('update:modelValue', v)
})

/* Keep the native indeterminate state synced */
const setIndeterminate = () => {
  if (inputEl.value) inputEl.value.indeterminate = !!props.indeterminate
}
onMounted(setIndeterminate)
watch(() => props.indeterminate, setIndeterminate)

/* Detect if label or slot exists */
const slots = useSlots()
const hasSlotLabel = computed(() => !!slots.default && !!slots.default().length)
const hasLabel = computed(() => hasSlotLabel.value || !!props.label)

const onChange = (e: Event) => {
  model.value = (e.target as HTMLInputElement).checked
}
</script>
