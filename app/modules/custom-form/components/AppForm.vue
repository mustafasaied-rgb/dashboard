<template>
  <form novalidate @submit.prevent="$emit('submit', $event)"><slot /></form>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import type { Field } from '~/modules/custom-form/types'
import { FKEY } from '~/modules/custom-form/constants'

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

async function validate() {
  submittedOnce.value = true
  const formValues = snapshot()
  const errors: Record<string, string> = {}
  let firstInvalidEl: HTMLElement | null = null

  for (const [name, field] of fields) {
    // 1) use native validity first if provided
    const nativeMsg = field.nativeCheck?.() ?? null
    if (nativeMsg) {
      field.setError(nativeMsg)
      errors[name] = nativeMsg
      if (!firstInvalidEl) firstInvalidEl = (field.el?.() ?? null) as HTMLElement | null
      continue
    }

    // 2) run custom rules (first failing wins)
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
      if (!firstInvalidEl) firstInvalidEl = (field.el?.() ?? null) as HTMLElement | null
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstInvalidEl
  }
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
  const el =
    target ?? [...fields.values()].map((f) => f.el?.() as HTMLElement | null).find(Boolean) ?? null
  if (el?.focus) {
    el.focus()
    el.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
  }
}

const formCtxValue = { register, unregister, snapshot, submittedOnce }
provide(FKEY, formCtxValue)
export type FormCtx = typeof formCtxValue

const appFormExpose = { validate, reset, resetValidation, focusFirstInvalid }
defineExpose(appFormExpose)
export type AppFormExpose = typeof appFormExpose
</script>
