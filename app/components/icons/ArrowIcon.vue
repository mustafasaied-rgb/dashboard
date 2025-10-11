<template>
  <svg
    :width="size ?? width"
    :height="size ?? height"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 24"
    fill="none"
    :class="[ltrRight && 'rtl:rotate-180', ltrLeft && 'ltr:rotate-180', $attrs?.class]"
  >
    <path
      d="M15.3936 1.39344C15.9793 0.807655 16.9289 0.807655 17.5146 1.39344L27.0605 10.9393C27.6463 11.5251 27.6463 12.4746 27.0605 13.0604L17.5146 22.6063C16.9289 23.1921 15.9793 23.1921 15.3936 22.6063C14.8078 22.0205 14.8078 21.071 15.3936 20.4852L22.3789 13.4999H2C1.17157 13.4999 0.5 12.8283 0.5 11.9999C0.5 11.1715 1.17157 10.4999 2 10.4999H22.3789L15.3936 3.51454C14.8078 2.92875 14.8078 1.97923 15.3936 1.39344Z"
      :fill="color"
    />
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number
  },
  width: {
    type: [String, Number],
    default: 28
  },
  height: {
    type: [String, Number],
    default: 24
  },
  color: {
    type: String,
    default: 'black'
  },
  ltrRight: {
    type: Boolean,
    default: false
  },
  ltrLeft: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
})
</script>
