<template>
  <div class="cf-theme w-full font-zarid">
    <!-- ABOVE LABEL -->
    <label v-if="label && labelPlacement === 'above'" :for="baseId" :class="LABEL_ABOVE">
      {{ label }} <span v-if="required" aria-hidden="true" class="text-red-600">*</span>
    </label>

    <div class="relative">
      <select
        ref="el"
        :id="baseId"
        class="peer"
        :class="controlCls"
        :value="(modelValue as any) ?? ''"
        :disabled="disabled"
        :required="required"
        :aria-label="labelPlacement === 'none' ? ariaLabel : undefined"
        :aria-invalid="computedError ? 'true' : undefined"
        :aria-describedby="describedBy"
        :autocomplete="autocomplete"
        @change="onChange"
        @focus="isFocused = true"
        @blur="
          () => {
            isFocused = false
            onBlurValidate()
          }
        "
      >
        <!-- Hidden placeholder option to support "inside" label UX -->
        <option value="" disabled hidden>
          {{ placeholder ?? (labelPlacement === 'inside' ? label : '') }}
        </option>
        <option v-for="opt in normOptions" :key="String(opt.value)" :value="String(opt.value)">
          {{ opt.label }}
        </option>
      </select>

      <!-- Manual floating label for select -->
      <label
        v-if="label && labelPlacement === 'inside'"
        :for="baseId"
        :class="[
          FLOATING_SELECT_BASE,
          isFocused || hasValue ? FLOATING_SELECT_FLOAT : FLOATING_SELECT_CENTER
        ]"
      >
        {{ label }}
      </label>

      <!-- optional chevron/adornment -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="trailing" />
      </div>
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
  LABEL_ABOVE,
  SIZES,
  DESC,
  ERR,
  SELECT_DECORATION,
  FLOATING_SELECT_BASE,
  FLOATING_SELECT_CENTER,
  FLOATING_SELECT_FLOAT,
  type FieldSize,
  type LabelPlacement
} from '~/modules/custom-form/ui/fieldTokens'

type Option = { label: string; value: string | number } | string | number

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    modelValue?: string | number | null
    options: Option[]
    rules?: Rule[]
    validateOn?: ValidateOn
    placeholder?: string
    size?: FieldSize
    disabled?: boolean
    required?: boolean
    error?: string | null
    description?: string | null
    label?: string
    labelPlacement?: LabelPlacement
    ariaLabel?: string
    valueType?: 'string' | 'number'
    autocomplete?: string
    realtimeMs?: number
  }>(),
  {
    modelValue: '',
    rules: () => [],
    validateOn: ValidateOn.Submit,
    size: 'md',
    labelPlacement: 'above',
    valueType: 'string'
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', v: string | number | null): void }>()

const uid = Math.random().toString(36).slice(2)
const baseId = computed(() => props.id ?? `${props.name ?? 'cf-select'}-${uid}`)
const errorId = computed(() => `${baseId.value}-err`)
const descId = computed(() => `${baseId.value}-desc`)

const el = ref<HTMLSelectElement | null>(null)
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
    SIZES[props.size].control, // reuse input sizes (height/padding/typography)
    SELECT_DECORATION,
    computedError.value ? CONTROL_ERROR : CONTROL_OK
  ].join(' ')
)

const normOptions = computed<{ label: string; value: string | number }[]>(() =>
  props.options.map((o) =>
    typeof o === 'object' && o !== null && 'label' in o && 'value' in o
      ? (o as any)
      : { label: String(o), value: o as any }
  )
)

const isFocused = ref(false)
const hasValue = computed(
  () => props.modelValue !== null && props.modelValue !== '' && props.modelValue !== undefined
)

function onChange(e: Event) {
  const raw = (e.target as HTMLSelectElement).value
  const v =
    props.valueType === 'number' ? (raw === '' ? null : Number(raw)) : raw === '' ? null : raw
  emit('update:modelValue', v as any)
  onInputValidate()
}
</script>

<style src="~/modules/custom-form/ui/field-colors.css"></style>
