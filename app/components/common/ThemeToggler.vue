<template>
  <Button @click.prevent="toggleTheme" rounded variant="outline" size="icon" class="bg-transparent">
    <LightIcon v-if="isDarkMode" />
    <DarkIcon v-else />
  </Button>
</template>

<script setup>
import { useTheme } from '../layout/ThemeProvider.vue'

const { toggleTheme, isDarkMode } = useTheme()
</script>
