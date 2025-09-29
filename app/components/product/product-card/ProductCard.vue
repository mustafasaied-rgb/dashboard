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
      <p
        v-if="data?.[`meta_desc_${locale}`]"
        :class="['imgs-contianer__card__desc', wide && 'imgs-contianer__card__desc--wide']"
      >
        {{ data?.[`meta_desc_${locale}`] }}
      </p>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import type { IntegratedItem } from '~/services/products.service'
import type { ProductSolutionItem } from '~/composables/useProductsAndSolutions'
import type { CategoryItem } from '~/services/categories.service'

type GeneralIntegratedItem = IntegratedItem & ProductSolutionItem & CategoryItem

withDefaults(
  defineProps<{
    data: Partial<GeneralIntegratedItem>
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
  @apply flex w-[162px] flex-col items-center gap-[16.4px];
  @apply lg:w-[140px] lg:gap-[29px];
  @apply xl:w-[260px];
  @apply 3xl:w-[260px];
}
.imgs-contianer__card--wide {
  @apply w-[261.9px];
  @apply lg:w-[400px];
  @apply xl:w-[520px];
}
/*------------------* */
.imgs-contianer__card__img {
  @apply aspect-[1/1] w-[131.3px] overflow-hidden rounded-[30.3px] transition-all hover:translate-y-[-5px];
  @apply lg:w-full lg:rounded-[40px];
  @apply xl:rounded-[60px];
  @apply 3xl:rounded-[60px];

  &:hover {
    filter: drop-shadow(0 16px 28px rgba(23, 120, 255, 0.5));
  }
}
.imgs-contianer__card__img--wide {
  @apply !aspect-[521/260] !w-full;
}
/*------------------* */
.imgs-contianer__card__title {
  @apply w-full text-center text-xl font-[500] uppercase not-italic leading-[normal] tracking-[1.6px];
}
/*------------------* */
.imgs-contianer__card__desc {
  @apply mt-[3px] w-full px-0 text-center text-xl font-[400] not-italic leading-[21px] tracking-[0.2px];
  @apply lg:mt-[17px] lg:px-2;
}
.imgs-contianer__card__desc--wide {
  @apply mx-auto max-w-[221px];
  @apply lg:max-w-[284px];
  @apply xl:max-w-[220px];
}
</style>
