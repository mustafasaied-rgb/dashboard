<template>
  <NuxtLayout>
    <Toaster
      position="top-right"
      rich-colors
      :toastOptions="{
        class: locale == 'ar' ? 'font-arabic' : 'font-zarid',
        descriptionClass: locale == 'ar' ? 'font-arabic' : 'font-zarid'
      }"
    />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
const config = useRuntimeConfig()
const { locale } = useI18n()

const { fetchPages } = usePages()
const { settings, fetchSettings } = useWebsiteSettings()
await fetchSettings()
await fetchPages()

// ---- i18n SEO head (canonical + hreflang + og:locale + <html lang/dir>) ----
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id'
})

const staticMetaData = computed(() => ({
  title: settings?.value?.[`meta_title_${locale.value}`] || 'ASTC',
  description:
    settings?.value?.[`meta_description_${locale.value}`] ||
    'ASTC has been a trusted contractor in Saudi Arabia since 2007, delivering expert-level Project Management, Telecom Engineering, and IT services.',
  type: 'website',
  image: settings.value?.favicon || `${config?.public?.SITE_URL}/favicon.ico`,
  keywords:
    settings?.value?.[`keywords_${locale.value}`] ||
    'ASTC, Arabian for Science and Technology Co., Saudi contractor, project management, telecom, IT services',
  author: 'ASTC'
}))

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
    dir: i18nHead.value.htmlAttrs?.dir
  },
  link: [
    ...(i18nHead.value.link || []),
    {
      rel: 'icon',
      type: 'image/png',
      href: staticMetaData.value.image
    }
  ],
  meta: () => [
    ...(i18nHead.value.meta || []),
    { hid: 'charset', name: 'charset', content: 'utf-8' },
    {
      hid: 'google-site-verification',
      name: 'google-site-verification',
      content: 'H8voC-L5KI15dtVu1tZZDkI6lTkW9BI77FhZCJgM_q8'
    },
    {
      hid: 'description',
      name: 'description',
      content: staticMetaData.value.description
    },
    {
      hid: 'author',
      name: 'author',
      content: staticMetaData.value.author
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: staticMetaData.value.keywords
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: staticMetaData.value.title
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: staticMetaData.value.description
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: staticMetaData.value.type
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: staticMetaData.value.image
    },
    // {
    //   hid: 'og:url',
    //   property: 'og:url',
    //   content: staticMetaData.value.url
    // },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: staticMetaData.value.title
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: staticMetaData.value.description
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: staticMetaData.value.image
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: staticMetaData.value.url
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  ],
  title: () => staticMetaData.value.title
}))
</script>
