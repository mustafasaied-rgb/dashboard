// plugins/fd.ts
import { defineNuxtPlugin } from '#app'
import type { InjectionKey, Ref } from 'vue'

export type FormatToken =
  // presets
  | 'LT' | 'LTS' | 'L' | 'l' | 'LL' | 'll' | 'LLL' | 'lll' | 'LLLL' | 'llll'
  // base
  | 'Do' | 'YYYY' | 'YY' | 'MMMM' | 'MMM' | 'MM' | 'M'
  | 'DD' | 'D' | 'dddd' | 'ddd' | 'dd'
  | 'HH' | 'H' | 'hh' | 'h'
  | 'mm' | 'm' | 'ss' | 's' | 'SSS'
  | 'A' | 'a'

export type FormatDateFn = (dateInput: Date | string | number| null | undefined, format?: string) => string
export const fdKey: InjectionKey<FormatDateFn> = Symbol('fd')
  
export default defineNuxtPlugin((nuxtApp) => {
  // Try to read locale from nuxt-i18n if available
  const localeRef = (nuxtApp.$i18n as unknown as { locale?: Ref<string> } | undefined)?.locale

  const getMonthName = (date: Date, loc = localeRef?.value ?? 'en', length: 'long' | 'short' | 'narrow' = 'short'): string =>
    new Intl.DateTimeFormat(loc, {
      month: length,
      ...(loc.startsWith('ar') && { numberingSystem: 'latn' })
    }).format(date)

  const getWeekdayName = (date: Date, loc = localeRef?.value ?? 'en', length: 'long' | 'short' | 'narrow' = 'long'): string =>
    new Intl.DateTimeFormat(loc, {
      weekday: length,
      ...(loc.startsWith('ar') && { numberingSystem: 'latn' })
    }).format(date)

  const ordinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'] as const
    const v = n % 100
    // basic English ordinals; customize per-locale if needed
    return `${n}${(s as unknown as string[])[(v - 20) % 10] || (s as unknown as string[])[v] || s[0]}`
  }

  const formatDate: FormatDateFn = (dateInput, format = 'YYYY-MM-DD HH:mm:ss') => {
    const date = dateInput instanceof Date
      ? dateInput
      : new Date(String(dateInput).replace(/\.\d+Z$/, 'Z')) // normalize 2025-01-01T00:00:00.000Z → .000Z
    if (Number.isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const monthN = date.getMonth() + 1
    const day = date.getDate()
    const hour24 = date.getHours()
    const hour12 = hour24 % 12 || 12
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const ms = date.getMilliseconds()

    const loc = (localeRef?.value ?? 'en') as string
    const isAr = loc.toLowerCase().startsWith('ar')

    const meridiem = (h: number, lower = false): string => {
      if (isAr) return 'صم'.charAt(h < 12 ? 0 : 1) // "ص" / "م"
      const v = h < 12 ? 'AM' : 'PM'
      return lower ? v.toLowerCase() : v
    }

    // Base tokens
    const baseTokens: Record<Extract<FormatToken,
      'Do'|'YYYY'|'YY'|'MMMM'|'MMM'|'MM'|'M'|
      'DD'|'D'|'dddd'|'ddd'|'dd'|
      'HH'|'H'|'hh'|'h'|'mm'|'m'|'ss'|'s'|'SSS'|'A'|'a'
    >, string> = {
      YYYY: String(year),
      YY: String(year).slice(-2),

      MMMM: getMonthName(date, loc, 'long'),
      MMM: getMonthName(date, loc, 'short'),
      MM: String(monthN).padStart(2, '0'),
      M: String(monthN),

      DD: String(day).padStart(2, '0'),
      D: String(day),

      dddd: getWeekdayName(date, loc, 'long'),
      ddd: getWeekdayName(date, loc, 'short'),
      dd: getWeekdayName(date, loc, 'narrow'),

      HH: String(hour24).padStart(2, '0'),
      H: String(hour24),

      hh: String(hour12).padStart(2, '0'),
      h: String(hour12),

      mm: String(minute).padStart(2, '0'),
      m: String(minute),

      ss: String(second).padStart(2, '0'),
      s: String(second),

      SSS: String(ms).padStart(3, '0'),

      A: meridiem(hour24, false),
      a: meridiem(hour24, true),

      Do: ordinal(day)
    }

    // Moment-like presets per locale
    const presets = (isAr
      ? {
          LT: 'h:mm a',
          LTS: 'h:mm:ss a',
          L: 'DD/MM/YYYY',
          l: 'D/M/YYYY',
          LL: 'D MMMM YYYY',
          ll: 'D MMM YYYY',
          LLL: 'D MMMM YYYY h:mm a',
          lll: 'D MMM YYYY h:mm a',
          LLLL: 'dddd، D MMMM YYYY h:mm a',
          llll: 'ddd، D MMM YYYY h:mm a'
        }
      : {
          LT: 'h:mm A',
          LTS: 'h:mm:ss A',
          L: 'MM/DD/YYYY',
          l: 'M/D/YYYY',
          LL: 'MMMM D, YYYY',
          ll: 'MMM D, YYYY',
          LLL: 'MMMM D, YYYY h:mm A',
          lll: 'MMM D, YYYY h:mm A',
          LLLL: 'dddd, MMMM D, YYYY h:mm A',
          llll: 'ddd, MMM D, YYYY h:mm A'
        }) as Record<Extract<FormatToken,
          'LT'|'LTS'|'L'|'l'|'LL'|'ll'|'LLL'|'lll'|'LLLL'|'llll'
        >, string>

    // Expand presets using base tokens
    const BASE_TOKEN_RE = /Do|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|HH|H|hh|h|mm|m|ss|s|SSS|A|a/g
    const expandedPresets = Object.fromEntries(
      Object.entries(presets).map(([k, pattern]) => [
        k,
        pattern.replace(BASE_TOKEN_RE, (m) => (baseTokens as Record<string, string>)[m] ?? m)
      ])
    ) as Record<Extract<FormatToken,'LT'|'LTS'|'L'|'l'|'LL'|'ll'|'LLL'|'lll'|'LLLL'|'llll'>, string>

    // Merge all tokens
    const tokens: Partial<Record<FormatToken, string>> = { ...baseTokens, ...expandedPresets }

    // Build longest-first regex to avoid partial overlaps
    const ALL_TOKENS = [
      'LLLL','llll','LLL','lll','LL','ll','LTS','LT','L','l',
      'Do','YYYY','YY','MMMM','MMM','MM','M','DD','D','dddd','ddd','dd',
      'HH','H','hh','h','mm','m','ss','s','SSS','A','a'
    ] as const satisfies readonly FormatToken[]

    const TOKEN_RE = new RegExp(ALL_TOKENS.join('|'), 'g')

    return format.replace(TOKEN_RE, (matched) => (tokens[matched as FormatToken] ?? matched))
  }


  return {
    provide: {
      fd: formatDate
    }
  }
})
