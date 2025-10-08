<template>
  <button
    :type="type"
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium transition duration-150 ease-in-out',
      baseRadius,
      sizeClasses[size],
      variantClasses[variant],
      { 'cursor-not-allowed opacity-50': disabled }
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
        class="ms-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      ></span>
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

type ButtonSize = 'sm' | 'md' | 'icon'
type ButtonVariant = 'primary' | 'outline' | 'none'

interface ButtonProps {
  size?: ButtonSize
  variant?: ButtonVariant
  startIcon?: any
  endIcon?: any
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  rounded?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  variant: 'primary',
  disabled: false,
  loading: false,
  type: 'button',
  rounded: false
})

const slots = useSlots()
const hasStart = computed(() => !!slots.start)
const hasEnd = computed(() => !!slots.end)

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-3 text-sm',
  md: 'px-5 py-3.5 text-sm',
  icon: 'h-11 w-11'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',
  outline:
    'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ' +
    'dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
  none: 'text-gray-700' + '  dark:text-gray-400 dark:hover:text-gray-300'
}

const baseRadius = computed(() => (props.rounded ? 'rounded-full' : 'rounded-lg'))
</script>
