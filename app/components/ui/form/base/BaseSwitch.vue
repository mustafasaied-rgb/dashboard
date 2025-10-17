<template>
  <label
    class="ds-switch"
    :data-size="size"
    :data-disabled="disabled ? 'true' : 'false'"
  >
    <!-- Accessible native checkbox with role switch -->
    <input
      class="ds-switch__input"
      type="checkbox"
      role="switch"
      :aria-checked="model ? 'true' : 'false'"
      :checked="model"
      :disabled="disabled"
      :name="name"
      :id="id"
      @change="onChange"
    />

    <!-- Visual track + thumb -->
    <span class="ds-switch__track" aria-hidden="true">
      <span class="ds-switch__thumb">
        <!-- Optional content inside the thumb -->
        <slot name="thumb" />
      </span>
    </span>

    <!-- Label text (only if provided) -->
    <span v-if="hasLabel">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Size = 'sm' | 'md'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  size?: Size
  disabled?: boolean
  name?: string
  id?: string
}>(), {
  modelValue: false,
  size: 'md'
})

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const model = computed({
  get: () => !!props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})
const onChange = (e: Event) => { model.value = (e.target as HTMLInputElement).checked }

const slots = useSlots()
const hasLabel = computed(() => !!props.label || !!(slots.default && slots.default().length))
</script>
