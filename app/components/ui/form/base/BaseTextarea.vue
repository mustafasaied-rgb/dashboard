<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      class="ds-label"
      :class="disabled ? 'cursor-not-allowed opacity-60' : ''"
    >
      {{ label }} <span v-if="required" aria-hidden="true" class="text-error-500">*</span>
    </label>

    <!-- Shell (same container used by BaseInput) -->
    <div
      class="ds-input"
      :data-variant="variant"
      :data-size="size"
      :data-status="status"
      :data-disabled="disabled ? 'true' : 'false'"
    >
      <!-- You can keep adornments if you ever need them:
           <span class="ds-adorn ds-adorn--start" :class="isBordered ? 'bordered' : ''"><slot name='start' /></span>
      -->

      <!-- The textarea control -->
      <textarea
        :id="id"
        v-bind="$attrs"
        :rows="rows"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="Boolean(readonly)"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        :aria-describedby="message ? describedById : undefined"
        class="ds-control"
        :class="[resizable ? 'ds-control--textarea' : 'resize-none']"
        @input="onInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      ></textarea>

      <!-- End adornment slot if ever needed
           <span class="ds-adorn ds-adorn--end" :class="isBordered ? 'bordered' : ''"><slot name='end' /></span>
      -->
    </div>

    <!-- helper / validation -->
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
import type { TextareaHTMLAttributes } from 'vue'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue?: string | null
    label?: string
    placeholder?: string
    rows?: number
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    readonly?: TextareaHTMLAttributes['readonly']
    required?: boolean
    resizable?: boolean // allow vertical resize (uses .ds-control--textarea)
  }>(),
  {
    rows: 6,
    size: 'md',
    status: 'default',
    variant: 'outlined',
    resizable: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

const describedById = computed(() => (props.id ? `${props.id}__desc` : undefined))
const onInput = (e: Event) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
</script>
