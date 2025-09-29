<template>
  <div
    :class="[
      'relative h-full w-full rounded-[24px]',
      isYouTube && isPlaying ? 'overflow-visible' : 'overflow-hidden'
    ]"
  >
    <iframe
      v-if="isYouTube"
      class="my-2 block h-full w-full bg-black object-cover"
      :src="iframeSrc"
      title="YouTube video"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture"
      referrerpolicy="origin-when-cross-origin"
      allowfullscreen
    ></iframe>

    <video
      v-else
      ref="videoEl"
      :src="canUseSrc ? src : undefined"
      :poster="poster || undefined"
      :controls="isPlaying"
      :autoplay="autoplay"
      :muted="muted"
      :loop="loop"
      :playsinline="playsinline"
      :preload="preload"
      class="block h-full w-full bg-black object-cover"
      @play="isPlaying = true"
      @ended="onEnded"
    />

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
          'w-[40px] -translate-x-1/2 absolute left-1/2 top-1/2 inline-flex h-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-[#F1F1F1B2] text-2xl text-black transition-colors hover:bg-[#F1F1F1]',
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
import { isHls, getNativeHls, getYouTubeId } from '~/utils/videoFns'
const props = withDefaults(
  defineProps<{
    src: string
    poster?: string
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    playsinline?: boolean
    preload?: 'none' | 'metadata' | 'auto'
  }>(),
  {
    autoplay: false,
    muted: false,
    loop: false,
    playsinline: true,
    preload: 'metadata'
  }
)

const videoEl = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const autoplayFailed = ref(false)

/* ------------ YouTube detection + embed URL --------------- */
const ytId = computed(() => getYouTubeId(props.src || ''))
const isYouTube = computed(() => !!ytId.value)

const ytParams = computed(() => {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: props.autoplay || props.muted ? '1' : '0',
    controls: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1'
  })
  if (props.loop) {
    params.set('loop', '1')
    params.set('playlist', ytId.value) // required by YT for single-video loops
  }
  // enablejsapi optional; not needed for simple autoplay
  return params.toString()
})
const ytEmbedUrl = computed(() =>
  isYouTube.value ? `https://www.youtube.com/embed/${ytId.value}?${ytParams.value}` : ''
)

// We defer assigning iframe src until we actually “play”
const iframeSrc = ref('')
const iframeActive = computed(() => !!iframeSrc.value)

/* ------------ Native video support (MP4/WebM/HLS) ---------- */
const nativeHls = getNativeHls()
const canUseSrc = computed(() => props.src && (!isHls(props.src) || nativeHls))

/* ------------ Overlay visibility --------------------------- */
const showOverlay = computed(() => {
  // When using YouTube with controls, don’t keep an overlay on top while active/autoplaying
  if (isYouTube.value) {
    return !(iframeActive.value || props.autoplay) && !isPlaying.value
  }
  // Native video rules
  if (autoplayFailed.value) return !isPlaying.value
  return !isPlaying.value && !props.autoplay
})

/* ------------ Poster/thumbnail for overlay ----------------- */
const posterToShow = computed(() => {
  if (props.poster) return props.poster
  if (isYouTube.value) {
    // YouTube thumbnail fallback (maxres may not exist; hqdefault is safe)
    return `https://i.ytimg.com/vi/${ytId.value}/hqdefault.jpg`
  }
  return '' // else we keep overlay transparent
})

/* ------------ Playback handlers ---------------------------- */
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

  // Make autoplay policy happy
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
    await startPlayback({ reset: true }) // loops native video; YouTube loops via URL params
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
