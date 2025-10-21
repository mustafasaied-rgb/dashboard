<!-- UploadFilesWithPreview.vue -->
<template>
  <section class="space-y-2.5">
    <UplodeFilesInput
      v-if="!disabled"
      v-model="images"
      :required="true"
      :totalFilesNo="modelValue?.length"
      :maxFiles="maxFiles"
      :isProcessed="true"
      :accept="normalizedAccept"
      :multiple="multiple"
      :maxSizeMB="maxSizeMB"
    >
      <template #input="{ open, isDragging }">
        <div
          class="ds-input ds-dropzone relative flex w-full flex-col items-center justify-center border-dashed p-6 lg:p-10"
          :class="[
            'hover:border-brand-500 dark:hover:border-brand-500',
            isDragging && '!border-brand-500 !dark:border-brand-500',
            disabled && 'pointer-events-none opacity-60'
          ]"
          role="region"
          tabindex="0"
          @click="!disabled && open()"
          @keydown.enter.prevent="!disabled && open()"
          @keydown.space.prevent="!disabled && open()"
          aria-label="Upload images"
        >
          <div class="flex flex-col items-center gap-3 text-center">
            <slot name="icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 29 28"
                class="text-gray-500"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.5 3.917a.75.75 0 0 0-.55.239L8.574 9.532a.833.833 0 1 0 1.06 1.06l4.118-4.115V18.667a.75.75 0 0 0 1.5 0V6.482l4.114 4.11a.75.75 0 1 0 1.06-1.06l-5.342-5.34a.75.75 0 0 0-.584-.276ZM5.916 18.667a.75.75 0 0 0-1.5 0v3.167a2.25 2.25 0 0 0 2.25 2.25h15.668a2.25 2.25 0 0 0 2.25-2.25v-3.167a.75.75 0 0 0-1.5 0v3.167a.75.75 0 0 1-.75.75H6.666a.75.75 0 0 1-.75-.75v-3.167Z"
                />
              </svg>
            </slot>

            <div class="text-theme-xl font-semibold text-gray-700 dark:text-gray-400">
              Drag & Drop files here
            </div>

            <p class="text-sm text-gray-500">
              {{ helperTextComputed }}

              <button
                type="button"
                class="text-brand-500 font-medium underline"
                @click.stop="open()"
              >
                browse
              </button>
            </p>
          </div>
        </div>
      </template>
    </UplodeFilesInput>

    <div class="flex flex-wrap gap-4">
      <figure
        v-for="(image, index) in images"
        :key="image.id || index"
        :class="[
          'group relative flex aspect-square w-[120px] flex-col items-center justify-center',
          'cursor-pointer'
        ]"
      >
        <Button
          type="button"
          rounded
          size="icon_sm"
          variant="solid"
          color="error"
          @click.stop="!disabled && handleDeleteImage(image)"
          class="absolute -start-1.5 -top-1 z-40 hidden place-items-center bg-[#FDFDFD] text-black group-hover:grid"
          aria-label="Remove image"
          title="Remove image"
        >
          ✕
        </Button>

        <div class="peer relative h-full w-full overflow-hidden rounded-lg bg-transparent">
          <img
            :src="image.src || '#'"
            :alt="image.alt || 'preview'"
            :loading="'lazy'"
            :class="['h-full w-full bg-cover object-cover', image?.isProcessing && 'blur-[2px]']"
          />
        </div>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'

/** Keep the same shape as the child for safety */
export interface PreviewFile {
  id: string
  src: string | null
  file: File
  originalFile: File
  progress: number
  isProcessing: boolean
  processingProgress: number
  alt?: string
}

const emits = defineEmits<{
  (e: 'update:modelValue', v: PreviewFile[]): void
  (e: 'delete', img: PreviewFile): void
}>()

const props = withDefaults(
  defineProps<{
    modelValue: PreviewFile[]
    accept?: string // e.g. "image/*,.svg,.pdf"
    multiple?: boolean
    maxFiles?: number
    maxSizeMB?: number
    label?: string
    helperText?: string
    showPreviews?: boolean
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: () => [],
    accept: 'image/*', // allow SVG explicitly if you want it
    multiple: true,
    maxFiles: 8,
    maxSizeMB: 5,
    label: '',
    helperText: '',
    showPreviews: true,
    required: false,
    disabled: false
  }
)

const normalizedAccept = computed(() => props.accept || 'image/*')

const helperTextComputed = computed(() => {
  const size = `${props.maxSizeMB}MB`
  const acceptText = props.accept === 'image/*' ? 'PNG, JPG, WebP' : props.accept
  return props.helperText || `${acceptText} up to ${size}`
})

const images = computed<PreviewFile[]>({
  get: () => props.modelValue || [],
  set: (newVal) => emits('update:modelValue', [...newVal])
})

function revokeImageURL(img: PreviewFile) {
  try {
    if (img?.src && img.src.startsWith('blob:')) {
      URL.revokeObjectURL(img.src)
    }
  } catch {}
}

function handleDeleteImage(image: PreviewFile) {
  revokeImageURL(image)
  images.value = images.value.filter((img) => img.id !== image.id)
  emits('delete', image)
}

onBeforeUnmount(() => {
  for (const img of images.value) revokeImageURL(img)
})
</script>

<style scoped></style>
