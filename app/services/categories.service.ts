import type { ApiResponse } from '~/modules/api/types'
import type { ImageType } from '~/types/utils'

export type Category = {
  id: number
  title_en: string
  title_ar: string
  code: string
  image: ImageType
  status: number
  sort_order: number
  created_by_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  single_item_slug?: string | null
}

export async function getCategories() {
  const { apiFetch } = useApi()
  const res = await apiFetch<ApiResponse<Category[]>>('/website/home/categories')
  return res.data || []
}

/** Minimal shape returned inside each item under `category` */
export type CategorySummary = Pick<Category, 'id' | 'title_en' | 'title_ar'>

/** Single item in /website/home/categories/:id/items */
export type CategoryItem = {
  id: number
  category_id: number
  title_en: string
  title_ar: string
  image: ImageType
  cover_image: string
  meta_title_en: string | null
  meta_title_ar: string | null
  meta_desc_en: string | null
  meta_desc_ar: string | null
  document: string | null
  slug: string
  status: number
  created_at: string
  updated_at: string
  category: CategorySummary
}

export type CategoryItems = CategoryItem[]
export type CategoryItemsResponse = ApiResponse<CategoryItems>

export async function getCategoryDetails(id: string | number) {
  const { apiFetch } = useApi()
  const res = await apiFetch<CategoryItemsResponse>(`/website/home/categories/${id}/items`)
  return res.data || []
}
