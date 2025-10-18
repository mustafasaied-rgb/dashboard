// validation/useInputRules.ts
import type { Rule } from './types'

export function useInputRules() {
  return {
    required: ((v) => {
      if (v === null || v === undefined) return 'This field is required'
      if (typeof v === 'string' && v.trim() === '') return 'This field is required'
      if (Array.isArray(v) && v.length === 0) return 'This field is required'
      return true
    }) as Rule,

    email: ((v) => {
      if (!v) return true
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(String(v)) || 'Enter a valid email'
    }) as Rule,

    minLength:
      (n: number): Rule =>
      (v) => {
        if (!v) return true
        return String(v).length >= n || `Must be at least ${n} characters`
      },

    maxLength:
      (n: number): Rule =>
      (v) => {
        if (!v) return true
        return String(v).length <= n || `Must be at most ${n} characters`
      },

    pattern:
      (re: RegExp, msg = 'Invalid format'): Rule =>
      (v) =>
        !v ? true : re.test(String(v)) || msg,

    phoneDigits: ((v) =>
      !v ? true : /^\+?[0-9\s()-]{7,20}$/.test(String(v)) || 'Enter a valid phone number') as Rule,

    asyncUnique:
      (check: (v: unknown) => Promise<boolean>, message = 'Already taken'): Rule =>
      async (v) => {
        if (!v) return true
        const ok = await check(v)
        return ok ? true : message
      },
    maxFiles: (limit: number) => (v: File[]) =>
      !v || v.length <= limit || `You can upload up to ${limit} file(s)`,

    maxFileSize: (limitMB: number) => (v: File[]) => {
      if (!v || !v.length) return true
      const tooLarge = v.some((file) => file.size > limitMB * 1024 * 1024)
      return tooLarge ? `Each file must be under ${limitMB} MB` : true
    }
  }
}
// import type { Rule } from '~/modules/custom-form/types'

// export function useInputRules() {
//   const required: Rule = v => (v != null && String(v).trim() !== '') || 'Required'
//   const email: Rule = v =>
//     (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) ? true : 'Invalid email')
//   const minLength = (n: number): Rule => v =>
//     (String(v ?? '').length >= n) || `Min ${n} chars`
//   const onlyLetters: Rule = v =>
//     (/^[\p{L}\s'-]+$/u.test(String(v)) ? true : 'Letters only')
//   const phoneDigits: Rule = v =>
//     (/^\+?[0-9]{1,20}$/.test(String(v)) ? true : 'Digits only, up to 20')

//   return { required, email, minLength, onlyLetters, phoneDigits }
// }
