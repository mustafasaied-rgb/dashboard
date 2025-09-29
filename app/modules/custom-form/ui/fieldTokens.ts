export type FieldSize = 'sm' | 'md' | 'lg' | 'xl'
export type LabelPlacement = 'above' | 'inside' | 'none'

export const CONTROL_BASE = [
  'block w-full rounded-[12px] border border-transparent',
  'bg-[var(--cf-bg)] text-[var(--cf-fg)]',
  'focus:outline-none focus:bg-[var(--cf-bg-focus)] focus:border-[var(--cf-border-focus)]',
  '[&:not(:placeholder-shown)]:bg-[var(--cf-bg-active)]',
  '[&:not(:placeholder-shown)]:border-[var(--cf-border-active)]',
  'disabled:cursor-not-allowed disabled:opacity-60'
].join(' ')

export const PLACEHOLDER = 'placeholder:text-[var(--cf-placeholder)]'

export const CONTROL_ERROR = [
  'border-[var(--cf-error)]',
  'focus:border-[var(--cf-error)]',
  'focus:ring-[var(--cf-error)]'
].join(' ')

export const CONTROL_OK = 'border-[var(--cf-border)]'

export const LABEL_ABOVE = 'mb-1 block text-[var(--cf-fg)] text-[20px] leading-[150%] font-[400]'
/** Floating label for inputs */
export const FLOATING_COMMON = [
  'pointer-events-none absolute start-[16px] top-1/2 -translate-y-1/2 bg-transparent px-0',
  'text-[var(--cf-placeholder)]',
  'transition-all duration-150',
  'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0',
  'peer-focus:-top-3 peer-focus:start-[6px] peer-focus:translate-y-0 peer-focus:bg-[var(--cf-bg-focus)]',
  'peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:start-[6px] peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:bg-[var(--cf-bg-active)]'
].join(' ')
/** Floating label tuned for textarea (start a bit lower, float a bit up) */
export const FLOATING_TEXTAREA = [
  'pointer-events-none absolute start-[16px] top-3 bg-transparent px-0',
  'text-[var(--cf-placeholder)]',
  'transition-all duration-150',
  'peer-focus:-top-2 peer-focus:start-[6px] peer-focus:bg-[var(--cf-bg-focus)]',
  'peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:start-[6px] peer-[&:not(:placeholder-shown)]:bg-[var(--cf-bg-active)]'
].join(' ')

export const SIZES: Record<FieldSize, { control: string; label: string; floatLabel?: string }> = {
  sm: { control: 'h-9 px-3 text-sm', label: 'text-[20px] font-[400]' },
  md: { control: 'h-10 px-3.5 text-sm', label: 'text-[20px] font-[400]' },
  lg: { control: 'h-12 px-4 text-base', label: 'text-[20px] font-[400]' },
  xl: {
    control: 'h-[50px] px-[19px] text-[20px] font-[300] leading-[150%]',
    label: 'text-[20px] font-[300] leading-[150%]',
    floatLabel: [
      'peer-focus:text-base peer-focus:!px-[10px] peer-focus:!py-[0px]',
      'peer-[&:not(:placeholder-shown)]:text-base peer-[&:not(:placeholder-shown)]:!px-[10px] peer-[&:not(:placeholder-shown)]:!py-[0px]'
    ].join(' ')
  }
}
/** Textarea sizes (no fixed height; add vertical padding) */
export const TEXTAREA_SIZES: Record<
  FieldSize,
  { control: string; label: string; floatLabel?: string }
> = {
  sm: { control: 'px-3 py-2 text-sm', label: 'text-[20px] font-[400]' },
  md: { control: 'px-3.5 py-2.5 text-sm', label: 'text-[20px] font-[400]' },
  lg: { control: 'px-4 py-3 text-base', label: 'text-[20px] font-[400]' },
  xl: {
    control: 'px-[19px] py-3 text-[20px] font-[300] leading-[150%]',
    label: 'text-[20px] font-[300] leading-[150%]',
    floatLabel: [
      'peer-focus:text-base peer-focus:!px-[10px] peer-focus:!py-[0px]',
      'peer-[&:not(:placeholder-shown)]:text-base peer-[&:not(:placeholder-shown)]:!px-[10px] peer-[&:not(:placeholder-shown)]:!py-[0px]'
    ].join(' ')
  }
}

export const SELECT_DECORATION = 'appearance-none'
/** Floating label for native <select> (manual; select has no placeholder) */
export const FLOATING_SELECT_BASE =
  'pointer-events-none absolute left-4 text-[var(--cf-placeholder)] transition-all duration-150'

export const FLOATING_SELECT_CENTER = 'top-1/2 -translate-y-1/2'
export const FLOATING_SELECT_FLOAT  = '-top-3 left-2 bg-[var(--cf-bg-focus)] px-1 text-xs'

export const DESC = 'mt-1 text-xs text-[var(--cf-desc)]'
export const ERR = 'mt-1 text-xs text-[var(--cf-err)]'
