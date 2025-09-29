<template>
  <div class="StaticGride-container">
    <template v-for="(node, index) in nodes" :key="node.position">
      <div v-if="node.isBig" class="node node-2"></div>

      <div v-if="node.isSmall" class="node node-1"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  smallDotPosition: {
    type: Number,
    default: 15
  }
})

const totalLength = 1000
const nodes = computed(() =>
  Array.from({ length: totalLength }, (_, i) => {
    const isBig = i < props.smallDotPosition
    const isSmall = i > props.smallDotPosition
    return {
      position: i,
      isBig,
      isSmall
    }
  })
)
</script>

<style scoped>
.StaticGride-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--grid-h-gap);
  overflow: hidden;
  flex-shrink: 0 !important;
}
.node {
  height: var(--grid-height);
  width: var(--grid-width);
  flex-shrink: 0;
  border-radius: 50%;
  background-color: var(--grid-color);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.node-1 {
  transform: scale(0.5);
  align-self: flex-end;
}
.node-2 {
  transform: scale(1);
}
</style>
