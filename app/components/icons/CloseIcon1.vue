<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="Vector"
      d="M1 20.2L10.6 10.6M10.6 10.6L20.2 1M10.6 10.6L1 1M10.6 10.6L20.2 20.2"
      stroke="black"
      stroke-opacity="0.5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  size: { type: [String, Number], default: 22 },
  color: { type: String, default: 'white' }
})
</script>
