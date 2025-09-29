<template>
  <div
    :style="{ '--container-pe-lg-screens': '26.5vw' }"
    :class="[
      'about-bg flex min-h-screen flex-col bg-[#0D1667] pb-[209px] pt-[--header-height] font-zarid text-white lg:pb-[300px] 3xl:pb-[280px]'
    ]"
  >
    <BaseImg
      v-if="aboutIntro?.image"
      :src="aboutIntro?.image.webp ?? ''"
      :placeholder="aboutIntro?.image.avif ?? ''"
      :class="[
        'mx-[7px] mt-[73px] min-h-[30vh] object-contain',
        'lg:mx-[80px] lg:mt-[43px] lg:min-h-[50vh]',
        '3xl:mx-[247px] 3xl:mt-[69px]'
      ]"
      alt="about intro image "
      format="webp"
    />
    <template v-for="item in aboutData" :key="item?.id">
      <div v-if="item.code == 'certificates_slider'" class="mt-[100px] lg:mt-[180px]">
        <h1
          :class="[
            'app-container-small max-w-[282px] !pe-0 text-[30px] font-[600] leading-[110%] tracking-[0.3px]',
            'lg:max-w-full'
          ]"
        >
          {{ certificatesSlider?.[`title_${locale}`] }}
        </h1>
        <LazyScrollWithDragWrapper
          class="mt-[49px] pe-[--container-pe] ps-[--container-ps] lg:mt-[53px] lg:pe-0 lg:ps-0"
        >
          <div
            class="grid auto-cols-max grid-flow-col grid-rows-2 items-end gap-[30px] lg:grid-rows-1"
          >
            <BaseImg
              v-for="certificate in certificates"
              @click="
                () => {
                  modalOpen = true
                  selectedCertificate = certificate
                }
              "
              :key="certificate.id"
              :src="certificate?.image ?? ''"
              class="inline-block h-auto w-auto max-w-[205px] object-contain align-bottom"
              loading="lazy"
              :alt="`certificates ${certificate.id}`"
            />
          </div>
        </LazyScrollWithDragWrapper>
      </div>
      <AboutTemplate
        v-else
        :data="item"
        class="first-of-type:mt-[68px] first-of-type:lg:mt-[62px] first-of-type:3xl:mt-[106px]"
      />
    </template>

    <BaseModal
      v-model:open="modalOpen"
      containerClass="max-w-[310px] sm:max-w-[500px] 3xl:!max-w-[612px]"
      bodyClass="sm:!px-0 px-[30px]"
    >
      <ClickZoom
        img-class="max-h-[85vh] !object-contain"
        :src="selectedCertificate?.image ?? ''"
        :tap-zoom="2.5"
        :max-scale="5"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import AboutTemplate from '~/pages/about/_components/AboutTemplate.vue'
import type { Certificate } from '~/services/certificates.service'
import type { PageSectionItem } from '~/services/pages-section.service'
export type AboutSectionItem = PageSectionItem & {
  code: 'about_intro' | 'certificates_slider' | 'about_goals' | 'about_mission'
}
definePageMeta({
  layoutProps: {
    isWhiteLogo: true,
    selectedTabClass: 'bg-[#0D1667] text-white'
  }
})
usePageHead()

const selectedCertificate = ref<Certificate | null>(null)
const modalOpen = ref(false)
const { locale } = useI18n()
const { data: aboutData } = await useApiAsyncData(() => getPageSection<AboutSectionItem[]>('about'))
const { data: certificates } = await useApiAsyncData(getCertificates)
const aboutIntro = computed(() => aboutData.value?.find((d) => d?.code == 'about_intro'))
const certificatesSlider = computed(() =>
  aboutData.value?.find((d) => d?.code == 'certificates_slider')
)
</script>
<style scoped>
.about-bg {
  background-image: url('~/assets/images/about/background.jpg');
  background-color: #000e69;
  background-repeat: no-repeat;
  background-size: cover;
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
