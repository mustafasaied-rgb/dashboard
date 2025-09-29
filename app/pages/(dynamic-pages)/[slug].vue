<template>
  <div :class="['flex min-h-screen bg-[#F0F0F0] pt-[--header-height] font-zarid text-black']">
    <section
      :class="[
        'app-container-small mb-[125px] mt-[40px] flex w-fit flex-col',
        'lg:mb-[153px] lg:mt-[65px]'
      ]"
    >
      <dynamicPageTemplate
        v-for="item in pageDetailsData"
        :key="item?.id"
        :data="item"
        class="first-of-type:mt-[68px] first-of-type:lg:mt-[62px] first-of-type:3xl:mt-[106px]"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import dynamicPageTemplate from '~/pages/(dynamic-pages)/_components/dynamicPageTemplate.vue'
const route = useRoute()
const { data: pageDetailsData } = await useApiAsyncData(
  () => `dynamic-pages:${route.params.slug}`,
  () => getPageSection(route.params.slug as string),
  {
    watch: [() => route.params.slug]
  }
)
usePageHead(route.params.slug as string)
</script>
<style scoped></style>
