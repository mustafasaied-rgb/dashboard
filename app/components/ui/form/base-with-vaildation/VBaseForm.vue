<template>
  <form novalidate v-bind="$attrs"><slot /></form>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import type { Field, ValidateResult } from '~/modules/form-elements/types'
import { FKEY } from '~/modules/form-elements/constants'

const fields = new Map<string, Field>()
const submittedOnce = ref(false)

function register(field: Field) {
  fields.set(field.name, field)
}
function unregister(name: Field['name']) {
  fields.delete(name)
}

function snapshot() {
  const formValues: Record<string, unknown> = {}
  fields.forEach((f, n) => (formValues[n] = f.getValue()))
  return formValues
}

async function validate(): Promise<ValidateResult> {
  submittedOnce.value = true
  const formValues = snapshot()
  const errors: Record<string, string> = {}
  let firstInvalidEl: HTMLElement | null = null

  for (const [name, field] of fields) {
    // 1) Native validity (if enabled)
    const nativeMsg = field.nativeCheck?.() ?? null
    if (nativeMsg) {
      field.setError(nativeMsg)
      errors[name] = nativeMsg
      if (!firstInvalidEl) firstInvalidEl = field.el?.() ?? null
      continue
    }

    // 2) Rules (first failing wins)
    let message: string | null = null
    for (const rule of field.rules || []) {
      const res = await rule(formValues[name], { form: formValues, name })
      if (res !== true) {
        message = res as string
        break
      }
    }
    field.setError(message)
    if (message) {
      errors[name] = message
      if (!firstInvalidEl) firstInvalidEl = field.el?.() ?? null
    }
  }

  return { valid: Object.keys(errors).length === 0, errors, firstInvalidEl }
}

function reset() {
  fields.forEach((f) => f?.reset?.())
  submittedOnce.value = false
}
function resetValidation() {
  fields.forEach((f) => f.setError(null))
  submittedOnce.value = false
}
function focusFirstInvalid(target?: HTMLElement | null) {
  const el = target ?? [...fields.values()].map((f) => f.el?.() ?? null).find(Boolean) ?? null
  el?.focus?.()
  el?.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
}

const formCtxValue = { register, unregister, snapshot, submittedOnce }
provide(FKEY, formCtxValue)

const appFormExpose = { validate, reset, resetValidation, focusFirstInvalid }
defineExpose(appFormExpose)
export type AppFormExpose = typeof appFormExpose
</script>
