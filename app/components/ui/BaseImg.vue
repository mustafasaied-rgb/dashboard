<template>
  <NuxtImg
    class="content-transition"
    v-bind="$attrs"
    :src="resolvedSrc"
    @error="handleImageError"
    placeholder-class="custom"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  fallback?: string
  src?: string
}>()
const fallbackSrc = ref<string | null>(null)
function handleImageError() {
  fallbackSrc.value = props.fallback ?? ''
}
const resolvedSrc = computed(() => fallbackSrc.value || props.src)
</script>
<style scoped>
.custom {
  object-fit: cover;
  /* filter: blur(1px); */
  /* backdrop-filter:blur(10px) ; */
}
</style>
