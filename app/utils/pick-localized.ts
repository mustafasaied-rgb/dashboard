import type { Locale } from '~/modules/api/types/common'
export function pickLocalized<TBase extends string>(
  obj: Record<string, unknown> | null | undefined,
  base: TBase,
  locale: Locale
): string | undefined {
  return obj?.[`${base}_${locale}`] as string | undefined
}
