<template>
  <div class=" ">
    <h2
      v-if="data?.[`title_${locale}`]"
      :class="[
        'font-title mt-[60px] text-xl-heading font-[300] leading-[49.4px] tracking-[0.52px]',
        'lg:mt-[74px] lg:text-[60px] lg:leading-[66px] lg:tracking-[0.6px]',
        'xl:mt-[90px] xl:text-[70px] xl:leading-[87.5px] xl:tracking-[0.7px]'
      ]"
    >
      {{ data?.[`title_${locale}`] }}
    </h2>

    <ProductSlider
      v-if="data.type == 'image' && data?.content.length"
      :images="data?.content"
      class="mt-[41px] lg:mt-[90px]"
    />
    <Contnet
      v-if="data.type == 'paragraph' && data?.content?.[`content_${locale}`]"
      :content="data?.content?.[`content_${locale}`]"
      class="mt-[41px] lg:mt-[90px]"
    />
  </div>
</template>

<script setup lang="ts">
import ProductSlider from './ProductSlider.vue'
defineProps<{ data: Record<string, any> }>()
const { locale } = useI18n()
</script>

<style>
.font-title {
  font-family: '29LT Zarid Sans AL', 'Zarid-Fallback', system-ui, sans-serif !important;
}
@media (min-width: 1024px) {
  .font-title {
    font-family: Roboto !important;
  }
}
</style>
