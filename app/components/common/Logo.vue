<template>
  <div class="flex items-center gap-2">
    <p :class="['theme-text-strong font-medium', textClass]">{{ $t('dashboard') }}</p>
    <img class="w-[32px]" src="/images/logo/logo.svg" alt="Logo" />
  </div>
</template>

<script setup lang="ts">
import type { Classish } from '~/types/utils'

interface Props {
  textClass: Classish
}
withDefaults(defineProps<Props>(), {
  textClass: ''
})
</script>
