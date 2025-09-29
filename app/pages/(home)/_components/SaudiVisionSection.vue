<template>
  <section
    class="app-container relative flex items-stretch !overflow-hidden overflow-y-auto bg-[#0D1667] font-zarid"
  >
    <article
      :class="[
        'relative z-10 w-full pb-[94px] pt-[70px]',
        'lg:pb-[102px] lg:pt-[100px]',
        '3xl:pb-[206px] 3xl:pt-[190px]'
      ]"
    >
      <h2
        :class="[
          'mb-[23px] text-[48px] font-[200] not-italic leading-[normal] tracking-[0.48px] text-white',
          'lg:mb-[37px] lg:text-[66px] lg:leading-[70px] lg:tracking-[0.66px]',
          'xl:text-3xl-heading xl:leading-[85.5px] xl:tracking-[0.9px]',
          '3xl:mb-[43px] 3xl:text-4xl-heading 3xl:leading-[133px] 3xl:tracking-[1.4px]'
        ]"
      >
        {{ sectionData?.[`title_${locale}`] }}
      </h2>
      <p
        :class="[
          'mb-[61px] w-[70%] text-[20px] font-[200] not-italic leading-[24px] tracking-[0.2px] text-white',
          'lg:mb-[145px] lg:w-[85%] lg:text-[32px] lg:leading-[34px] lg:tracking-[0.32px]',
          'xl:text-xl-heading xl:leading-[49.4px] xl:tracking-[0.52px]',
          '3xl:mb-[141px]'
        ]"
      >
        {{ sectionData?.[`content_${locale}`] }}
      </p>
      <div
        :class="['relative mb-[81px] max-w-full !overflow-hidden', 'lg:mb-[65px]', '3xl:mb-[74px]']"
      >
        <AnimatedGridsSection color="white" />
        <Vision2030Icon
          :class="[
            'absolute end-0 top-[50%] z-10 w-[99px] -translate-y-[50%]',
            'lg:end-[52px] lg:w-[238px]'
          ]"
        />
      </div>
      <button
        @click="navigateTo(`/${sectionData?.cta_link}`)"
        class="w-full max-w-[275px] rounded-3xl bg-white py-[23px] text-center text-base font-normal not-italic leading-[normal] tracking-[0.2px] text-black transition-colors hover:bg-white/70"
      >
        {{ sectionData?.[`cta_text_${locale}`] }}
      </button>
    </article>
    <BaseImg
      densities="x1 x2"
      format="webp"
      :src="sectionData?.image?.webp"
      :placeholder="sectionData?.image?.avif"
      class="absolute start-0 top-0 -z-0 h-full w-full object-cover"
      :alt="`Image representing saudiVisionImg`"
      loading="lazy"
      fetchpriority="low"
    />
  </section>
</template>

<script setup lang="ts">
import type { PageSectionItem } from '~/services/pages-section.service'
defineProps<{ sectionData: PageSectionItem }>()
const { locale } = useI18n()
</script>
<style scoped>
.main-text-color {
  background: linear-gradient(265deg, #465ae5 13.12%, #3246a9 97.6%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
