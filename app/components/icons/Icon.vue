<template>
  <component
    :is="icon"
    :class="props.class"
    :width="size"
    :height="size"
    aria-hidden="true"
    v-bind="$attrs"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  class: { type: String, default: '' },
  size: { type: [String, Number], default: 24 }
})

// Dynamically import the SVG component
const icon = defineAsyncComponent(() => import(`~/assets/icons/${props.name}.svg`))
</script>
<style>
/* .nuxt-icon--fill, .nuxt-icon--fill * {
    fill: currentColor;
}

.nuxt-icon {
    height: inherit !important;
    margin-bottom: 0 !important;
    vertical-align:baseline !important;
    width:inherit !important;
} */
</style>
