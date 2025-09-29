<template>
  <section
    :class="[
      'app-container flex flex-col items-start gap-[46px] bg-[#F0F0F0] pb-[64px] pt-[70px] font-zarid',
      'lg:gap-[52px] lg:pb-[93px] lg:pt-[80px]',
      '3xl:flex-row 3xl:gap-5 3xl:pb-[230px] 3xl:pt-[118px]'
    ]"
  >
    <h2
      :class="[
        'w-full pe-0 pt-0 text-xl-heading font-[200] not-italic leading-[49.4px] tracking-[0.52px] text-[#18264A]',
        'lg:text-2xl-heading lg:leading-[65px] lg:tracking-[0.68px]',
        'xl:text-3xl-heading xl:leading-[85.5px] xl:tracking-[0.9px]',
        '3xl:w-[670px] 3xl:pe-[5%] 3xl:pt-[16px]'
      ]"
    >
      {{ sectionData?.[`title_${locale}`] }}
    </h2>

    <article
      :class="[
        'grid w-full grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-[60px] gap-y-[40px] py-7',
        'lg:w-[90%] lg:flex-1 lg:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] lg:gap-x-[30px] lg:gap-y-[50px] lg:py-7',
        '3xl:w-full 3xl:flex-1 3xl:grid-cols-[repeat(auto-fill,minmax(215px,1fr))] 3xl:gap-x-[60px] 3xl:gap-y-[40px] 3xl:py-0'
      ]"
    >
      <figure
        v-for="(partner, i) in partners"
        :key="i"
        :class="[
          'flex h-[50px] w-[120px] items-center justify-start',
          'lg:h-[50px] lg:w-[190px]',
          '3xl:h-[75px] 3xl:w-[215px]'
        ]"
      >
        <BaseImg
          densities="x1 x2"
          format="webp"
          :src="partner.logo"
          :alt="`logo ${i + 1}`"
          class="max-h-full max-w-full object-contain grayscale transition duration-300 hover:grayscale-0"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { PageSectionItem } from '~/services/pages-section.service'
defineProps<{ sectionData: PageSectionItem }>()
const { locale } = useI18n()
const { data: partners } = await useApiAsyncData(() => getPartners('corporate'))
</script>
