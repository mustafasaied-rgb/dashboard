<template>
  <svg
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
    :fill="currentColor"
    :width="size"
    :height="size"
    class="rounded-[12px]"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="-143 145 512 512"
    xml:space="preserve"
  >
    <g>
      <polygon points="78.9,450.3 162.7,401.1 78.9,351.9 	" />
      <path
        d="M-143,145v512h512V145H-143z M241,446.8L241,446.8c0,44.1-44.1,44.1-44.1,44.1H29.1c-44.1,0-44.1-44.1-44.1-44.1v-91.5
		c0-44.1,44.1-44.1,44.1-44.1h167.8c44.1,0,44.1,44.1,44.1,44.1V446.8z"
      />
    </g>
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: 'black' },
  hoverColor: { type: String, default: 'black' },
  size: { type: [String, Number], default: 68 }
})
const isHovering = ref(false)
const currentColor = computed(() => (isHovering.value ? props.hoverColor : props.color))
</script>
