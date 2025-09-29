<template>
  <div class="app-container-small mt-[100px] lg:mt-[180px] 3xl:mt-[184px]">
    <h2
      v-if="data?.[`title_${locale}`]"
      :class="[
        'text-xl-heading font-[200] leading-[49.4px] tracking-[0.52px]',
        'lg:text-2xl-heading lg:leading-[65px] lg:tracking-[0.68px]',
        'xl:text-3xl-heading xl:leading-[85.5px] xl:tracking-[0.9px]'
      ]"
    >
      {{ data?.[`title_${locale}`] }}
    </h2>
    <Contnet v-if="rawContent" :content="rawContent" class="mt-[40px] lg:mt-[65px]" />
    <BaseButton
      v-if="data?.cta_link"
      @click="navigateTo(`/contact`)"
      :class="[
        'font-section mt-[40px] h-[68px] max-w-[295px] text-[16px] font-[500] leading-[normal] lg:mt-[95px]',
        'xl:text-[20px] xl:font-[400] xl:leading-[21px] xl:tracking-[0.2px]'
      ]"
    >
      {{ data?.[`cta_text_${locale}`] }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import type { AboutSectionItem } from '../index.vue'
const props = defineProps<{ data: AboutSectionItem }>()
const { locale } = useI18n()
const rawContent = computed(() => props.data?.[`content_${locale.value}`] ?? '')
</script>

<style>
.font-section {
  font-family: Roboto !important;
}
@media (min-width: 1024px) {
  .font-section {
    font-family: '29LT Zarid Sans AL', 'Zarid-Fallback', system-ui, sans-serif !important;
  }
}
</style>
