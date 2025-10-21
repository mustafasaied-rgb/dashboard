<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      'group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium hover:bg-gray-100 dark:hover:bg-white/5',
      isSelected && 'theme-text-medium bg-gray-100 dark:bg-white/5',
      'theme-text-muted hover:theme-text-medium'
    ]"
  >
    <slot />
  </NuxtLink>

  <button
    v-else
    type="button"
    :disabled="disabled"
    @click="(ev) => emit('click', ev)"
    :class="[
      'group text-theme-sm flex w-full items-center gap-3 rounded-lg px-3 py-2 font-medium hover:bg-gray-100 disabled:opacity-60 dark:hover:bg-white/5',
      isSelected && 'dark:bg-white/ bg-gray-100',
      'theme-text-muted hover:theme-text-medium'
    ]"
  >
    <slot />
  </button>
</template>
<script setup lang="ts">
const props = defineProps<{
  to?: string
  disabled?: boolean
  isSelected?: boolean
}>()
const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()
</script>
