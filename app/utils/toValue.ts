import { unref, type Ref } from 'vue'

export function _toValue<T>(v: T | Ref<T> | (() => T)): T {
  const tv = (typeof globalThis !== 'undefined' && (globalThis as any).Vue?.toValue) as
    | ((x: any) => any)
    | undefined
  if (typeof tv === 'function') return tv(v)
  return typeof v === 'function' ? (v as () => T)() : unref(v as Ref<T>)
}
