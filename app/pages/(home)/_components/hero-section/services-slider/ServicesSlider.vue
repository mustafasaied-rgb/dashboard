<template>
  <SliderCarousel
    class="h-full"
    trackClass="app-container flex h-full items-stretch justify-start xl:gap-[40px] gap-[28.67px]   "
  >
    <figure
      v-for="(category, index) in categories"
      :key="category?.id"
      :class="[
        'group relative h-full w-[258px] shrink-0 overflow-hidden rounded-[34px] bg-gray-950',
        'xl:w-[360px] xl:rounded-[48px]'
      ]"
    >
      <BaseImg
        densities="x1 x2"
        format="webp"
        :src="category?.image?.webp"
        :placeholder="category?.image?.avif"
        class="h-full w-full object-cover transition-transform group-hover:scale-110"
        :alt="`Image representing service`"
        preload="metadata"
        fetchpriority="high"
      />
      <figcaption
        :class="[
          'absolute top-0 z-10 flex h-full w-full flex-col justify-between px-[28.67px] pb-[28.67px] pt-[32px]',
          'xl:px-[40px] xl:pb-[40px] xl:pt-[45px]'
        ]"
      >
        <h2
          :class="['text-xl-heading font-[300] not-italic leading-[95%] tracking-[0.52px] text-white']"
        >
          {{ category?.[`title_${locale}`] }}
        </h2>
        <button
          @click="
            navigateTo(
              category?.single_item_slug
                ? `/product-details/${category?.single_item_slug}`
                : `categories-details/${category.id}`
            )
          "
          :class="[
            'w-full rounded-[17.201px] bg-[#FFFFFF1A] pb-[15.25px] pt-[12.48px] text-center text-[18px] font-normal not-italic leading-[105%] tracking-[0.2px] text-white backdrop-blur-[17px]',
            'lg:text-[19px] xl:rounded-3xl xl:pb-[24px] xl:pt-[23px]',
            'xl:text-[20px]'
          ]"
        >
          {{ $t('explore') }}
        </button>
      </figcaption>
    </figure>
  </SliderCarousel>
</template>

<script setup lang="ts">
import { getCategories } from '~/services/categories.service'

const { locale } = useI18n()
const { data: categories } = await useApiAsyncData(getCategories)
</script>
<style></style>
