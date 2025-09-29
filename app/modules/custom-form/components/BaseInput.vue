<template>
  <div class="cf-theme w-full font-zarid">
    <!-- ABOVE LABEL -->
    <label v-if="label && labelPlacement === 'above'" :for="baseId" :class="LABEL_ABOVE">
      {{ label }} <span v-if="required" aria-hidden="true" class="text-red-600">*</span>
    </label>

    <div class="relative">
      <slot name="leading" />
      <input
        ref="el"
        :id="baseId"
        class="peer"
        :class="[controlCls, $slots.leading && 'pl-9', $slots.trailing && 'pr-9']"
        :type="type"
        :value="modelValue as any"
        :placeholder="labelPlacement === 'inside' ? ' ' : placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :minlength="minlength"
        :maxlength="maxlength"
        :step="step"
        :pattern="pattern"
        :inputmode="inputmode"
        :title="title"
        :required="required"
        :autocomplete="autocomplete"
        :aria-label="labelPlacement === 'none' ? ariaLabel : undefined"
        :aria-invalid="computedError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            $emit('update:modelValue', target.value)
            onInputValidate()
          }
        "
        @blur="
          (e: FocusEvent) => {
            onBlurValidate()
            $emit('blur', e)
          }
        "
        @focus="$emit('focus', $event)"
      />
      <slot name="trailing" />
      <!-- INSIDE LABEL -->
      <label v-if="label && labelPlacement === 'inside'" :for="baseId" :class="floatLabelCls">
        {{ label }}
      </label>
    </div>

    <p v-if="description" :id="descId" :class="DESC">{{ description }}</p>
    <p v-if="computedError" :id="errorId" :class="ERR">{{ computedError }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import type { InputHTMLAttributes } from 'vue'
import { ValidateOn, type Rule } from '~/modules/custom-form/types'
import { useFormField } from '~/modules/custom-form/composables/useFormField'
import {
  CONTROL_BASE,
  CONTROL_ERROR,
  CONTROL_OK,
  PLACEHOLDER,
  LABEL_ABOVE,
  FLOATING_COMMON,
  SIZES,
  DESC,
  ERR,
  type FieldSize,
  type LabelPlacement
} from '~/modules/custom-form/ui/fieldTokens'

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    modelValue?: string | number | null
    type?: string
    minlength?: number | string
    maxlength?: number | string
    step?: number | string
    pattern?: string
    rules?: Rule[]
    inputmode?: InputHTMLAttributes['inputmode']
    validateOn?: ValidateOn
    title?: string
    placeholder?: string
    size?: FieldSize
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    autocomplete?: string
    error?: string | null
    description?: string | null
    label?: string
    labelPlacement?: LabelPlacement
    ariaLabel?: string
    realtimeMs?: number
  }>(),
  {
    type: 'text',
    size: 'md',
    modelValue: '',
    labelPlacement: 'above',
    rules: () => [],
    validateOn: ValidateOn.Submit
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number | null): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

const uid = Math.random().toString(36).slice(2)
const baseId = computed(() => props.id ?? `${props.name ?? 'ui-input'}-${uid}`)
const errorId = computed(() => `${baseId.value}-err`)
const descId = computed(() => `${baseId.value}-desc`)

const el = ref<HTMLInputElement | null>(null)
const {
  error: ruleError,
  onInputValidate,
  onBlurValidate
} = useFormField(baseId.value, toRef(props, 'modelValue'), props.rules, {
  nativeEl: el,
  nativeMessages: true,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

const computedError = computed<string | null>(() => props.error ?? ruleError.value ?? null)
const describedBy = computed(() => {
  const ids: string[] = []
  if (props.description) ids.push(descId.value)
  if (computedError.value) ids.push(errorId.value)
  return ids.join(' ') || undefined
})

const controlCls = computed(() =>
  [
    CONTROL_BASE,
    PLACEHOLDER,
    SIZES[props.size].control,
    computedError.value ? CONTROL_ERROR : CONTROL_OK
  ].join(' ')
)

const floatLabelCls = computed(() =>
  [FLOATING_COMMON, SIZES[props.size].label, SIZES[props.size].floatLabel || ''].join(' ')
)
</script>

<script lang="ts">
export default {}
export { LABEL_ABOVE, DESC, ERR } from '~/modules/custom-form/ui/fieldTokens'
</script>
<style src="~/modules/custom-form/ui/field-colors.css"></style>
