import type { PaginatedResponse, ApiResponse } from '~/modules/api/types'
type PartnerTypes = 'corporate' | 'government' | (string & {})
type Partner = {
  id: number
  name_en: string
  name_ar: string
  logo: string
  type: PartnerTypes
  url: string
  status: number
  sort_order: number
  created_by_id: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
type Partners = Partner[]

export async function getPartners(type: PartnerTypes) {
  const { apiFetch } = useApi()
  const res = await apiFetch<ApiResponse<Partners>>('/website/home/partners', {
    method: 'GET',
    query: { type }
  })
  return res.data || []
}
