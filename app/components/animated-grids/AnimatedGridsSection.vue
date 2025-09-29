<template>
  <div
    :style="{
      '--grid-color': color
    }"
    id="AnimatedGridsSection"
    class=""
  >
    <div class="static-grid">
      <ClientOnly>
        <StaticGride v-for="i in 14" :smallDotPosition="smallDotPosition" />
      </ClientOnly>
    </div>
    <div class="animated-grid">
      <ClientOnly>
        <EqualizerAnimation />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?: string
  }>(),
  {
    color: '#6f80f5'
  }
)

const { gte } = useBreakpoints()
const smallDotPosition = computed(() => {
  if (gte('lg')) return 15
  return 3
})
</script>

<style scoped>
#AnimatedGridsSection {
  --grid-width: 8px;
  --grid-height: 8px;
  --grid-h-gap: 4.1875px;
  --grid-v-gap: 4.88px;

  --grid-contianer-padding-top: 1px;
  --grid-contianer-padding-bottom: 1px;
  --grid-contianer-padding-end: 0px;
  --grid-contianer-padding-start: 0px;

  @media (min-width: 1024px) {
    --grid-width: 7.854px;
    --grid-height: 7.854px;
    --grid-h-gap: 3.39px;
    --grid-v-gap: 5.15px;

    --grid-contianer-padding-top: 0px;
    --grid-contianer-padding-bottom: 0px;
    --grid-contianer-padding-end: 3.72px;
    --grid-contianer-padding-start: 2.76px;
  }

  padding-top: var(--grid-contianer-padding-top);
  padding-bottom: var(--grid-contianer-padding-bottom);
  padding-inline-end: var(--grid-contianer-padding-end);
  padding-inline-start: var(--grid-contianer-padding-start);

  /* padding: 4px; */
  position: relative;
  .static-grid {
    display: flex;
    flex-direction: column;
    gap: var(--grid-v-gap);
  }
  .animated-grid {
    top: var(--grid-contianer-padding-top);
    position: absolute;
    margin: 0 auto;
    inset-inline-start: calc(
      (3 * (var(--grid-width) + var(--grid-h-gap))) + var(--grid-contianer-padding-start)
    );
    @media (min-width: 1024px) {
      inset-inline-start: calc(
        (15 * (var(--grid-width) + var(--grid-h-gap))) + var(--grid-contianer-padding-start)
      );
    }
  }
}
</style>
