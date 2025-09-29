import { useState } from '#app'
import type { Ref } from 'vue'
import type { ApiResponse, LocalizedPartial } from '~/modules/api/types'
interface Page
  extends LocalizedPartial<
    'title' | 'content' | 'meta_title' | 'meta_description' | 'meta_keywords'
  > {
  id: number
  slug: string
  type: 'home' | 'product-and-solution' | 'news' | 'about' | 'contact' | 'other'
  status: 0 | 1 | number
  sort_order: number
  created_by_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export const usePages = () => {
  const pages = useState<Page[]>('pages', () => []) as Ref<Page[]>
  const { apiFetch } = useApi()

  const fetchPages = async (): Promise<void> => {
    if (pages.value.length > 0) return
    try {
      const res = await apiFetch<ApiResponse<Page[]>>('/website/home/page')
      pages.value = res?.data ?? []
    } catch (error) {
      console.error('Failed to fetch pages:', error)
      pages.value = []
    }
  }

  const getPage = (pageSlug: string): Page | null =>
    pages.value.find((p) => p.slug === pageSlug) ?? null

  return {
    pages,
    fetchPages,
    getPage
  }
}
