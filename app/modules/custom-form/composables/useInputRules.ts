import type { Rule } from '~/modules/custom-form/types'

export function useInputRules() {
  const required: Rule = v => (v != null && String(v).trim() !== '') || 'Required'
  const email: Rule = v =>
    (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? true : 'Invalid email')
  const minLength = (n: number): Rule => v =>
    (String(v ?? '').length >= n) || `Min ${n} chars`
  const onlyLetters: Rule = v =>
    (/^[\p{L}\s'-]+$/u.test(String(v)) ? true : 'Letters only')
  const phoneDigits: Rule = v =>
    (/^\+?[0-9]{1,20}$/.test(String(v)) ? true : 'Digits only, up to 20')

  return { required, email, minLength, onlyLetters, phoneDigits }
}
