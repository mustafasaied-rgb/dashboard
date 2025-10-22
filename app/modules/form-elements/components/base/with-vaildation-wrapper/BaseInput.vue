<template>
  <UiInput
    ref="inner"
    :id="baseId"
    v-model="modelProxy"
    :status="effectiveStatus"
    :message="effectiveMessage || message"
    v-bind="passthroughAttrs"
    @input="onInput"
    @blur="onBlur"
    @focus="$emit('focus', $event)"
  >
    <!-- forward ALL named slots transparently -->
    <template v-if="$slots.start" #start>
      <slot name="start" />
    </template>
    <template v-if="$slots.end" #end>
      <slot name="end" />
    </template>
    <template v-if="$slots.revealIcon" #revealIcon>
      <slot name="revealIcon" />
    </template>
    <template v-if="$slots.concealIcon" #concealIcon>
      <slot name="concealIcon" />
    </template>
  </UiInput>
</template>

<script setup lang="ts">
/**
 * Validation wrapper that composes BaseInput without touching it.
 * - Accepts the same v-model API as BaseInput
 * - Adds validation props (rules, validateOn, etc.)
 * - Computes effective status/message and passes them to BaseInput
 */

import { computed, getCurrentInstance, ref, useAttrs } from 'vue'
import { useFormField } from '~/modules/form-elements/composables/useFormField'
import { ValidateOn } from '~/modules/form-elements/types'
import BaseInput from '~/modules/form-elements/components/UI-without-vaildation/UiInput.vue'
import type { ElExpose } from '~/modules/form-elements/components/UI-without-vaildation/UiInput.vue'
type Status = 'default' | 'success' | 'error'

const props = withDefaults(
  defineProps<{
    /** v-model */
    modelValue?: string | number | null

    /** Optional explicit overrides that win over validation */
    status?: Status
    message?: string

    /** Optional id override (otherwise we auto-generate) */
    id?: string

    /** Validation */
    rules?: Array<any>
    validateOn?: ValidateOn
    realtimeMs?: number
    nativeMessages?: boolean
    showSuccess?: boolean
  }>(),
  {
    modelValue: '',
    status: 'default',
    message: '',
    validateOn: ValidateOn.Submit,
    realtimeMs: 150,
    nativeMessages: false,
    showSuccess: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

/**
 * Pass every other attr/prop straight through to BaseInput,
 * so we don't have to duplicate its API (type, placeholder, revealable, etc.).
 */
const attrs = useAttrs()
const passthroughAttrs = computed(() => attrs)

/** Stable id */
const inst = getCurrentInstance()
const baseId = computed(() => props.id ?? `vinput-${inst?.uid ?? '0'}`)

/** Native input ref: we’ll pass it to the validator for focus/scroll, etc. */

const inner = ref<ComponentPublicInstance<ElExpose> | null>(null) // We don’t control BaseInput’s internal input ref, but the composable can
// still validate on events we trigger from here (input/blur).
const nativeEl = computed<HTMLInputElement | null>(() => inner.value?.inputEl?.value ?? null)

/** v-model proxy */
const modelProxy = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

/** Wire up validation */
const field = useFormField(baseId.value, modelProxy, props.rules ?? [], {
  // We can pass a nativeEl if your composable accepts it; otherwise omit it.
  nativeEl,
  nativeMessages: props.nativeMessages,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

const effectiveMessage = computed<string | null>(() => {
  // Explicit message (prop) takes precedence if provided
  if (props.message) return props.message
  return field.error.value ?? null
})

const effectiveStatus = computed<Status>(() => {
  // Explicit status (prop) wins if not 'default'
  if (props.status && props.status !== 'default') return props.status
  if (effectiveMessage.value) return 'error'
  if (props.showSuccess && field.touched.value && !effectiveMessage.value) return 'success'
  return 'default'
})

/** Event hooks: fire validation + bubble up */
function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
  field.onInputValidate()
}

function onBlur(e: FocusEvent) {
  emit('blur', e)
  field.onBlurValidate()
}
</script>
