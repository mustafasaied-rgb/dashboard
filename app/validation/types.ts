

export type RuleContext = {
form: Record<string, unknown>
name: string
}
export type Rule = (value: unknown, ctx: RuleContext) => true | string | Promise<true | string>
export type LegacyRule = (value: unknown) => true | string


export enum ValidateOn {
Input = 'Input',
Blur = 'Blur',
Touched = 'Touched',
Submit = 'Submit',
}


export type Field = {
name: string
rules?: Rule[]
getValue: () => unknown
setError: (msg?: string | null) => void
getError?: () => string | null
reset?: () => void
getDirty?: () => boolean
nativeCheck?: () => string | null
el?: () => HTMLElement | null
}


export type ValidateResult = {
valid: boolean
errors: Record<string, string>
firstInvalidEl: HTMLElement | null
}