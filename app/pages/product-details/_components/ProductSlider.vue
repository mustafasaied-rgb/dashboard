<template>
  <div class="relative w-full">
    <!-- Main image -->
    <BaseImg
      @click="modalOpen = true"
      :src="currentImg?.image_url"
      :alt="currentImg ? currentImg.alt || `Image ${currentIndex + 1}` : 'Image'"
      width="1124"
      height="635"
      loading="lazy"
      class="aspect-[323/205] max-h-[90svh] w-full cursor-pointer rounded-[8px] object-cover xl:aspect-[118/75]"
    />

    <!-- Thumbs -->
    <LazyScrollWithDragWrapper class="mt-[21px] !cursor-pointer">
      <div class="flex gap-[10px]">
        <BaseImg
          v-for="(item, index) in images"
          :key="`list-${index}`"
          @click.stop="goToSlide(index)"
          :src="item?.image_url"
          :alt="item?.alt || `Thumb ${index + 1}`"
          width="60"
          height="60"
          loading="lazy"
          :class="[
            'h-[60px] w-[60px] shrink-0 rounded-full border-[2px] border-solid border-transparent object-cover',
            (item?.id ?? index) === (currentImg?.id ?? currentIndex) && '!border-blue-400'
          ]"
        />
      </div>
    </LazyScrollWithDragWrapper>

    <BaseModal
      v-model:open="modalOpen"
      containerClass="xl:!max-w-fit"
      bodyClass="relative sm:!px-0 px-[10px] "
    >
      <template #floating>
        <button
          type="button"
          aria-label="Previous image"
          @click.stop="prev"
          class="navigation-btn start-2 lg:start-9"
          :disabled="images.length <= 1"
        >
          <ChevronIcon ltrLeft />
        </button>
        <button
          type="button"
          aria-label="Next image"
          @click.stop="next"
          class="navigation-btn end-2 lg:end-9"
          :disabled="images.length <= 1"
        >
          <ChevronIcon ltrRight />
        </button>
      </template>
      <BaseImg
        @click="modalOpen = true"
        :src="currentImg?.image_url"
        :alt="currentImg?.alt || `Image`"
        loading="lazy"
        class="mx-auto block h-auto max-h-[90svh] max-w-full rounded-[8px] object-contain"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, type PropType } from 'vue'

type ImageItem = {
  id?: number | string
  image_url?: string
  alt?: string | null
  [k: string]: unknown
}

const props = defineProps({
  images: {
    type: Array as PropType<ImageItem[]>,
    required: true,
    default: () => []
  }
})

const modalOpen = ref<boolean>(false)

const currentIndex = ref<number>(0)
const currentImg = computed<ImageItem | null>(() => props.images[currentIndex.value] ?? null)

function goToSlide(index: number): void {
  if (!props.images.length) return
  const clamped = Math.min(Math.max(index, 0), props.images.length - 1)
  currentIndex.value = clamped
}

function next(): void {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev(): void {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

onMounted(() => {
  if (props.images.length) {
    currentIndex.value = 0
  }
})

function onKeydown(e: KeyboardEvent): void {
  if (!modalOpen.value) return
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

watch(modalOpen, (open) => {
  if (typeof window === 'undefined') return
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
  }
})
</script>

<style scoped>
.navigation-btn {
  @apply absolute top-1/2 z-10 flex h-[40px] w-[40px] -translate-y-1/2 place-items-center items-center justify-center rounded-full bg-white/50 p-2 shadow backdrop-blur-sm transition-colors hover:bg-white;
  @apply lg:h-[70px] lg:w-[70px];
}
</style>
