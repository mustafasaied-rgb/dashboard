<template>
  <div :class="['', variantClasses[variant]]">
    <BaseImg
      v-for="(src, index) in srcs"
      :src="src"
      :alt="`Grid image ${index}`"
      :key="index"
      class="w-full overflow-hidden rounded-xl"
    />
  </div>
</template>
<script setup lang="ts">
type Variant = 'cols-2' | 'cols-3' | 'cols-n'

const props = withDefaults(
  defineProps<{
    srcs?: string[]
    variant?: Variant
  }>(),
  {
    srcs: () => [],
    variant: 'cols-n'
  }
)

const variantClasses: Record<Variant, string> = {
  'cols-2': 'grid grid-cols-1 gap-5 sm:grid-cols-2',
  'cols-3': 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3',
  'cols-n': 'grid gap-5 grid-cols-[repeat(auto-fit,minmax(min(100%,15em),1fr))]'
}
</script>
<style></style>
