import type { ApiResponse } from '~/modules/api/types'
export type Certificate = {
  id: number
  name_en: string
  name_ar: string
  image: string | null
  image_alt: string | null
  status: number
  order: number
  created_at: string
  updated_at: string
}

export type Certificates = Certificate[]

export async function getCertificates() {
  const { apiFetch } = useApi()
  const res = await apiFetch<ApiResponse<Certificates>>('/website/home/certificates', {
    method: 'GET'
  })
  return res.data || []
}
