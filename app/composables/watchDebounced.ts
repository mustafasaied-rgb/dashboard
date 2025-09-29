import {
  watch,
  type WatchCallback,
  type WatchOptions,
  type WatchSource,
  type WatchStopHandle
} from 'vue'

type FlushMode = 'pre' | 'post' | 'sync'

export interface WatchDebouncedOptions<Immediate extends Readonly<boolean> | boolean = false>
  extends Omit<WatchOptions<Immediate>, 'flush'> {
  /**
   * Delay in milliseconds before invoking the callback after changes settle.
   * Default: 0 (no debounce)
   */
  debounce?: number
  /**
   * If true, call the callback immediately on the first change.
   * Default: false
   */
  leading?: boolean
  /**
   * If true, call the callback after the debounce period with the latest args.
   * Default: true
   */
  trailing?: boolean
  /**
   * Maximum time in ms to delay; ensures the callback runs at least this often.
   * Default: undefined (no maxWait)
   */
  maxWait?: number
  /**
   * Forwarded to Vue's watch() option.
   */
  flush?: FlushMode
}

type DebouncedExtras = {
  /** Immediately invoke pending callback with latest args, if any. */
  flush: () => void
  /** Cancel any scheduled invocation. */
  cancel: () => void
  /** Whether a debounced call is currently pending. */
  isPending: () => boolean
}

/**
 * A tiny wrapper around `watch` that debounces the callback.
 *
 * NOTE: signature intentionally accepts mixed/heterogeneous watch arrays to be ergonomic
 * for callers like: watchDebounced([search, perPage, () => ({ ...filterParams })], ...)
 */
export function watchDebounced(
  source: WatchSource<any> | WatchSource<any>[] | any | any[],
  cb: WatchCallback<any, any>,
  options: WatchDebouncedOptions = {}
): WatchStopHandle & DebouncedExtras {
  const {
    debounce = 0,
    leading = false,
    trailing = true,
    maxWait,
    immediate,
    deep,
    flush
  } = options

  type Timer = ReturnType<typeof setTimeout> | null
  let timer: Timer = null
  let maxTimer: Timer = null
  let lastArgs: Parameters<typeof cb> | null = null
  let pending = false
  let didLead = false

  const clearTimers = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (maxTimer) {
      clearTimeout(maxTimer)
      maxTimer = null
    }
  }

  const invoke = () => {
    // trailing call
    if (trailing && lastArgs) cb(...lastArgs)
    lastArgs = null
    pending = false
    didLead = false
    clearTimers()
  }

  const schedule = (...args: Parameters<typeof cb>) => {
    lastArgs = args
    pending = true

    if (!didLead && leading) {
      // leading edge call
      didLead = true
      cb(...args)
      // still set up trailing if trailing===true — mirrors lodash behavior
    }

    // (re)schedule trailing
    if (debounce > 0) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(invoke, debounce)
    } else {
      // No debounce delay: just invoke immediately unless we already did leading-only
      // If leading && !trailing, we already called above; otherwise call now.
      if (!leading || trailing) invoke()
    }

    // schedule maxWait once per burst
    if (maxWait != null && maxWait > 0 && !maxTimer) {
      maxTimer = setTimeout(() => {
        // flush immediately when maxWait hits
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        invoke()
      }, maxWait)
    }
  }

  const stop = watch(
    // Vue accepts arrays: refs, getters, or reactive objects.
    // We forward as-is.
    source as any,
    (...args) => schedule(...args),
    { immediate: immediate as any, deep, flush }
  )

  const wrappedStop = (() => {
    stop()
    clearTimers()
    lastArgs = null
    pending = false
  }) as WatchStopHandle & DebouncedExtras

  // attach extras
  ;(wrappedStop as any).flush = () => {
    if (pending) invoke()
  }
  ;(wrappedStop as any).cancel = () => {
    clearTimers()
    lastArgs = null
    pending = false
    didLead = false
  }
  ;(wrappedStop as any).isPending = () => pending

  return wrappedStop
}
