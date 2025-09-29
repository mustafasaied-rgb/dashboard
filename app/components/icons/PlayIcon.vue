<template>
  <svg
    :width="size ?? width"
    :height="size ?? height"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M34 25V55L55 40L34 25Z" :fill="color" />
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number
  },
  width: {
    type: [String, Number],
    default: 80
  },
  height: {
    type: [String, Number],
    default: 80
  },
  color: {
    type: String,
    default: 'black'
  }
})
</script>
