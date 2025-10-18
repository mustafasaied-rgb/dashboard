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

    <!-- Shell -->
    <div
      class="ds-input"
      :data-variant="variant"
      :data-size="size"
      :data-status="status"
      :data-disabled="disabled ? 'true' : 'false'"
    >
      <!-- start adornment (inline, natural width) -->
      <span v-if="hasStart" class="ds-adorn ds-adorn--start" :class="isBordered ? 'bordered' : ''">
        <slot name="start" />
      </span>

      <!-- control -->
      <input
        ref="inputEl"
        :id="id"
        v-bind="$attrs"
        :type="actualType"
        :value="modelValue"
        @input="onInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        :aria-describedby="message ? describedById : undefined"
        :disabled="disabled"
        :placeholder="placeholder"
        :readonly="Boolean(readonly)"
        class="ds-control"
      />

      <!-- end adornment: password toggle or icon -->
      <button
        v-if="revealable && type === 'password'"
        type="button"
        :tabindex="disabled ? -1 : 0"
        class="ds-adorn ds-adorn--end"
        @click="toggleReveal()"
        :disabled="disabled"
        aria-label="Toggle password visibility"
      >
        <slot name="revealIcon" v-if="!show"><eye-icon /></slot>
        <slot name="concealIcon" v-else><eye-off-icon /></slot>
      </button>

      <span
        v-else-if="hasEnd"
        class="ds-adorn ds-adorn--end"
        :class="[isBordered ? 'bordered' : '', endClass]"
      >
        <slot name="end" />
      </span>
    </div>

    <!-- helper -->
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
import { computed, ref, useSlots } from 'vue'
import type { InputHTMLAttributes } from 'vue'

type Size = 'sm' | 'md'
type Status = 'default' | 'success' | 'error'
type Variant = 'outlined' | 'soft' | 'plain'

const props = withDefaults(
  defineProps<{
    id?: string
    modelValue?: string | number | null
    label?: string
    placeholder?: string
    type?: string
    size?: Size
    status?: Status
    variant?: Variant
    message?: string
    disabled?: boolean
    readonly?: InputHTMLAttributes['readonly']
    required?: boolean
    isBordered?: boolean // add divider on adornments
    revealable?: boolean // password toggle
    endClass?: string
  }>(),
  {
    type: 'text',
    size: 'md',
    status: 'default',
    variant: 'outlined',
    isBordered: false,
    revealable: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

const slots = useSlots()
const hasStart = computed(() => !!slots.start)
const hasEnd = computed(() => !!slots.end)

const show = ref(false)
const toggleReveal = () => {
  show.value = !show.value
}
const actualType = computed(() =>
  props.revealable && props.type === 'password' ? (show.value ? 'text' : 'password') : props.type
)

const describedById = computed(() => (props.id ? `${props.id}__desc` : undefined))
const onInput = (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)

 

const inputEl = ref<HTMLInputElement | null>(null)
defineExpose({ inputEl })
export type ElExpose = { inputEl: typeof inputEl }
</script>
