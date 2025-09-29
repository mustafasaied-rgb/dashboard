<template>
  <section
    :class="[
      'app-container bg-[#F0F0F0] pb-[70px] pt-[70px] font-zarid',
      'lg:pb-[174px] lg:pt-[80px]',
      '3xl:pb-[103px] 3xl:pt-[104px]'
    ]"
  >
    <h2
      :class="[
        'mb-[47.43px] w-full text-xl-heading font-[200] not-italic leading-[49.4px] tracking-[0.52px] text-[#18264A]',
        'lg:mb-[64px] lg:max-w-[90%] lg:text-2xl-heading lg:leading-[65px] lg:tracking-[0.68px]',
        'xl:text-3xl-heading xl:leading-[85.5px] xl:tracking-[0.9px]',
        '3xl:mb-[87px] 3xl:max-w-[350px]'
      ]"
    >
      {{ sectionData?.[`title_${locale}`] }}
    </h2>
    <article
      :class="[
        'mb-[80.57px] flex w-full flex-wrap justify-start gap-[10px]',
        'lg:mb-[67.52px] lg:w-[85%] lg:gap-[16.2px]',
        '3xl:mb-[109px] 3xl:w-[70%] 3xl:gap-6'
      ]"
    >
      <figure
        v-for="(customer, i) in customers"
        @click="
          customer?.url &&
          navigateTo(customer?.url, {
            external: true,
            open: {
              target: '_blank'
            }
          })
        "
        :title="customer?.url"
        :class="[
          'aspect-square h-[107px] w-[106px] p-2',
          'lg:h-[145.2px] lg:w-[145.2px] lg:p-2',
          '3xl:h-[215px] 3xl:w-[215px] 3xl:p-5'
        ]"
      >
        <BaseImg
          densities="x1 x2"
          format="webp"
          :key="i"
          :src="customer.logo"
          class="h-full w-full object-contain transition-transform hover:-translate-y-[10px]"
          :alt="`Image ${i + 1}`"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </article>
    <button
      @click="navigateTo(`/${sectionData?.cta_link}`)"
      class="w-full max-w-[275px] rounded-3xl bg-white py-[23px] text-center text-xl font-[400] not-italic leading-[21px] tracking-[0.2px] text-black transition-colors hover:bg-white/70"
    >
      {{ sectionData?.[`cta_text_${locale}`] }}
    </button>
  </section>
</template>

<script setup lang="ts">
import type { PageSectionItem } from '~/services/pages-section.service'
defineProps<{ sectionData: PageSectionItem }>()
const { locale } = useI18n()
const { data: customers } = await useApiAsyncData(() => getPartners('government'))
</script>
