import { getCurrentInstance } from 'vue'
import { useAsyncData, useRoute } from '#imports'
import type { AsyncData, AsyncDataOptions, NuxtApp } from 'nuxt/app'
import { applyPolicyOrThrow } from '~/modules/api/utils/api-error-policy'

type Handler<T> = (ctx?: NuxtApp) => Promise<T>

const callCounter = new WeakMap<object, number>()

function makeAutoKey() {
  const inst = getCurrentInstance()
  const name = (inst as any)?.type?.__name || (inst as any)?.type?.name || 'comp'
  let path = '/'
  try {
    path = useRoute().fullPath || '/'
  } catch {}
  const idx = inst ? (callCounter.get(inst) ?? 0) + 1 : 1
  if (inst) callCounter.set(inst, idx)
  return `apiAD:${name}:${path}:${idx}`
}

export function useApiAsyncData<T, E = any>(
  handler: Handler<T>,
  options?: AsyncDataOptions<T>
): Promise<AsyncData<T, E>>
export function useApiAsyncData<T, E = any>(
  key: string | (() => string),
  handler: Handler<T>,
  options?: AsyncDataOptions<T>
): Promise<AsyncData<T, E>>

export async function useApiAsyncData<T, E = any>(...args: any[]) {
  let key: string
  let handler: Handler<T>
  let options: AsyncDataOptions<T> | undefined

  const keyed = args.length >= 2 && typeof args[1] === 'function'
  if (keyed) {
    key = typeof args[0] === 'function' ? (args[0] as () => string)() : String(args[0])
    handler = args[1]
    options = args[2]
  } else {
    key = makeAutoKey()
    handler = args[0]
    options = args[1]
  }

   const res = await useAsyncData<T>(key, handler, options)

  if (res.error.value) applyPolicyOrThrow(res.error.value)
  return res as AsyncData<T, E>
}
