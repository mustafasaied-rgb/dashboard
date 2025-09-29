export type RuleCtx = { form: Record<string, unknown>; name: string }
export type Rule = (value: unknown, ctx: RuleCtx) => true | string | Promise<true | string>

export enum ValidateOn {
  Input = 'input',
  Blur = 'blur',
  Touched = 'touched',
  Submit = 'submit'
}

export type Field = {
  name: string
  rules?: Rule[]
  getValue: () => unknown
  setError: (msg?: string | null) => void
  getError?: () => string | null
  reset?: () => void
  getDirty?: (() => boolean) | undefined
  nativeCheck?: () => string | null
  el?: () => HTMLElement | null
}
