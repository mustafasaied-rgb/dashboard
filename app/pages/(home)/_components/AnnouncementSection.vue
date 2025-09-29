<template>
  <section
    :class="[
      'app-container bg-[#F0F0F0] pb-[127px] pt-[100px] font-zarid',
      'lg:pb-[127px] lg:pt-[110px]',
      '3xl:pb-[163px] 3xl:pt-[190px]'
    ]"
  >
    <h2
      :class="[
        'main-text-color max-w-[85%] text-xl-heading font-[200] not-italic leading-[49.4px] tracking-[0.52px]',
        'lg:max-w-[75%] lg:text-2xl-heading lg:leading-[65px] lg:tracking-[0.68px]',
        'xl:text-3xl-heading xl:leading-[85.5px] xl:tracking-[0.9px]',
        '3xl:max-w-[80%] 3xl:text-4xl-heading 3xl:leading-[133px] 3xl:tracking-[1.4px]'
      ]"
    >
      {{ sectionData?.[`title_${locale}`] }}
    </h2>
    <button
      @click="navigateTo(`/${sectionData?.cta_link}`)"
      :class="[
        'mt-[80px] w-full max-w-[275px] rounded-3xl bg-white py-[23px] text-center text-xl font-[400] not-italic leading-[21px] tracking-[0.2px] text-black transition-colors hover:bg-white/70',
        '3xl:mt-[100px]'
      ]"
    >
      {{ sectionData?.[`cta_text_${locale}`] }}
    </button>
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
