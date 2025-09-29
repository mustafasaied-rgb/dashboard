import { inject, onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { ValidateOn, type Rule } from '~/modules/custom-form/types'
import { FKEY } from '~/modules/custom-form/constants'

type LegacyRule = (value: unknown) => true | string
type AnyRule = Rule | LegacyRule
const adaptRule = (r: AnyRule): Rule => (r.length >= 2 ? (r as Rule) : (v) => (r as LegacyRule)(v))

// shallow+JSON fallback equality good enough for typical form data
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

  // --- DIRTY TRACKING ---
  // snapshot initial (whatever model is *now*)
  const initial = ref(model.value)
  const dirty = ref(false)

  // keep dirty in sync vs initial
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

  // --- VALIDATION ---
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
    // after first submit, start validating reactively even if mode === Submit
    if (mode === ValidateOn.Submit) return !!form?.submittedOnce?.value
    return false
  }
  function shouldValidateOnBlur() {
    const mode = opts?.validateOn
    if (mode === ValidateOn.Blur || mode === ValidateOn.Touched) return true
    // after first submit, also validate on blur for Submit mode
    if (mode === ValidateOn.Submit) return !!form?.submittedOnce?.value
    return false
  }

  async function onBlurValidate() {
    touched.value = true
    if (shouldValidateOnBlur()) {
      const msg = await runValidation()
      error.value = msg
    }
  }

  let timer: number | undefined
  async function onInputValidate() {
    if (shouldValidateOnInput()) {
      clearTimeout(timer)
      timer = window.setTimeout(async () => {
        const msg = await runValidation()
        error.value = msg
      }, opts?.realtimeMs ?? 150)
    }
  }

  // --- REGISTER WITH FORM ---
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
    // state
    error,
    touched,
    dirty,
    // actions
    reset,
    resetValidation,
    rebaseInitial,
    // event helpers
    onBlurValidate,
    onInputValidate
  }
}
