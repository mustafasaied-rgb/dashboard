// validation/constants.ts
 import type { Field } from './types'


export const FKEY: InjectionKey<{
register: (field: Field) => void
unregister: (name: Field['name']) => void
snapshot: () => Record<string, unknown>
submittedOnce: { value: boolean }
}> = Symbol('AppFormCtx')