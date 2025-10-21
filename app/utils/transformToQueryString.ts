export type QueryParams = Record<string, string | number | boolean | null | undefined>

export function transformToQueryString(obj: QueryParams = {}) {
  const filtered = Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== '')
  const normalized = filtered.map(([k, v]) => [k, String(v)]) as [string, string][]
  const qs = new URLSearchParams(normalized).toString()
  return qs ? `?${qs}` : ''
}
