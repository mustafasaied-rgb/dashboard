<template>
  <section
    id="NewsSection"
    class="h-[200px] bg-[#465AE6] pb-[36px] pt-[30px] font-zarid rtl:lg:h-[205px]"
  >
    <LazyScrollWithDragWrapper class="app-container h-full !overflow-y-visible">
      <div class="flex h-full items-start justify-start gap-[70px] lg:gap-[95px]">
        <NuxtLink
          class="group relative flex h-full flex-shrink-0 items-start justify-start pe-[100px] last-of-type:pe-0"
          v-for="(item, index) in newsData"
          :to="`/news/${item.slug}`"
        >
          <div class="not-italic text-white transition-colors hover:text-[#0ADF0A]">
            <h3
              :class="[
                'main-title mb-[14px] text-[16px] font-[500] uppercase leading-[19.2px] tracking-[0.16px]',
                'lg:mb-[2px] lg:text-[22px] lg:font-[600] lg:leading-[27px] lg:tracking-[0.23px]',
                'xl:text-[32px] xl:font-[700] xl:leading-[38.4px] xl:tracking-[0.32px]'
              ]"
            >
              {{ $fd(item.updated_at, 'll') }}
            </h3>
            <h4
              :class="[
                'text-truncate-multi w-[220px] text-[20px] font-[200] leading-[21px] tracking-[0.32px]',
                'lg:w-[580px] lg:pe-[10%] lg:text-[25px] lg:font-[300] lg:leading-[25px] lg:tracking-[0.32px]',
                'xl:text-[32px] xl:font-[300] xl:leading-[30.4px] rtl:xl:leading-[34px]'
              ]"
            >
              {{ item?.[`title_${locale}`] }}
            </h4>
          </div>
          <BaseImg
            densities="x1 x2"
            format="webp"
            v-if="item.image?.webp"
            :src="item.image?.webp"
            :placeholder="item?.image?.avif"
            class="mb-[17px] h-[87px] w-[133.912px] self-end rounded-[10px] object-cover lg:mb-0 lg:h-[102px] lg:w-[157px]"
            :alt="`news ${item.slug}`"
            loading="lazy"
          />
          <div
            class="absolute bottom-0 end-0 flex flex-col items-start justify-start text-[40px] font-[200] not-italic leading-[49.4px] tracking-[0.52px] text-[#0ADF0A] group-last-of-type:hidden lg:text-[46px] xl:text-xl-heading"
          >
            <span>#</span>
            <span>#</span>
            <span>#</span>
          </div>
        </NuxtLink>
        <button
          @click="navigateTo('/news')"
          class="my-auto whitespace-nowrap pe-[50px] text-center align-middle font-durke text-[20px] font-medium uppercase not-italic leading-[120%] tracking-[0.32px] text-[#0ADF0A] hover:text-white lg:pe-[151px] lg:text-[25px] xl:text-[32px] rtl:font-[800]"
        >
          {{ $t('all_news') }} /
        </button>
      </div>
    </LazyScrollWithDragWrapper>
  </section>
</template>

<script setup lang="ts">
import type { PageSectionItem } from '~/services/pages-section.service'
defineProps<{ sectionData: PageSectionItem }>()
const { locale } = useI18n()
const { data: newsData } = await useApiAsyncData(async () => {
  const res = await getNews({ per_page: 3, page: 1 })
  return res.data || []
})
</script>
<style>
#NewsSection .main-title {
  font-family: 'Druk Wide', sans-serif;
}

@media (min-width: 1024px) {
  #NewsSection .main-title {
    font-family: '29LT Zarid Sans AL', 'Zarid-Fallback', system-ui, sans-serif;
  }
}
</style>
