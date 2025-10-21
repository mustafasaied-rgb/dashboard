<template>
  <Button @click.prevent="toggleTheme" rounded variant="outline" size="icon">
    <LightIcon v-if="isDarkMode" />
    <DarkIcon v-else />
  </Button>
</template>

<script setup>
import { useTheme } from '~/components/layout/ThemeProvider.vue'

const { toggleTheme, isDarkMode } = useTheme()
</script>
