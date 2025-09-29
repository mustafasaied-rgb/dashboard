<template>
  <article @click="navigateTo('/')" class="group flex items-center gap-[30px]">
    <BaseImg
      densities="x1 x2"
      format="webp"
      :src="settings?.saudi_vision"
      :class="[
        'gray-overlay w-[50px]',
        'lg:w-[62px]',
        enableHover
          ? isWhiteLogo
            ? 'group-hover:brightness-0 group-hover:invert-[1]'
            : 'group-hover:filter-none'
          : isWhiteLogo
            ? 'brightness-0 invert-[1]'
            : 'filter-none'
      ]"
      :fallback="saudi_vision"
      alt="saudi vision"
    />
    <h3
      :class="[
        'hidden max-w-[190px] text-lg font-[300] not-italic leading-[100%] tracking-[0.2px] text-[#A9AEB8]',
        'xl:text-xl xl:max-w-[210px]',
        showLeftLogo ? '3xl:block' : 'lg:block',
        enableHover
          ? isWhiteLogo
            ? 'group-hover:text-white'
            : 'group-hover:text-black'
          : isWhiteLogo
            ? 'text-white'
            : 'text-black'
      ]"
    >
      {{ settings?.[`saudi_vision_title_${locale}`] }}
    </h3>
  </article>
</template>

<script setup lang="ts">
const saudi_vision = '/Icons/vision_2030.svg'
withDefaults(
  defineProps<{
    showLeftLogo?: boolean
    isWhiteLogo?: boolean
    enableHover?: boolean
  }>(),
  {
    showLeftLogo: true,
    isWhiteLogo: false,
    enableHover: true
  }
)

const { locale } = useI18n()
const { settings } = useWebsiteSettings()
</script>
