<template>
  <div>
    <ProductsSection v-if="showProductsSection" class="pb-[calc(var(--footer-gap)/2)]" />
    <section
      :class="[
        'bg-white pb-[61px] pt-[calc(var(--footer-gap)/2)]',
        'lg:pb-[55px]',
        '3xl:pb-[64px]'
      ]"
    >
      <AppFooterSection1 />
      <AppFooterSection2 class="pt-[110px] lg:pt-[102px] 3xl:pt-[104px]" />
    </section>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showProductsSection?: boolean
  }>(),
  {
    showProductsSection: true
  }
)
</script>
<style scoped></style>
