<template>
  <div class="cf-theme w-full font-zarid">
    <!-- ABOVE LABEL -->
    <label v-if="label && labelPlacement === 'above'" :for="baseId" :class="LABEL_ABOVE">
      {{ label }} <span v-if="required" aria-hidden="true" class="text-red-600">*</span>
    </label>

    <div class="relative">
      <textarea
        ref="el"
        :id="baseId"
        class="peer"
        :class="controlCls"
        :value="modelValue as any"
        :rows="rows"
        :placeholder="labelPlacement === 'inside' ? ' ' : placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :title="title"
        :required="required"
        :autocomplete="autocomplete"
        :aria-label="labelPlacement === 'none' ? ariaLabel : undefined"
        :aria-invalid="computedError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="
          (e: any) => {
            $emit('update:modelValue', e.target.value)
            onInputValidate()
          }
        "
        @blur="onBlurValidate()"
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
import { ValidateOn, type Rule } from '~/modules/custom-form/types'
import { useFormField } from '~/modules/custom-form/composables/useFormField'
import {
  CONTROL_BASE,
  CONTROL_ERROR,
  CONTROL_OK,
  PLACEHOLDER,
  LABEL_ABOVE,
  FLOATING_TEXTAREA,
  TEXTAREA_SIZES,
  DESC,
  ERR,
  type FieldSize,
  type LabelPlacement
} from '~/modules/custom-form/ui/fieldTokens'

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    modelValue?: string | null
    rules?: Rule[]
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
    rows?: number
    maxlength?: number | string
    minlength?: number | string
    realtimeMs?: number
  }>(),
  {
    size: 'md',
    modelValue: '',
    labelPlacement: 'above',
    rules: () => [],
    validateOn: ValidateOn.Submit,
    rows: 4
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | null): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'focus', ev: FocusEvent): void
}>()

const uid = Math.random().toString(36).slice(2)
const baseId = computed(() => props.id ?? `${props.name ?? 'cf-textarea'}-${uid}`)
const errorId = computed(() => `${baseId.value}-err`)
const descId = computed(() => `${baseId.value}-desc`)

const el = ref<HTMLTextAreaElement | null>(null)
const {
  error: ruleError,
  onInputValidate,
  onBlurValidate
} = useFormField(baseId.value, toRef(props, 'modelValue') as any, props.rules, {
  nativeEl: el as any,
  nativeMessages: true,
  validateOn: props.validateOn,
  realtimeMs: props.realtimeMs
})

const computedError = computed<string | null>(() => props.error ?? ruleError.value ?? null)

const describedBy = computed<string | undefined>(
  () =>
    (
      [props.description && descId.value, computedError.value && errorId.value].filter(
        Boolean
      ) as string[]
    ).join(' ') || undefined
)

const controlCls = computed(() =>
  [
    CONTROL_BASE,
    PLACEHOLDER,
    TEXTAREA_SIZES[props.size].control,
    'resize-y',
    computedError.value ? CONTROL_ERROR : CONTROL_OK
  ].join(' ')
)

const floatLabelCls = computed(() =>
  [
    FLOATING_TEXTAREA,
    TEXTAREA_SIZES[props.size].label,
    TEXTAREA_SIZES[props.size].floatLabel || ''
  ].join(' ')
)
</script>

<style src="~/modules/custom-form/ui/field-colors.css"></style>
