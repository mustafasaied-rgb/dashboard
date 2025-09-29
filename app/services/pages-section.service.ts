import type { ApiResponse } from '~/modules/api/types'
import type { ImageType } from '~/types/utils'

export const SectionCodes = [
  'hero_tiles',
  'news_bar',
  'vision',
  'custom_development',
  'trusted_customers',
  'digital_cloud',
  'trusted_partners',
  'vision2030'
] as const

export type SectionCode = (typeof SectionCodes)[number] | (string & {}) // allow unforeseen codes
export type HtmlString = string

export type PageSectionItem = {
  id: number
  code: SectionCode
  page_id: number
  title_en: string | null
  title_ar: string | null
  content_en: HtmlString | null
  content_ar: HtmlString | null
  image: ImageType | null
  cta_text_en: string | null
  cta_text_ar: string | null
  cta_link: string | null
  type: 'dynamic' | 'static' | (string & {})
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by_id: number | null
}

export type PageSections = PageSectionItem[]

export async function getPageSection<T = PageSections>(slug: string): Promise<T> {
  const { apiFetch } = useApi()
  const res = await apiFetch<ApiResponse<T>>(`/website/home/page/sections/${slug}`)
  return res.data
}

export async function getPageSectionRaw<T>(slug: string): Promise<ApiResponse<T>> {
  const { apiFetch } = useApi()
  return apiFetch<ApiResponse<T>>(`/website/home/page/sections/${slug}`)
}

/* ------------------------------------ Usage ------------------------------------

const sections = await getPageSection<PageSections>('home')
const res = await getPageSectionRaw<PageSections>('home') // typed ApiResponse wrapper

------------------------------------------------------------------------------- */
