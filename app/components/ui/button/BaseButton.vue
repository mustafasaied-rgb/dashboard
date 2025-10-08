<template>
  <button
    :class="[
      'relative',
      isStyled &&
        'text-center text-base font-normal not-italic leading-[normal] tracking-[0.2px] text-black',
      isStyled &&
        'w-full max-w-[275px] rounded-3xl bg-white py-[23px] transition-colors hover:bg-white/70',
      $attrs.class
    ]"
  >
    <slot></slot>
    <span v-if="isLoading" class="absolute end-[12%] top-1/2 z-30 -translate-y-1/2">
      <LoadarIcon v-bind="loadarProps" />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Classish } from '~/types/utils'
withDefaults(
  defineProps<{
    btnClass?: Classish
    isStyled?: boolean | null
    isLoading?: boolean | null
    loadarProps?: Record<string, any>
  }>(),
  {
    isStyled: true,
    isLoading: false,
    loadarProps: () => ({})
  }
)
</script>
