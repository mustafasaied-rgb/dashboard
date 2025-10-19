<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      'group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300',
      isSelected && 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300'
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
      'group text-theme-sm flex w-full items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-60 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300',
      isSelected && 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300'
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
