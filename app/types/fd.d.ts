import type { ComponentCustomProperties } from 'vue'
import type { FormatDateFn } from '~/plugins/dateFormat'

/**
 * Formats a date using Moment-like tokens and locale-aware month/weekday names.
 *
 * Uses the current locale from nuxt-i18n (defaults to `en` if missing). For Arabic
 * locales (`ar*`), month/weekday names are localized and Latin digits are used.
 *
 * **Supported tokens**
 * `YYYY, YY, MMMM, MMM, MM, M, DD, D, dddd, ddd, dd, HH, H, hh, h, mm, m, ss, s, SSS, A, a, Do`
 *
 * **Presets**
 * `LT, LTS, L, l, LL, ll, LLL, lll, LLLL, llll` (locale-aware)
 *
 * @param dateInput Date, ISO string, or timestamp
 * @param format    Token string or preset (optional, default: `"YYYY-MM-DD HH:mm:ss"`)
 * @returns formatted string
 *
 * @example Quick start
 * ```ts
 * const out = $fd('2025-04-24T15:07:05.123Z', 'YYYY-MM-DD HH:mm:ss')
 * // "2025-04-24 15:07:05"
 * ```
 *
 * @example Assuming
 * ```ts
 * const sampleDate = '2025-04-24T15:07:05.123Z'
 * ```
 *
 * @example Year tokens
 * ```ts
 * $fd(sampleDate, 'YYYY') // → "2025"
 * $fd(sampleDate, 'YY')   // → "25"
 * ```
 *
 * @example Month tokens
 * ```ts
 * $fd(sampleDate, 'MMMM') // → "April"   (en) / "أبريل" (ar)
 * $fd(sampleDate, 'MMM')  // → "Apr"     (en) / "أبريل" (ar)
 * $fd(sampleDate, 'MM')   // → "04"
 * $fd(sampleDate, 'M')    // → "4"
 * ```
 *
 * @example Day tokens
 * ```ts
 * $fd(sampleDate, 'DD')   // → "24"
 * $fd(sampleDate, 'D')    // → "24"
 * $fd(sampleDate, 'Do')   // → "24th" (en) / "24th" (ar; ordinal suffix stays English by default)
 * ```
 *
 * @example Weekday tokens
 * ```ts
 * $fd(sampleDate, 'dddd') // → "Thursday" (en) / "الخميس" (ar)
 * $fd(sampleDate, 'ddd')  // → "Thu"      (en) / "الخ"   (ar)
 * $fd(sampleDate, 'dd')   // → "Th"       (en) / "خ"     (ar)
 * ```
 *
 * @example Hour tokens
 * ```ts
 * $fd(sampleDate, 'HH')   // → "15"
 * $fd(sampleDate, 'H')    // → "15"
 * $fd(sampleDate, 'hh')   // → "03"
 * $fd(sampleDate, 'h')    // → "3"
 * ```
 *
 * @example Minute & second tokens
 * ```ts
 * $fd(sampleDate, 'mm')   // → "07"
 * $fd(sampleDate, 'm')    // → "7"
 * $fd(sampleDate, 'ss')   // → "05"
 * $fd(sampleDate, 's')    // → "5"
 * ```
 *
 * @example Milliseconds & meridiem
 * ```ts
 * $fd(sampleDate, 'SSS')  // → "123"
 * $fd(sampleDate, 'A')    // → "PM"
 * $fd(sampleDate, 'a')    // → "pm"
 * ```
 *
 * @example Composite formats
 * ```ts
 * $fd(sampleDate, 'MM/DD/YYYY')          // → "04/24/2025"
 * $fd(sampleDate, 'DD MMM YYYY')         // → "24 Apr 2025"
 * $fd(sampleDate, 'dddd, Do MMMM YYYY')  // → "Thursday, 24th April 2025"
 * $fd(sampleDate, 'YYYY-MM-DD HH:mm:ss') // → "2025-04-24 15:07:05"
 * ```
 *
 * @example Presets (locale-aware)
 * ```ts
 * $fd(new Date(), 'LT')   // → "4:43 PM" (en)
 * $fd(new Date(), 'h:mm A') // same as LT (en)
 * $fd(new Date(), 'LTS')  // → "4:43:07 PM"
 * $fd(new Date(), 'LLL')  // → "August 13, 2025 4:43 PM"
 * ```
 *
 * @remarks
 * - For Arabic (`ar`) locale, month/weekday use Arabic names with Latin digits.
 * - Ordinal suffix (`Do`) is English by default; extend the plugin to localize if needed.
 */

declare module '#app' {
  interface NuxtApp {
    /** See {@link FormatDateFn} for usage and examples. */
    $fd: FormatDateFn
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /** See {@link FormatDateFn} for usage and examples. */
    $fd: FormatDateFn
  }
}

export {}
