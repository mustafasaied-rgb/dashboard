import type { PaginatedResponse, ApiResponse } from '~/modules/api/types'
import type { ImageType } from '~/types/utils'

export type NewsItem = {
  id: number
  testimonial_id: number
  title_en: string
  title_ar: string
  slug: string
  content_en: string
  content_ar: string
  image: ImageType
  video_url: string | null
  status: string
  published_at: string // ISO date, e.g. "2025-08-18"
  meta_title_en?: string
  meta_title_ar?: string
  meta_desc_en?: string
  meta_desc_ar?: string
  meta_keywords_ar?: string
  meta_keywords_en?: string
  created_at?: string
  updated_at?: string
}

export async function getNews(params?: Record<string, any>) {
  const { apiFetch } = useApi()
  return apiFetch<PaginatedResponse<NewsItem>>('/website/news', {
    method: 'GET',
    query: params
  })
}

type Testimonial = {
  id: number
  image: ImageType
  name_en: string
  name_ar: string
  position_en: string
  position_ar: string
  content_en: string
  content_ar: string
}

type NewsDetail = NewsItem & {
  testimonial?: Testimonial
}
export async function getNewsDetail(slug: string) {
  const { apiFetch } = useApi()
  return apiFetch<ApiResponse<NewsDetail>>(`/website/news/${slug}`)
}
