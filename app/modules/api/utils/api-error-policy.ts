import { createError } from '#app'

export function getStatus(e: any): number | undefined {
  return e?.statusCode ?? e?.status ?? e?.response?.status
}

// decide what to do per status
export function applyPolicyOrThrow(e: any): never | void {
  const status = getStatus(e)

  if (status === 404 || status === 403) {
    // flip app into full-screen error; your /error.vue can redirect to home
    throw createError({
      statusCode: status,
      statusMessage: e?.statusMessage || e?.message || 'Request failed',
      data: e?.data ?? e?.response?._data,
      fatal: true
    })
  }

  // 401 → bubble to caller (login flow), others → bubble
}
