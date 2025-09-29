<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 18 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 6C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H10C9.44771 8 9 7.55228 9 7C9 6.44772 9.44771 6 10 6H17ZM17 0C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H1C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0H17Z"
      :fill="color"
    />
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  width: {
    type: [String, Number],
    default: 18
  },
  height: {
    type: [String, Number],
    default: 8
  },
  color: {
    type: String,
    default: 'black'
  }
})
</script>
