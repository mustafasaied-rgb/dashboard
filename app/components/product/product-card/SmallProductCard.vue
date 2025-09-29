<template>
  <figure
    @click="navigateTo(`/product-details/${data?.slug}`)"
    :class="['imgs-contianer__card', wide && 'imgs-contianer__card--wide']"
  >
    <BaseImg
      densities="x1 x2"
      format="webp"
      :key="data?.id"
      :src="data?.image?.webp"
      :placeholder="data?.image?.avif"
      :class="[
        'imgs-contianer__card__img',
        wide && 'imgs-contianer__card__img--wide'
        // wide && 'object-cover object-[0_20%]'
      ]"
      :alt="`Image ${data?.id} representing solution`"
      loading="lazy"
      decoding="async"
    />
    <figcaption class="w-full">
      <h3 v-if="data?.[`title_${locale}`]" class="imgs-contianer__card__title">
        {{ data?.[`title_${locale}`] }}
      </h3>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { ProductSolutionItem } from '~/composables/useProductsAndSolutions'
withDefaults(
  defineProps<{
    data: ProductSolutionItem
    wide?: boolean
  }>(),
  {
    wide: false
  }
)
const { locale } = useI18n()
</script>
<style scoped>
.imgs-contianer__card {
  @apply flex w-[90.3px] flex-col items-center gap-[11.67px];
  @apply lg:w-[120px] lg:gap-[20px];
  @apply 3xl:w-[160px];
}
.imgs-contianer__card--wide {
  @apply w-[180px] lg:w-[120px] 3xl:w-[160px];
}
.imgs-contianer__card__img {
  @apply aspect-[1/1] w-full overflow-hidden rounded-[20.845px] transition-all hover:translate-y-[-5px];
  @apply lg:rounded-[27.692px];
  @apply 3xl:rounded-[36.923px];

  &:hover {
    filter: drop-shadow(0 16px 28px rgba(23, 120, 255, 0.5));
  }
}
.imgs-contianer__card__img--wide {
  @apply !aspect-[180/90.3] !w-full;
  @apply lg:!aspect-[1/1];
}
.imgs-contianer__card__title {
  @apply w-full text-center text-[16px] font-[500] uppercase not-italic leading-[normal] tracking-[1.28px];
  @apply lg:text-[17.89px] lg:tracking-[1.431px];
  @apply xl:text-xl xl:font-[500] xl:tracking-[1.6px];
}
/*------------------* */
.imgs-contianer__card__desc {
  @apply mt-[3px] w-full px-0 text-center text-xl font-[400] not-italic leading-[21px] tracking-[0.2px];
  @apply lg:mt-[17px] lg:px-2;
}
</style>
