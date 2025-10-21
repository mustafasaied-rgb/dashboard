<template>
  <label class="ds-radio" :data-size="size" :data-disabled="disabled ? 'true' : 'false'">
    <input
      class="ds-radio__input"
      ref="inputEl"
      type="radio"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />

    <span class="ds-radio__outer" aria-hidden="true">
      <!-- allow custom icons; default is a white dot -->
      <template v-if="isChecked">
        <slot name="checkedIcon">
          <span class="ds-radio__dot"></span>
        </slot>
      </template>
      <template v-else>
        <slot name="uncheckedIcon">
          <!-- empty center by default -->
          <span class="ds-radio__dot opacity-0"></span>
        </slot>
      </template>
    </span>

    <!-- label text (only if provided) -->
    <span v-if="hasLabel">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
type MV = string | number | boolean | null

type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    modelValue?: MV
    value: string | number | boolean
    name?: string
    label?: string
    size?: Size
    disabled?: boolean
  }>(),
  {
    size: 'md',
    modelValue: ''
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: string | number | boolean): void }>()

const isChecked = computed(() => props.modelValue === props.value)
const onChange = () => emit('update:modelValue', props.value)

const slots = useSlots()
const hasSlotLabel = computed(() => !!slots.default && !!slots.default().length)
const hasLabel = computed(() => hasSlotLabel.value || !!props.label)
</script>
