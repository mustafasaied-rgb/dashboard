import type { ApiResponse, LocalizedPartial } from '~/modules/api/types'
import type { ImageType } from '~/types/utils'

export interface ProductSolutionItem extends LocalizedPartial<'title'> {
  id: number
  category_id: number
  slug: string
  image: ImageType
}
export interface ProductSolutionCategory extends LocalizedPartial<'title'> {
  id: number
  code: 'products' | 'solutions' | (string & {})
  image: string
  status: 0 | 1 | number
  sort_order: number
  created_by_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  items: ProductSolutionItem[]
}
export const useProductsAndSolutions = () => {
  const productsAndSolutions = useState<ProductSolutionCategory[]>('productsAndSolutions', () => [])

  const fetchProductsAndSolutions = async () => {
    if (productsAndSolutions.value.length > 0) return
    const { apiFetch } = useApi()
    try {
      const res = await apiFetch<ApiResponse<ProductSolutionCategory[]>>(
        '/website/home/products-and-solutions'
      )
      productsAndSolutions.value = res?.data ?? []
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch productsAndSolutions:', error)
      productsAndSolutions.value = []
    }
  }
  return {
    productsAndSolutions,
    fetchProductsAndSolutions
  }
}
