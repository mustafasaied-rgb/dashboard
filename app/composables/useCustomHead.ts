import type { MaybeRefOrGetter } from 'vue'

export default function useCustomHead(
  metadata: MaybeRefOrGetter<{
    title?: string
    description?: string
    author?: string
    keywords?: string
    type?: string
    image?: string
    url?: string
  }>
) {
  const metaRef = toRef(metadata)
  const { locale } = useI18n()
  const route = useRoute()
  const url = useRequestURL()

  const baseUrl = `${url.protocol}//${url.host}`
  const fullUrl = computed(() => metaRef.value.url ?? `${baseUrl}${route.fullPath}`)

  return useHead({
    title: () => metaRef.value.title,
    link: [
      { rel: 'canonical', href: fullUrl.value },
      { rel: 'alternate', hreflang: 'x-default', href: fullUrl.value }
    ],
    meta: () => [
      { hid: 'charset', name: 'charset', content: 'utf-8' },
      {
        hid: 'description',
        name: 'description',
        content: metaRef.value.description
      },
      {
        hid: 'author',
        name: 'author',
        content: metaRef.value.author
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: metaRef.value.keywords
      },
      {
        hid: 'og:locale',
        property: 'og:locale',
        content: locale.value === 'ar' ? 'ar_AR' : 'en_US'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: metaRef.value.title
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: metaRef.value.description
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: metaRef.value.type
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: metaRef.value.image
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: fullUrl.value
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: metaRef.value.title
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: metaRef.value.description
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: metaRef.value.image
      },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: fullUrl.value
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: metaRef.value.image
      }
    ]
  })
}
