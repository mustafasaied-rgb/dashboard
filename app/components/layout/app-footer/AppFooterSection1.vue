<template>
  <article
    :class="[
      'app-container flex w-full flex-col text-xl-heading font-[200] not-italic leading-[49.4px] tracking-[0.52px] text-black',
      'lg:grid lg:grid-cols-12 lg:gap-y-[20px]',
      '3xl:text-3xl-heading 3xl:leading-[85.5px] 3xl:tracking-[0.9px]'
    ]"
  >
    <a
      v-if="settings?.phones?.[0]"
      dir="ltr"
      :href="`tel:${settings?.phones?.[0]}`"
      class="phone-number col-span-5 cursor-default whitespace-nowrap hover:text-[#1778FF]"
    >
      {{ settings?.phones?.[0] }}
    </a>
    <div :class="['flex flex-col gap-[28px]', 'lg:col-span-4 lg:gap-[41px]', '3xl:col-span-5']">
      <a v-if="settings?.mail" href="mailto:info@astc.com.sa">{{ settings?.mail }}</a>
      <h3
        v-if="settings?.[`address_${locale}`]"
        class="block max-w-[230px] pe-[30px] text-xl font-normal not-italic leading-[105%] tracking-[0.2px] 3xl:hidden"
      >
        {{ settings?.[`address_${locale}`] }}
      </h3>
    </div>
    <div
      :class="[
        'mx-0 mt-[35px] flex flex-wrap items-center gap-[21px]',
        'lg:col-span-3 lg:mx-auto lg:mt-0 lg:gap-8 lg:self-start',
        '3xl:col-span-2 3xl:mx-0 3xl:gap-8 3xl:self-center'
      ]"
    >
      <template v-for="(value, key) in settings?.social_links || {}" :key="key">
        <a v-if="value" :href="value" :title="value" target="_blank">
          <component
            :is="socials?.[key]"
            :key="key"
            class="w-[45px] lg:w-[68px]"
            :color="themeColor"
            :hoverColor="'#1778FF'"
          />
        </a>
      </template>
    </div>
  </article>
</template>

<script setup lang="ts">
import XTwitterIcon from '~/components/icons/XTwitterIcon.vue'
import LinkedinIcon from '~/components/icons/LinkedinIcon.vue'
import FacebookIcon from '~/components/icons/FacebookIcon.vue'
import InstagramIcon from '~/components/icons/InstagramIcon.vue'
import YoutubeIcon from '~/components/icons/YoutubeIcon.vue'
defineProps<{
  themeColor?: string
}>()
const { locale } = useI18n()
const { settings } = useWebsiteSettings()
const socials = {
  twitter: XTwitterIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon
}
</script>
<style scoped>
.phone-number {
  place-self: baseline;
}
</style>
