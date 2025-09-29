<template>
  <div class="">
    <HeroSection />
    <component
      v-for="section in sections"
      :key="section.id"
      :is="componentMap[section.code] || null"
      :section-data="section"
    />
  </div>
</template>

<script setup lang="ts">
import type { SectionCode } from '~/services/pages-section.service'

import HeroSection from '~/pages/(home)/_components/hero-section/HeroSection.vue'
import NewsSection from '~/pages/(home)/_components/NewsSection.vue'
import AnnouncementSection from '~/pages/(home)/_components/AnnouncementSection.vue'
import PromoSection from '~/pages/(home)/_components/PromoSection.vue'
import CustomersSection from '~/pages/(home)/_components/CustomersSection.vue'
import ParallaxSection from '~/pages/(home)/_components/parallax-section/ParallaxSection.vue'
import PartnersSection from '~/pages/(home)/_components/PartnersSection.vue'
import SaudiVisionSection from '~/pages/(home)/_components/SaudiVisionSection.vue'
definePageMeta({
  layoutProps: {
    showLeftLogo: false,
    tabsClass: null
  }
})
usePageHead()

const componentMap: Partial<Record<SectionCode, any>> = {
  news_bar: NewsSection,
  vision: AnnouncementSection,
  custom_development: PromoSection,
  trusted_customers: CustomersSection,
  digital_cloud: ParallaxSection,
  trusted_partners: PartnersSection,
  vision2030: SaudiVisionSection
}
const { data: sections } = await useApiAsyncData(() => getPageSection('home'))
</script>
