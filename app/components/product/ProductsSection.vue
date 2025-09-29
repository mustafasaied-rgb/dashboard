<template>
  <section
    :class="[
      'app-container flex flex-col gap-[66px] bg-[FFF] pt-[48px] font-zarid text-black',
      'lg:pt-[80px]',
      '3xl:pt-[80px]'
    ]"
  >
    <article>
      <h2 class="main-title">{{ products?.[`title_${locale}`] }}</h2>
      <div class="imgs-contianer mt-[29px]">
        <SmallProductCard v-for="(item, i) in products?.items || []" :data="item" />
      </div>
    </article>
    <article>
      <h2 class="main-title">{{ solutions?.[`title_${locale}`] }}</h2>
      <div class="imgs-contianer mt-[29px]">
        <SmallProductCard v-for="(item, i) in solutions?.items || []" :data="item"/>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { productsAndSolutions, fetchProductsAndSolutions } = useProductsAndSolutions()
await fetchProductsAndSolutions()
const products = computed(() => productsAndSolutions.value.find((data) => data.code == 'products'))
const solutions = computed(() =>
  productsAndSolutions.value.find((data) => data.code == 'solutions')
)
</script>
<style scoped>
.main-title {
  @apply text-xl font-semibold not-italic leading-[normal] tracking-[0.2px];
}
.imgs-contianer {
  @apply flex flex-wrap justify-start gap-x-[23.09px] gap-y-[38.75px];
  @apply lg:gap-[60px];
}
</style>
