<template>
  <div :class="['bg-[#F0F0F0] font-zarid']">
    <div
      :class="[
        'flex min-h-[100vh] flex-col justify-between gap-[120px] bg-[#0D1667] pb-[60px] text-white',
        'xl:min-h-[90vh] xl:pb-[117px]',
        '3xl:min-h-[95.36vh] 3xl:pb-[147px]'
      ]"
      :style="{
        backgroundImage: `url(${productData?.cover_image?.webp})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <div class="min-h-[--header-height]"></div>
      <header class="app-container text-white">
        <p
          v-if="productData?.category?.[`title_${locale}`]"
          :class="[
            'text-[20px] font-[600] leading-[normal] tracking-[0.2px]',
            'xl:text-[30px] xl:leading-[33px] xl:tracking-[0.3px]'
          ]"
        >
          {{ productData?.category?.[`title_${locale}`] }}
        </p>
        <h1 :class="['head-title mt-[22px]', 'lg:mt-[15px]']">
          {{ productData?.[`title_${locale}`] }}
        </h1>
      </header>
    </div>
    <div :class="['min-h-screen pb-[60px] text-[#18264A]', 'lg:pb-[228px]', '3xl:pb-[235px]']">
      <ProductDetailsTemplate
        v-for="item in productData?.item_sections"
        class="app-container-small"
        :key="item?.id"
        :data="item"
      />
      <div v-if="productData?.integrated_items?.length" :class="['mt-[59px]', 'lg:mt-[82px]']">
        <h2
          v-if="productData?.[`title_${locale}`]"
          :class="['app-container-small text-[30px] font-[600] leading-[33px] tracking-[0.3px]']"
        >
          {{ $t('integrated', { type: productData?.category?.[`title_${locale}`] }) }}
        </h2>

        <div
          :class="[
            'app-container-small mt-[30px] flex w-full max-w-full flex-wrap justify-center gap-x-[14px] gap-y-[28.5px] !pe-0',
            'xs:justify-start',
            'lg:mt-[60px] lg:gap-x-[50px] lg:gap-y-[103.45px]',
            'xl:gap-x-[108px] xl:gap-y-[103px] 3xl:max-w-[85%] 3xl:!pe-0'
          ]"
        >
          <ProductCard
            v-for="(integratedItem, i) in productData?.integrated_items || []"
            :data="integratedItem"
          />
        </div>
      </div>
      <div class="app-container-small">
        <BaseButton
          @click="modalOpen = true"
          :class="[
            'font-section mt-[40px] h-[68px] max-w-[295px] text-[16px] font-[500] leading-[normal] lg:mt-[95px]',
            'xl:text-[20px] xl:font-[400] xl:leading-[21px] xl:tracking-[0.2px]'
          ]"
        >
          {{ $t('lets_talk') }}
        </BaseButton>
      </div>
    </div>
    <RequestDocumentModal :itemId="productData?.id" v-model:open="modalOpen" />
  </div>
</template>

<script setup lang="ts">
import RequestDocumentModal from '~/pages/product-details/_components/RequestDocumentModal.vue'
import ProductDetailsTemplate from '~/pages/product-details/_components/ProductDetailsTemplate.vue'

const route = useRoute()
definePageMeta({
  layoutProps: {
    isWhiteLogo: true,
    selectedTabClass: 'bg-[#010101] text-white'
  }
})
const modalOpen = ref(false)
const { locale } = useI18n()
const { data: productData } = await useApiAsyncData(
  () => `product-details:${route.params.slug}`,
  async () => getProductDetails(route.params.slug as string),
  { watch: [() => route.params.slug] }
)

useCustomHead(() => ({
  title:
    productData.value?.[`meta_title_${locale.value}`] ??
    productData.value?.[`title_${locale.value}`],
  description:
    productData.value?.[`meta_description_${locale.value}`] ??
    productData.value?.[`meta_desc_${locale.value}`] ??
    productData.value?.[`description_${locale.value}`],
  keywords:
    productData.value?.[`meta_keywords_${locale.value}`] ??
    productData.value?.[`meta_title_${locale.value}`],
  image: productData.value?.cover_image?.webp
}))
</script>
<style scoped>
.head-title {
  @apply text-xl-heading font-[200] leading-[49.4px] tracking-[0.52px];
  @apply lg:text-[85px] lg:leading-[81px] lg:tracking-[0.85px];
  @apply xl:text-4xl-heading xl:leading-[133px] xl:tracking-[1.4px];
}
.font-section {
  font-family: Roboto !important;
}

@media (min-width: 1024px) {
  .font-section {
    font-family: '29LT Zarid Sans AL', 'Zarid-Fallback', system-ui, sans-serif !important;
  }
}
</style>
