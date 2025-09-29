export default function usePageHead(pageSlug?: string) {
  const route = useRoute()
  const formattedPageSlug = pageSlug || (route.name == 'index' ? 'home' : (route.name as string))
  const { locale } = useI18n()
  const { getPage } = usePages()
  const PageInfo = getPage(formattedPageSlug)
  useCustomHead(() => ({
    title: PageInfo?.[`meta_title_${locale.value}`],
    description: PageInfo?.[`meta_description_${locale.value}`],
    keywords:
      PageInfo?.[`meta_keywords_${locale.value}`] ?? PageInfo?.[`meta_title_${locale.value}`]
  }))
}
