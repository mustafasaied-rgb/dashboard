// validation/useFormField.ts
import { inject, onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { FKEY } from './constants'
import type { Rule, LegacyRule } from './types'
import { ValidateOn } from './types'

type AnyRule = Rule | LegacyRule
const adaptRule = (r: AnyRule): Rule => (r.length >= 2 ? (r as Rule) : (v) => (r as LegacyRule)(v))

function isEqual(a: any, b: any) {
  if (Object.is(a, b)) return true
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

export function useFormField(
  name: string,
  model: Ref<any>,
  rules: AnyRule[] = [],
  opts?: {
    nativeEl?: Ref<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>
    nativeMessages?: boolean
    validateOn?: ValidateOn
    realtimeMs?: number
  }
) {
  const form = inject(FKEY, null)
  const error = ref<string | null>(null)
  const touched = ref(false)

  const initial = ref(model.value)
  const dirty = ref(false)
  watch(
    model,
    (v) => {
      dirty.value = !isEqual(v, initial.value)
    },
    { immediate: true }
  )
  function rebaseInitial(next?: unknown) {
    initial.value = next !== undefined ? next : model.value
    dirty.value = !isEqual(model.value, initial.value)
  }

  async function runValidation(): Promise<string | null> {
    if (opts?.nativeMessages) {
      const el = opts?.nativeEl?.value
      if (el && !el.checkValidity()) return el.validationMessage || 'Invalid value'
    }
    const formValues = form?.snapshot?.() ?? {}
    for (const rule of rules.map(adaptRule)) {
      const res = await rule(model.value, { form: formValues, name })
      if (res !== true) return res
    }
    return null
  }

  function resetValidation() {
    error.value = null
    touched.value = false
  }
  function reset() {
    model.value = initial.value
    resetValidation()
    dirty.value = false
  }

  function shouldValidateOnInput() {
    const mode = opts?.validateOn
    if (mode === ValidateOn.Input) return true
    if (mode === ValidateOn.Touched) return touched.value
    if (mode === ValidateOn.Submit) return !!form?.submittedOnce?.value
    return false
  }
  function shouldValidateOnBlur() {
    const mode = opts?.validateOn
    if (mode === ValidateOn.Blur || mode === ValidateOn.Touched) return true
    if (mode === ValidateOn.Submit) return !!form?.submittedOnce?.value
    return false
  }

  async function onBlurValidate() {
    touched.value = true
    if (shouldValidateOnBlur()) {
      error.value = await runValidation()
    }
  }

  let timer: number | undefined
  async function onInputValidate() {
    if (shouldValidateOnInput()) {
      clearTimeout(timer)
      timer = window.setTimeout(async () => {
        error.value = await runValidation()
      }, opts?.realtimeMs ?? 150)
    }
  }

  onMounted(() => {
    form?.register({
      name,
      rules: rules.map(adaptRule),
      getValue: () => model.value,
      setError: (msg?: string | null) => (error.value = msg ?? null),
      getError: () => error.value,
      reset,
      getDirty: () => dirty.value,
      nativeCheck: opts?.nativeMessages
        ? () => {
            const el = opts?.nativeEl?.value
            return el ? (el.checkValidity() ? null : el.validationMessage || 'Invalid value') : null
          }
        : undefined,
      el: () => opts?.nativeEl?.value ?? null
    })
  })
  onBeforeUnmount(() => form?.unregister(name))

  return {
    error,
    touched,
    dirty,
    reset,
    resetValidation,
    rebaseInitial,
    onBlurValidate,
    onInputValidate
  }
}
