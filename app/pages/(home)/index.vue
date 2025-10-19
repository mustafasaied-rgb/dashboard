<template>
  <div class="">
    <HeroSection />
    <!-- <component
      v-for="section in sections"
      :key="section.id"
      :is="componentMap[section.code] || null"
      :section-data="section"
    /> -->
  </div>
</template>

<script setup lang="ts">
// import type { SectionCode } from '~/services/pages-section.service'


definePageMeta({
  layoutProps: {
    showLeftLogo: false,
    tabsClass: null
  }
})
usePageHead()

// const componentMap: Partial<Record<SectionCode, any>> = {
//   news_bar: NewsSection,
//   vision: AnnouncementSection,
//   custom_development: PromoSection,
//   trusted_customers: CustomersSection,
//   digital_cloud: ParallaxSection,
//   trusted_partners: PartnersSection,
//   vision2030: SaudiVisionSection
// }
const { data: sections } = await useApiAsyncData(() => getPageSection('home'))
</script>
