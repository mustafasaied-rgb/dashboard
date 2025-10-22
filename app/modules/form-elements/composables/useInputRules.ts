import type { Rule } from '../types'
import { useI18n } from 'vue-i18n'

export function useInputRules() {
  const { t } = useI18n()
  return {
    required: ((v) => {
      if (v === null || v === undefined) return t('validation.required')
      if (typeof v === 'string' && v.trim() === '') return t('validation.required')
      if (Array.isArray(v) && v.length === 0) return t('validation.required')
      return true
    }) as Rule,

    email: ((v) => {
      if (!v) return true
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(String(v)) || t('validation.email')
    }) as Rule,

    minLength:
      (n: number): Rule =>
      (v) => {
        if (!v) return true
        return String(v).length >= n || t('validation.minLength', { n })
      },

    maxLength:
      (n: number): Rule =>
      (v) => {
        if (!v) return true
        return String(v).length <= n || t('validation.maxLength', { n })
      },

    pattern:
      (re: RegExp, msg = t('validation.pattern')): Rule =>
      (v) =>
        !v ? true : re.test(String(v)) || msg,

    phoneDigits: ((v) =>
      !v ? true : /^\+?[0-9\s()-]{7,20}$/.test(String(v)) || t('validation.phoneDigits')) as Rule,

    asyncUnique:
      (check: (v: unknown) => Promise<boolean>, message = t('validation.asyncUnique')): Rule =>
      async (v) => {
        if (!v) return true
        const ok = await check(v)
        return ok ? true : message
      },

    maxFiles: (limit: number) => (v: File[]) =>
      !v || v.length <= limit || t('validation.maxFiles', { limit }),

    maxFileSize: (limitMB: number) => (v: File[]) => {
      if (!v || !v.length) return true
      const tooLarge = v.some((file) => file.size > limitMB * 1024 * 1024)
      return tooLarge ? t('validation.maxFileSize', { limitMB }) : true
    }
  }
}
