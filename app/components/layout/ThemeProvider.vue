<template>
  <slot></slot>
</template>

<script setup lang="ts">
const { getCookie, setCookie } = useCookies()

type Theme = 'light' | 'dark'
const theme = ref<Theme>((getCookie('theme') as Theme | null) || 'light')

const isDarkMode = computed({
  get: () => theme.value === 'dark',
  set: (v) => {
    theme.value = v ? 'dark' : 'light'
  }
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  setCookie('theme', theme.value)
}

useHead({
  htmlAttrs: {
    class: computed(() => (isDarkMode.value ? 'dark' : undefined))
  },
  bodyAttrs: { class: 'dark:bg-gray-900' },
  meta: [{ name: 'color-scheme', content: 'dark light' }]
})

provide('theme', {
  isDarkMode,
  toggleTheme
})
</script>

<script lang="ts">
export function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
