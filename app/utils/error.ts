const isStr = (v: unknown): v is string => typeof v === 'string' || v instanceof String
const joinStr = (arr: unknown[]) => arr.filter(isStr).join(', ')

/** Extracts a readable message from $fetch / server error shapes */
export function messageFromError(err: unknown, fallback = 'An unknown error occurred.'): string {
  if (isStr(err)) return err.trim()
  const e = err as any

  // Prefer $fetch/FetchError.data when present
  const data = e?.data ?? e

  // -) Array of strings (e.g., validation errors)
  if (Array.isArray(data)) return joinStr(data)
  if (Array.isArray(data?.errors)) return joinStr(data.errors)

  // -) Object of field -> string|string[]
  if (data?.errors && typeof data.errors === 'object') {
    const parts: string[] = []
    for (const v of Object.values(data.errors as Record<string, unknown>)) {
      if (Array.isArray(v)) parts.push(...(v as unknown[]).filter(isStr))
      else if (isStr(v)) parts.push(v)
    }
    if (parts.length) return parts.join(', ')
  }

  // -) Simple string fields
  for (const v of [data?.message, data?.error, e?.message, data?.statusMessage]) {
    if (isStr(v) && v.trim()) return v.trim()
  }

  return fallback
}
