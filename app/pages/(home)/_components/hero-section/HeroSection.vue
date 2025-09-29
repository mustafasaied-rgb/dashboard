<template>
  <section
    :class="[
      'flex w-full flex-col justify-between gap-[105px] overflow-y-auto overflow-x-hidden pb-[108.3px] font-zarid text-[#465ae5]',
      'lg:justify-start lg:gap-[162px] lg:pb-[126px]',
      '3xl:gap-0 3xl:pb-[175px]'
    ]"
  >
    <article
      :class="[
        'app-container relative z-10 w-full pt-[152px]',
        'lg:h-fit lg:pt-[203px]',
        '3xl:h-[665px] 3xl:pt-[243px]'
      ]"
    >
      <video
        autoplay
        muted
        loop
        playsinline
        disablePictureInPicture
        disableRemotePlayback
        preload="metadata"
        fetchpriority="high"
        id="myVideo"
        class="absolute left-1/2 top-0 -z-10 max-h-screen w-[150%] -translate-x-1/2 xl:w-full"
      >
        <source src="/videos/main_head.mp4" type="video/mp4" />
      </video>

      <div
        :class="[
          'relative flex w-full flex-col flex-wrap items-center justify-start gap-[39px]',
          'lg:flex-row lg:flex-nowrap lg:items-start lg:justify-start lg:gap-[15vw]',
          '3xl:justify-start 3xl:gap-[338.1px]'
        ]"
      >
        <div
          :class="[
            'content-transition mb-0 hidden h-[55px] w-[106px]',
            'lg:block lg:h-[141px] lg:w-[269.91px]',
            '3xl:mb-[12px] 3xl:h-[209px] 3xl:w-[400.09px]'
          ]"
        >
          <BaseImg
            densities="x1 x2"
            format="webp"
            :src="settings?.logo_dark || ASC_Logo_Main"
            :class="['h-full w-full']"
            alt="ASTC Logo Main"
          />
        </div>

        <h1
          :class="[
            'mt-0 flex flex-col items-center gap-0 text-center text-[20px] font-normal leading-[105%] tracking-[0.3px] text-[#18264a]',
            'lg:items-start lg:self-end lg:text-[32px] lg:font-[350] lg:leading-[100%] lg:tracking-[0.4px]',
            'xl:text-start xl:text-xl-heading xl:font-light xl:leading-[95%] xl:tracking-[0.52px]'
          ]"
        >
          <span :class="['inline-block font-[400]', 'xl:font-[300]']">
            {{ settings?.[`title_${locale}`] }}
          </span>

          <span :class="['inline-block font-[600]', 'xl:font-[500]']">
            {{ settings?.[`description_${locale}`] }}
          </span>
        </h1>
      </div>
    </article>

    <article class="content-transition relative z-10 h-[415.7px] xl:h-[580px]">
      <ServicesSlider />
    </article>
  </section>
</template>

<script setup lang="ts">
import ServicesSlider from '~/pages/(home)/_components/hero-section/services-slider/ServicesSlider.vue'
const ASC_Logo_Main = '/Icons/ASC_Logo_Main.svg'
const { locale } = useI18n()
const { settings } = useWebsiteSettings()
</script>
<style></style>
