<template>
  <div :class="['relative overflow-hidden rounded-lg', aspectRatioClass]">
    <!-- YouTube -->
    <iframe
      v-if="isYouTube"
      class="absolute inset-0 h-full w-full bg-black object-cover"
      :src="iframeSrc"
      :title="title"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      referrerpolicy="origin-when-cross-origin"
      allowfullscreen
    ></iframe>

    <!-- Native video -->
    <video
      v-else
      ref="videoEl"
      class="absolute inset-0 h-full w-full bg-black object-cover"
      :src="canUseSrc ? src : undefined"
      :poster="poster || undefined"
      :controls="isPlaying"
      :autoplay="autoplay"
      :muted="muted"
      :loop="loop"
      :playsinline="playsinline"
      :preload="preload"
      @play="isPlaying = true"
      @ended="onEnded"
    ></video>

    <!-- Overlay (poster + play button) -->
    <button
      v-if="showOverlay"
      type="button"
      @click="handlePlay"
      class="absolute inset-0 h-full w-full overflow-hidden focus:outline-none"
      :class="{ 'pointer-events-none': isYouTube && iframeActive }"
      aria-label="Play video"
    >
      <BaseImg
        v-if="posterToShow"
        :src="posterToShow"
        alt="poster"
        aria-hidden="true"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <span
        :class="[
          'absolute top-1/2 left-1/2 inline-flex h-[40px] w-[40px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F1F1F1B2] text-2xl text-black transition-colors hover:bg-[#F1F1F1]',
          'lg:h-[80px] lg:w-[80px]'
        ]"
        aria-hidden="true"
      >
        <PlayIcon />
      </span>
      <span class="sr-only">Play</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, withDefaults } from 'vue'

type AspectRatio = '16:9' | '4:3' | '21:9' | '1:1'

/** Props mirror your original features, plus aspect ratio + optional explicit yt id */
const props = withDefaults(
  defineProps<{
    /** Accept a full URL (YouTube or direct file / HLS) */
    src: string
    /** Optional explicit YouTube id; if omitted we try to extract from src */
    videoId?: string
    poster?: string
    title?: string
    aspectRatio?: AspectRatio
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    playsinline?: boolean
    preload?: 'none' | 'metadata' | 'auto'
  }>(),
  {
    title: 'YouTube video',
    aspectRatio: '16:9',
    autoplay: false,
    muted: false,
    loop: false,
    playsinline: true,
    preload: 'metadata'
  }
)

/* ------------------ helpers (inline, no external utils) ------------------ */
const YT_REGEX =
  /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/

const getYouTubeId = (input: string) => {
  if (props.videoId) return props.videoId
  const m = input.match(YT_REGEX)
  return m ? m[1] : ''
}

const isHls = (u: string) => /\.m3u8(\?|$)/i.test(u)
const getNativeHls = () => {
  const v = document.createElement('video')
  return !!(v.canPlayType && v.canPlayType('application/vnd.apple.mpegurl'))
}

/* ------------------ state ------------------ */
const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const autoplayFailed = ref(false)

/* ------------------ YouTube detection + URL ------------------ */
const ytId = computed(() => getYouTubeId(props.src || ''))
const isYouTube = computed(() => !!ytId.value)

const ytParams = computed(() => {
  const p = new URLSearchParams({
    autoplay: '1',
    mute: props.autoplay || props.muted ? '1' : '0',
    controls: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1'
  })
  if (props.loop) {
    p.set('loop', '1')
    p.set('playlist', ytId.value || '')
  }
  return p.toString()
})

const ytEmbedUrl = computed(() =>
  isYouTube.value ? `https://www.youtube.com/embed/${ytId.value}?${ytParams.value}` : ''
)

/** we defer iframe src until playback to preserve overlay behavior */
const iframeSrc = ref('')
const iframeActive = computed(() => !!iframeSrc.value)

/* ------------------ Native src / HLS capability ------------------ */
const nativeHls = getNativeHls()
const canUseSrc = computed(() => props.src && (!isHls(props.src) || nativeHls))

/* ------------------ Aspect ratio classes (Tailwind) -------------- */
const aspectRatioClass = computed(() => {
  const map: Record<AspectRatio, string> = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    '21:9': 'aspect-21/9',
    '1:1': 'aspect-square'
  }
  return map[props.aspectRatio]
})

/* ------------------ Overlay visibility ------------------ */
const showOverlay = computed(() => {
  if (isYouTube.value) {
    return !(iframeActive.value || props.autoplay) && !isPlaying.value
  }
  if (autoplayFailed.value) return !isPlaying.value
  return !isPlaying.value && !props.autoplay
})

/* ------------------ Poster logic ------------------ */
const posterToShow = computed(() => {
  if (props.poster) return props.poster
  if (isYouTube.value && ytId.value) {
    return `https://i.ytimg.com/vi/${ytId.value}/hqdefault.jpg`
  }
  return ''
})

/* ------------------ Playback handlers ------------------ */
async function startPlayback({ reset = false } = {}) {
  if (isYouTube.value) {
    iframeSrc.value = ytEmbedUrl.value
    isPlaying.value = true
    autoplayFailed.value = false
    return
  }

  const el = videoEl.value
  if (!(el instanceof HTMLVideoElement)) return

  if (!canUseSrc.value) {
    isPlaying.value = false
    autoplayFailed.value = true
    return
  }

  // Satisfy autoplay policies (muted if auto)
  if (props.autoplay && !props.muted) el.muted = true
  if (reset) {
    try {
      el.currentTime = 0
    } catch {}
  }

  try {
    isPlaying.value = true
    await el.play()
    autoplayFailed.value = false
  } catch {
    isPlaying.value = false
    autoplayFailed.value = true
  }
}

function handlePlay() {
  autoplayFailed.value = false
  startPlayback()
}

async function onEnded() {
  if (props.autoplay) {
    await startPlayback({ reset: true })
    return
  }
  isPlaying.value = false
  const el = videoEl.value
  if (el) {
    try {
      el.pause()
      el.currentTime = 0
      el.load()
    } catch {}
  }
}

onMounted(async () => {
  await nextTick()
  if (props.autoplay) {
    await startPlayback()
  }
})
</script>
