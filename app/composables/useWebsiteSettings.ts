import type { ApiResponse, LocalizedPartial } from '~/modules/api/types'

type SocialKey = 'twitter' | 'youtube' | 'facebook' | 'linkedin' | 'instagram'

interface SiteSettings
  extends LocalizedPartial<
    'title' | 'description' | 'keywords' | 'saudi_vision_title' | 'address' | 'footer'
  > {
  id: number
  mail: string
  url: string
  logo_light: string
  logo_dark: string
  favicon: string
  saudi_vision: string
  social_links: Record<SocialKey, string | null>
  phones: string[]
  latitude: string
  longitude: string
  footer: string
  created_at: string
  updated_at: string
}

export const useWebsiteSettings = () => {
  const settings = useState<SiteSettings | null>('websiteSettings', () => null)
  const { apiFetch } = useApi()

  const fetchSettings = async () => {
    if (settings.value) return
    try {
      const res = await apiFetch<ApiResponse<SiteSettings>>('/website/general/setting')
      settings.value = res?.data || null
    } catch (error) {
      console.error('Failed to fetch website settings:', error)
      settings.value = null
    }
  }

  return {
    settings,
    fetchSettings
  }
}
