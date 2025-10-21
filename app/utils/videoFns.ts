export const isHls = (u = '') => /\.m3u8($|\?)/i.test(u)
export const getNativeHls = () => {
  if (typeof document === 'undefined') return false
  const v = document.createElement('video')
  return !!v.canPlayType && v.canPlayType('application/vnd.apple.mpegurl')
}
export function getYouTubeId(u = '') {
  try {
    const url = new URL(u)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return url.pathname.slice(1)
    if (host.endsWith('youtube.com')) {
      if (url.pathname.startsWith('/watch')) return url.searchParams.get('v') || ''
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/embed/')[1] || ''
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/shorts/')[1] || ''
    }
  } catch {
    return ''
  }
  return ''
}
