<template>
  <button
    :type="type"
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium transition duration-150 ease-in-out',
      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      ringColorClass, // focus ring color based on color
      baseRadius,
      block ? 'w-full' : '',
      sizeClasses[size],
      colorClasses, // variant + color styles
      { 'cursor-not-allowed opacity-50': disabled || loading }
    ]"
    :aria-busy="loading ? 'true' : undefined"
    :disabled="disabled || loading"
  >
    <!-- leading icon / content -->
    <span v-if="hasStart || startIcon" class="flex items-center" aria-hidden="true">
      <slot name="start">
        <component :is="startIcon" v-if="startIcon" />
      </slot>
    </span>

    <!-- main content -->
    <span class="inline-flex items-center">
      <slot />
      <span
        v-if="loading"
        :class="[
          'ms-1 inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
          spinnerSize[size]
        ]"
      />
    </span>

    <!-- trailing icon / content -->
    <span v-if="hasEnd || endIcon" class="flex items-center" aria-hidden="true">
      <slot name="end">
        <component :is="endIcon" v-if="endIcon" />
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon_sm'
type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
type ButtonColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'gray' | 'dark'

interface ButtonProps {
  size?: ButtonSize
  variant?: ButtonVariant
  color?: ButtonColor
  startIcon?: any
  endIcon?: any
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  rounded?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  variant: 'solid',
  color: 'gray',
  disabled: false,
  loading: false,
  type: 'button',
  rounded: false,
  block: false
})

const slots = useSlots()
const hasStart = computed(() => !!slots.start)
const hasEnd = computed(() => !!slots.end)

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
  icon: 'h-11 w-11 p-0',
  icon_sm: 'h-7 w-7 p-0'
}

const spinnerSize: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4.5 w-4.5',
  icon: 'h-4 w-4',
  icon_sm: 'h-3 w-3'
}

const baseRadius = computed(() => (props.rounded ? 'rounded-full' : 'rounded-lg'))

/**
 * color tokens mirror your Badge palette:
 * - brand-* for primary
 * - success-*, error-*, warning-*, blue-light-* for info
 * - gray-* / dark variants
 */
const variants = {
  solid: {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300 dark:text-white',
    success:
      'bg-success-500 text-white hover:bg-success-600 disabled:bg-success-300 dark:text-white',
    error: 'bg-error-500 text-white hover:bg-error-600 disabled:bg-error-300 dark:text-white',
    warning:
      'bg-warning-500 text-white hover:bg-warning-600 disabled:bg-warning-300 dark:text-white',
    info: 'bg-blue-light-500 text-white hover:bg-blue-light-600 disabled:bg-blue-light-300 dark:text-white',
    gray: 'bg-gray-700 text-white hover:bg-gray-800 disabled:bg-gray-400 dark:text-white',
    dark: 'bg-black text-white hover:bg-black/90 disabled:bg-black/60 dark:bg-white/10 dark:text-white'
  },
  outline: {
    primary:
      'bg-transparent text-brand-600 ring-1 ring-inset ring-brand-300 hover:bg-brand-50 dark:text-brand-400 dark:ring-brand-800/60 dark:hover:bg-brand-500/10',
    success:
      'bg-transparent text-success-600 ring-1 ring-inset ring-success-300 hover:bg-success-50 dark:text-success-500 dark:ring-success-800/60 dark:hover:bg-success-500/10',
    error:
      'bg-transparent text-error-600 ring-1 ring-inset ring-error-300 hover:bg-error-50 dark:text-error-500 dark:ring-error-800/60 dark:hover:bg-error-500/10',
    warning:
      'bg-transparent text-warning-600 ring-1 ring-inset ring-warning-300 hover:bg-warning-50 dark:text-orange-400 dark:ring-warning-800/60 dark:hover:bg-warning-500/10',
    info: 'bg-transparent text-blue-light-600 ring-1 ring-inset ring-blue-light-300 hover:bg-blue-light-50 dark:text-blue-light-500 dark:ring-blue-light-800/60 dark:hover:bg-blue-light-500/10',
    gray: 'bg-transparent text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-white/[0.03]',
    dark: 'bg-transparent text-white ring-1 ring-inset ring-white/20 hover:bg-white/5'
  },
  ghost: {
    primary:
      'bg-transparent text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10',
    success:
      'bg-transparent text-success-600 hover:bg-success-50 dark:text-success-500 dark:hover:bg-success-500/10',
    error:
      'bg-transparent text-error-600 hover:bg-error-50 dark:text-error-500 dark:hover:bg-error-500/10',
    warning:
      'bg-transparent text-warning-600 hover:bg-warning-50 dark:text-orange-400 dark:hover:bg-warning-500/10',
    info: 'bg-transparent text-blue-light-600 hover:bg-blue-light-50 dark:text-blue-light-500 dark:hover:bg-blue-light-500/10',
    gray: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/[0.03]',
    dark: 'bg-transparent text-white hover:bg-white/10'
  },
  link: {
    primary:
      'bg-transparent text-brand-600 underline underline-offset-4 hover:opacity-80 dark:text-brand-400',
    success:
      'bg-transparent text-success-600 underline underline-offset-4 hover:opacity-80 dark:text-success-500',
    error:
      'bg-transparent text-error-600 underline underline-offset-4 hover:opacity-80 dark:text-error-500',
    warning:
      'bg-transparent text-warning-600 underline underline-offset-4 hover:opacity-80 dark:text-orange-400',
    info: 'bg-transparent text-blue-light-600 underline underline-offset-4 hover:opacity-80 dark:text-blue-light-500',
    gray: 'bg-transparent text-gray-700 underline underline-offset-4 hover:opacity-80 dark:text-gray-300',
    dark: 'bg-transparent text-white underline underline-offset-4 hover:opacity-80'
  }
} as const

const colorClasses = computed(() => variants?.[props.variant]?.[props.color])

// focus ring matches intent color (falls back to brand if not found)
const ringMap: Record<ButtonColor, string> = {
  primary: 'focus-visible:ring-brand-500/50 dark:focus-visible:ring-brand-400/40',
  success: 'focus-visible:ring-success-500/40',
  error: 'focus-visible:ring-error-500/40',
  warning: 'focus-visible:ring-warning-500/40',
  info: 'focus-visible:ring-blue-light-500/40',
  gray: 'focus-visible:ring-gray-400/40 dark:focus-visible:ring-gray-600/40',
  dark: 'focus-visible:ring-white/30'
}
const ringColorClass = computed(() => ringMap[props.color])
</script>
