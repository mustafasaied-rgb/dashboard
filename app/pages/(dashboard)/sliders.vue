<template>
  <div class="max-w-full">
    <PageBreadcrumb page-title="Sliders" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard collapsible default-open title="ScrollWithDragWrapper" class="">
        <ScrollWithDragWrapper class="mt-11 ps-10 pe-10 lg:mt-13 lg:ps-0 lg:pe-0">
          <div class="grid auto-cols-max grid-flow-col grid-rows-2 items-end gap-8 lg:grid-rows-1">
            <BaseImg
              v-for="(certificate, index) in certificates"
              :key="index"
              :src="certificate ?? ''"
              class="inline-block h-auto w-auto max-w-[205px] object-contain align-bottom"
              loading="lazy"
              :alt="`certificates ${index}`"
            />
          </div>
        </ScrollWithDragWrapper>
      </ComponentCard>
      <ComponentCard collapsible default-open title="SliderCarousel" class="space-y-5 sm:space-y-6">
        <SliderCarousel
          class="h-full"
          trackClass="app-container flex h-full items-stretch justify-start xl:gap-[40px] gap-[28.67px]   "
        >
          <figure
            v-for="(category, index) in categories"
            :key="category?.id"
            :class="[
              'group relative h-full w-[258px] shrink-0 overflow-hidden rounded-[34px] bg-gray-950',
              'xl:w-[360px] xl:rounded-[48px]'
            ]"
          >
            <BaseImg
              densities="x1 x2"
              format="webp"
              :src="category?.image?.webp"
              :placeholder="category?.image?.avif"
              class="h-full w-full object-cover transition-transform group-hover:scale-110"
              :alt="`Image representing service`"
              preload="metadata"
              fetchpriority="high"
            />
            <figcaption
              :class="[
                'absolute top-0 z-10 flex h-full w-full flex-col justify-between px-[28.67px] pt-[32px] pb-[28.67px]',
                'xl:px-[40px] xl:pt-[45px] xl:pb-[40px]'
              ]"
            >
              <h2
                :class="[
                  'text-xl-heading leading-[95%] font-[300] tracking-[0.52px] text-white not-italic'
                ]"
              >
                {{ category?.[`title_${locale}`] }}
              </h2>
              <button
                :class="[
                  'w-full rounded-[17.201px] bg-[#FFFFFF1A] pt-[12.48px] pb-[15.25px] text-center text-[18px] leading-[105%] font-normal tracking-[0.2px] text-white not-italic backdrop-blur-[17px]',
                  'lg:text-[19px] xl:rounded-3xl xl:pt-[23px] xl:pb-[24px]',
                  'xl:text-[20px]'
                ]"
              >
                {{ $t('explore') }}
              </button>
            </figcaption>
          </figure>
        </SliderCarousel>
      </ComponentCard>
    </div>
  </div>
</template>

<script setup>

const certificates = [
  'https://marketplace.canva.com/EAFNlUJs5g4/2/0/1600w/canva-white-simple-certificate-of-appreciation-Fcz7KkZ5YaU.jpg',
  'https://m.media-amazon.com/images/I/81jh9fuDcmS.jpg',
  'https://m.media-amazon.com/images/I/719S52YjtmL._AC_SL1424_.jpg',
  'https://www.123certificates.com/images/certificate-of-completion-1L.gif',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQnZS_cUcsO5cRcvmNxtrZVFcLhFV4UqG21g&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQnZS_cUcsO5cRcvmNxtrZVFcLhFV4UqG21g&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQnZS_cUcsO5cRcvmNxtrZVFcLhFV4UqG21g&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQnZS_cUcsO5cRcvmNxtrZVFcLhFV4UqG21g&s',

  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQnZS_cUcsO5cRcvmNxtrZVFcLhFV4UqG21g&s'
]
const locale = 'en'
const categories = [
  {
    id: 1,
    title_en: 'Products',
    title_ar: 'منتجاتنا',
    code: 'products',
    image: {
      original:
        'https://api.astc.com.sa/storage/categories/QWq5MU8WgfXwPk38WdctIoEct4yyF7mMHDsruOLe.jpg',
      webp: 'https://api.astc.com.sa/storage/categories/mJ07LNhIbAbLc5CyPffpRvjDeFbc1LOWI1zRq6ZR.webp',
      avif: 'https://api.astc.com.sa/storage/categories/qvpiAfshJLxjZIkVx6dpBBuC7rCo86j4oopBma4E.avif'
    },
    status: 1,
    sort_order: 0,
    created_by_id: null,
    created_at: '2025-08-18T12:06:41.000000Z',
    updated_at: '2025-09-17T07:59:13.000000Z',
    deleted_at: null
  },
  {
    id: 2,
    title_en: 'Solutions',
    title_ar: 'حلولنا',
    code: 'solutions',
    image: {
      original:
        'https://api.astc.com.sa/storage/categories/0skZUVNU3EvNdWoQBUy5PySXQvQaxSfS1fuaitzg.jpg',
      webp: 'https://api.astc.com.sa/storage/categories/qS78DlrGfP024xiPSaFi3K25zcTkZem35bZ628S6.webp',
      avif: 'https://api.astc.com.sa/storage/categories/eigDVoKE6VOgBAljpsVYXdAg7wPsSCDEb7rzwsGa.avif'
    },
    status: 1,
    sort_order: 1,
    created_by_id: null,
    created_at: '2025-08-18T12:06:41.000000Z',
    updated_at: '2025-09-17T07:59:33.000000Z',
    deleted_at: null
  },
  {
    id: 3,
    title_en: 'Managed Services',
    title_ar: 'الخدمات المدارة',
    code: 'managed-services',
    image: {
      original:
        'https://api.astc.com.sa/storage/categories/vI1HxvCKon9QWZjDbTl9OTvMntSERqnEupFynkSa.png',
      webp: 'https://api.astc.com.sa/storage/categories/xgKaV9TmHwrjg72gubxY7QfCmxmkR4sDzmQQtO4w.webp',
      avif: 'https://api.astc.com.sa/storage/categories/vV2u9CwL3pazRxeWVEaA41vpGtfhxvCqHpp7xs4P.avif'
    },
    status: 1,
    sort_order: 3,
    created_by_id: null,
    created_at: '2025-08-18T12:06:41.000000Z',
    updated_at: '2025-09-17T08:00:08.000000Z',
    deleted_at: null,
    single_item_slug: 'integrated-solutions-for-flexible-and-secure-it-management'
  }
]
</script>

<style></style>
