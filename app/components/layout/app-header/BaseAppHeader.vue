<template>
  <section
    :class="[
      'app-container navbar-dir absolute z-40 flex h-fit w-full items-center justify-between bg-transparent transition-colors duration-300',
      'pt-[--header-pt]'
    ]"
  >
    <!-- Left Logo Section -->
    <article
      @click="navigateTo('/')"
      v-if="showLeftLogo"
      class="-mt-[17px] hidden gap-[27px] lg:flex"
    >
      <BaseImg
        :key="String(isWhiteLogo)"
        densities="x1 x2"
        format="webp"
        :src="isWhiteLogo ? settings?.logo_light : settings?.logo_dark"
        :class="['mb-[7px] h-[68px] w-[130px] self-start hover:cursor-pointer']"
        :fallback="ASC_Logo_Main"
        alt="Left ASTC Logo Main"
      />
      <h3
        v-if="settings?.[`title_${locale}`]"
        :class="[
          'max-w-[155px] self-end text-xl font-[400] not-italic leading-[21px] tracking-[0.2px] text-[#18264A]',
          isWhiteLogo ? 'text-white' : 'text-[#18264A]',
          'hidden xl:block'
        ]"
      >
        {{ settings?.[`title_${locale}`] }}
      </h3>
    </article>

    <!-- Center Vision Logo -->
    <SaudiVision
      :isWhiteLogo="isWhiteLogo"
      :showLeftLogo="showLeftLogo"
      class="mb-[10px] self-end"
    />

    <!-- Mobile Logo -->
    <ClientOnly>
      <div
        @click="navigateTo('/')"
        :class="['-ms-[50px] -mt-6 mb-0 block h-[55px] w-[106px]', 'lg:hidden']"
      >
        <BaseImg
          densities="x1 x2"
          format="webp"
          :src="isWhiteLogo ? settings?.logo_light : settings?.logo_dark"
          class="h-full w-full"
          :fallback="ASC_Logo_Main"
          alt="Left ASTC Logo Main"
        />
      </div>
    </ClientOnly>

    <article class="flex items-center gap-[40px]">
      <div class="hidden lg:block">
        <slot name="languageSwitcher" />
      </div>
      <!-- floating-section -->
      <div
        class="desktopMenu-placeholder hidden lg:block"
        :style="{ width: desktopMenuWidth + 'px' }"
      >
        <slot
          name="desktopMenu"
          :floatingClass="'fixed end-[--container-pe] top-[--header-pt] z-[100] hidden lg:flex'"
        />
      </div>
      <div class="mobileMenu-placeholder block lg:hidden">
        <slot
          name="mobileMenu"
          :floatingClass="'absolute end-[--container-pe] top-[--header-pt] z-[100]'"
        />
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
const ASC_Logo_Main = '/Icons/ASC_Logo_Main.svg'
withDefaults(
  defineProps<{
    showLeftLogo?: boolean
    isWhiteLogo?: boolean
    desktopMenuWidth?: string | number
  }>(),
  {
    showLeftLogo: true,
    isWhiteLogo: false,
    desktopMenuWidth: ''
  }
)

const { locale } = useI18n()
const { settings } = useWebsiteSettings()
</script>
